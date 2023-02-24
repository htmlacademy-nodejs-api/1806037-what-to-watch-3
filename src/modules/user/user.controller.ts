import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ConstantsValue, LifeTimeJwtTokenEnum } from '../../assets/constant/constants.js';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { HttpMethodEnum } from '../../assets/enum/http-method.enum.js';
import { createJWT, fillTransformObject } from '../../assets/helper/helpers.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { ControllerAbstract } from '../../common/controller/controller.abstract.js';
import HttpError from '../../common/exception-filter/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { AuthenticateMiddleware } from '../../common/middleware/authenticate.middleware.js';
import { DtoValidateMiddleware } from '../../common/middleware/dto-validate.middleware.js';
import { LogoutUserMiddleware } from '../../common/middleware/logout-user.middleware.js';
import { UploadFileMiddleware } from '../../common/middleware/upload-file.middleware.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { JwtPayloadDto } from './dto/jwt-payload.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { LogoutUserDto } from './dto/logout-user.dto.js';
import { UserRdo } from './rdo/user.rdo.js';
import UserService from './user.service.js';

@injectable()
export default class UserController extends ControllerAbstract {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.ConfigInterface) readonly config: ConfigInterface,
    @inject(ComponentSymbolEnum.UserServiceInterface) readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info(`Register routes for ${UserController.name}`);

    this.addRoute({ path: '/register', method: HttpMethodEnum.Post, handler: this.register, middlewares: [new UploadFileMiddleware('./upload', 'avatar'), new DtoValidateMiddleware(CreateUserDto)], });
    this.addRoute({ path: '/login', method: HttpMethodEnum.Post, handler: this.login, middlewares: [new DtoValidateMiddleware(LoginUserDto)], });
    this.addRoute({ path: '/check', method: HttpMethodEnum.Get, handler: this.check, middlewares: [new AuthenticateMiddleware(this.config.get('JWT_SECRET'), this.userService),], });
    this.addRoute({ path: '/logout', method: HttpMethodEnum.Get, handler: this.logout, middlewares: [new LogoutUserMiddleware(this.config.get('JWT_SECRET'), this.userService),], });
  }

  public async register(req: Request, res: Response) {
    const body = req.body as CreateUserDto;

    try {
      const result = await this.userService.create(body);
      this.created(res, fillTransformObject(UserRdo, result));
    } catch (err) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        (err as Error).message,
        UserController.name
      );
    }
  }

  public async login(req: Request, res: Response) {
    const body = req.body as LoginUserDto;

    try {
      const user = fillTransformObject(UserRdo, await this.userService.login(body));

      const accessToken = await createJWT(
        ConstantsValue.JWT_ALGORITHM,
        LifeTimeJwtTokenEnum.AccessTokenLifeTime,
        this.config.get('JWT_SECRET'),
        fillTransformObject(JwtPayloadDto, user)
      );

      this.ok(res, { accessToken: accessToken });
    } catch (err) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        (err as Error).message,
        UserController.name
      );
    }
  }

  public async logout(req: Request, res: Response) {
    const payload = (req as unknown as { user: LogoutUserDto }).user;
    await this.userService.logout(payload);
    this.ok(res, 'OK');
  }

  public async check(_req: Request, res: Response) {
    this.send(res, StatusCodes.OK,'Valid Token');
  }

}
