import { NextFunction, Request, Response } from 'express';
import { HttpMethodType } from '../type/http-method.type.js';
import { MiddlewareInterface } from './middleware.interface.js';

export interface RouteInterface {
  path: string;
  method: HttpMethodType;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: MiddlewareInterface[];
}
