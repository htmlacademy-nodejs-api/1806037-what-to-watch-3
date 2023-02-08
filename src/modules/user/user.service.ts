import { DocumentType } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { validate } from 'class-validator';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { ConstantValue } from '../../assets/constant/constants.js';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { fillTransformObject, verifyJWT } from '../../assets/helper/helpers.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { LogoutUserEntity } from '../../common/database/entity/logout-user.entity.js';
import { UserEntity } from '../../common/database/entity/user.entity.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { FavoriteFilmsUserDto } from './dto/favorite-films-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { LogoutUserDto } from './dto/logout-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';


@injectable()
export default class UserService implements UserServiceInterface {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.ConfigInterface) private readonly config: ConfigInterface,
    @inject(ComponentSymbolEnum.UserModel) private readonly userModel: ModelType<UserEntity>,
    @inject(ComponentSymbolEnum.LogoutUserModel) private readonly logoutUserModel: ModelType<LogoutUserEntity>,
  ) {
    this.bypassDatabase();
  }

  async bypassDatabase() {
    setInterval(async () => {
      let page = 1;

      const result = await this.logoutUserModel.find({}, {}, {
        limit: ConstantValue.LIMIT_BYPASS_LOGOUT_USER_COUNT,
        skip: ConstantValue.LIMIT_BYPASS_LOGOUT_USER_COUNT * (page - 1),
      });

      const recursionFn = async (array: DocumentType<LogoutUserEntity>[]) => {
        for await (const item of array) {
          if (await verifyJWT(item.accessToken, this.config.get('JWT_SECRET'))) {
            continue;
          }

          await this.logoutUserModel.deleteOne({
            accessToken: item.accessToken,
          });
        }

        page++;

        const nextResult = await this.logoutUserModel.find({}, {}, {
          limit: ConstantValue.LIMIT_BYPASS_LOGOUT_USER_COUNT,
          skip: ConstantValue.LIMIT_BYPASS_LOGOUT_USER_COUNT * (page - 1),
        });

        if (nextResult.length < ConstantValue.LIMIT_BYPASS_LOGOUT_USER_COUNT) {
          for await (const item of nextResult) {
            if (await verifyJWT(item.accessToken, this.config.get('JWT_SECRET'))) {
              continue;
            }

            await this.logoutUserModel.deleteOne({
              accessToken: item.accessToken,
            });
          }

          return;
        }

        recursionFn(nextResult);
      };

      recursionFn(result);

    }, ConstantValue.BYPASS_DATABASE_TIME);
  }


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
    const { email, password } = dto;

    const existUser = await this.findByEmail(email);

    if (!existUser) {
      throw new Error(`Пользователь с данным email: ${email} не зарегистрирован.`);
    }

    if (!existUser.verifyPassword(password, this.config.get('SALT'))) {
      throw new Error('Неверный пароль.');
    }

    return existUser;
  }


  async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findOne({
      email: email,
    });
  }

  async checkAccessToken(accessToken: string): Promise<void> {
    await this.logoutUserModel.findOne({
      accessToken: accessToken
    }).then((res) => {
      if (res !== null) {
        throw new Error('This token was used to exit the application');
      }
    });
  }

  async logout(dto: LogoutUserDto): Promise<void> {
    await this.logoutUserModel.create(new LogoutUserEntity(dto));
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
