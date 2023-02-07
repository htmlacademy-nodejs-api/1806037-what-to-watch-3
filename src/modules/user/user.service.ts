import { DocumentType } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { validate } from 'class-validator';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { fillTransformObject } from '../../assets/helper/helpers.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { UserEntity } from '../../common/database/entity/user.entity.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { FavoriteFilmsUserDto } from './dto/favorite-films-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.ConfigInterface) private readonly config: ConfigInterface,
    @inject(ComponentSymbolEnum.UserModel) private readonly userModel: ModelType<UserEntity>,
  ) { }


  async create(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const transformBody = fillTransformObject(CreateUserDto, dto);
    const errors = await validate(transformBody);

    if (errors.length > 0) {
      throw errors.toString();
    }

    const { email, password } = transformBody;
    const existUser = await this.findByEmail(email);

    if (existUser) {
      throw new Error(`Пользователь с данным email: ${email} уже создан.`);
    }

    const newUser = new UserEntity(transformBody).setPasswordHash(password, this.config.get('SALT'));

    const result = this.userModel.create(newUser);
    this.logger.info(`New user: ${email} is created.`);

    return result;
  }

  async login(dto: LoginUserDto) {
    const { email } = dto;

    const existUser = await this.findByEmail(email);

    if (!existUser) {
      throw new Error(`Пользователь с данным email: ${email} не зарегистрирован.`);
    }

    // Дальнейшая реализация
  }

  async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findOne({
      email: email,
    });
  }

  async updateById(_id: string, _dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    throw new Error('Method not implemented.');
  }

  async getFavoriteFilmsList(userId: string): Promise<FavoriteFilmsUserDto | null> {
    return await this.userModel.findById(userId, { favoriteFilms: 1, });
  }

  async addFavoriteFilm(userId: string, filmId: string): Promise<void> {
    const result = await this.userModel.findById(userId, { favoriteFilms: 1, });

    if (!result) {
      throw new Error(`User this with ID: ${userId} is not exist.`);
    }

    if (result?.favoriteFilms.some((item) => item.toString() === filmId)) {
      throw new Error(`Film this with ID: ${filmId} already added to favorites.`);
    }

    result?.favoriteFilms.push(new Types.ObjectId(filmId));
    await result?.save();
  }

  async removeFavoriteFilm(userId: string, filmId: string): Promise<void> {
    const result = await this.userModel.findById(userId, { favoriteFilms: 1, });

    if (!result) {
      throw new Error(`User this with ID: ${userId} `);
    }

    if (!result?.favoriteFilms.some((item) => item.toString() === filmId)) {
      throw new Error(`Film this with ID: ${filmId} missing from favorites.`);
    }

    result.favoriteFilms = result?.favoriteFilms.filter((item) => !(item.toString() === filmId));
    await result?.save();
  }

}
