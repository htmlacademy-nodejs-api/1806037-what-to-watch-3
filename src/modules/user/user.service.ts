import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject, ModelType } from '@typegoose/typegoose/lib/types.js';
import { inject, injectable } from 'inversify';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { UserEntity } from '../../common/database/entity/user.entity.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.ConfigInterface) private readonly config: ConfigInterface,
    @inject(ComponentSymbolEnum.UserModel) private readonly userModel: ModelType<UserEntity>,
  ) { }

  async create(dto: CreateUserDto): Promise<DocumentType<UserEntity, BeAnObject>> {
    const { email, password } = dto;
    const existUser = await this.findByEmail(email);

    if (!existUser) {
      throw new Error(`Пользователь с данным email: ${email} уже создан.`);
    }

    const newUser = new UserEntity(dto).setPasswordHash(password, this.config.get('SALT'));

    const result = this.userModel.create(newUser);
    this.logger.info(`New user: ${email} is created.`);

    return result;
  }

  async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return await this.userModel.findOne({
      email: email,
    });
  }

}
