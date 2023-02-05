import { Container } from 'inversify';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { UserEntity, UserModel } from '../../common/database/entity/user.entity.js';
import { UserServiceInterface } from '../../modules/user/user-service.interface.js';
import UserService from '../../modules/user/user.service.js';

const userDIContainer = new Container();

userDIContainer.bind<ModelType<UserEntity>>(ComponentSymbolEnum.UserModel).toConstantValue(UserModel);
userDIContainer.bind<UserServiceInterface>(ComponentSymbolEnum.UserServiceInterface).to(UserService).inSingletonScope();

export { userDIContainer };
