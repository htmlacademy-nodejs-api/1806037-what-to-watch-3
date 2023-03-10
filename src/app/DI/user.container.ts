import { Container } from 'inversify';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { UserEntity, UserModel } from '../../common/database/entity/user.entity.js';
import { UserServiceInterface } from '../../modules/user/user-service.interface.js';
import UserService from '../../modules/user/user.service.js';
import { ControllerInterface } from '../../assets/interface/controller.interface.js';
import UserController from '../../modules/user/user.controller.js';
import { LogoutUserEntity, LogoutUserModel } from '../../common/database/entity/logout-user.entity.js';

const userDIContainer = new Container();

userDIContainer.bind<ModelType<UserEntity>>(ComponentSymbolEnum.UserModel).toConstantValue(UserModel);
userDIContainer.bind<ModelType<LogoutUserEntity>>(ComponentSymbolEnum.LogoutUserModel).toConstantValue(LogoutUserModel);
userDIContainer.bind<UserServiceInterface>(ComponentSymbolEnum.UserServiceInterface).to(UserService).inSingletonScope();
userDIContainer.bind<ControllerInterface>(ComponentSymbolEnum.UserController).to(UserController).inSingletonScope();

export { userDIContainer };
