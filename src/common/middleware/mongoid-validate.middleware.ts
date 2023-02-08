import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { MiddlewareInterface } from '../../assets/interface/middleware.interface.js';
import HttpError from '../exception-filter/http-error.js';

export class MongoIDValidateMiddleware implements MiddlewareInterface {
  constructor (
    private param: string,
  ) { }

  public execute({ params }: Request, _res: Response, next: NextFunction) {
    const mongoId = params[this.param];

    if (Types.ObjectId.isValid(mongoId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${mongoId} is invalid MongoID`,
      MongoIDValidateMiddleware.name,
    );
  }

}
