import { injectable } from 'inversify';
import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { ControllerInterface } from '../../assets/interface/controller.interface.js';
import { RouteInterface } from '../../assets/interface/route.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';

@injectable()
export abstract class Controller implements ControllerInterface {
  readonly _router: Router;

  constructor (
    protected readonly logger: LoggerInterface,
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: RouteInterface): void {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map((middleware) => asyncHandler(middleware.execute.bind(middleware)));

    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;

    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

}
