import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { HttpMethodEnum } from '../../assets/enum/http-method.enum.js';
import { fillTransformObject } from '../../assets/helper/helpers.js';
import { Controller } from '../../common/controller/controller.abstract.js';
import HttpError from '../../common/exception-filter/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UserRdo } from './rdo/user.rdo.js';
import UserService from './user.service.js';

@injectable()
export default class UserController extends Controller {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.UserServiceInterface) readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info(`Register routes for ${UserController.name}`);

    this.addRoute({ path: '/register', method: HttpMethodEnum.Post, handler: this.register });
    this.addRoute({ path: '/login', method: HttpMethodEnum.Post, handler: this.login });
    this.addRoute({ path: '/logout', method: HttpMethodEnum.Post, handler: this.logout });
    this.addRoute({ path: '/check', method: HttpMethodEnum.Post, handler: this.check });
  }

  public async register(req: Request, res: Response) {
    const transformBody = fillTransformObject(CreateUserDto, req.body);
    const errors = await validate(transformBody);

    if (errors.length > 0) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        errors.toString(),
        UserController.name
      );
    }

    try {
      const result = await this.userService.create(transformBody);
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
    const transformBody = fillTransformObject(LoginUserDto, req.body);
    const errors = await validate(transformBody);

    if (errors.length > 0) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        errors.toString(),
        UserController.name
      );
    }

    try {
      const result = await this.userService.login(transformBody);
      console.log(result);
      this.send(res, StatusCodes.NOT_IMPLEMENTED,'NO_IMPLEMENTED');
    } catch (err) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        (err as Error).message,
        UserController.name
      );
    }
  }

  public async logout(_req: Request, res: Response) {
    this.send(res, StatusCodes.NOT_IMPLEMENTED,'NO_IMPLEMENTED');
  }

  public async check(_req: Request, res: Response) {
    this.send(res, StatusCodes.NOT_IMPLEMENTED,'NO_IMPLEMENTED');
  }

}
