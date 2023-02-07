import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { createErrorObject } from '../../assets/helper/helpers.js';
import { ExceptionFilterInterface } from '../../assets/interface/exception-filter.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import HttpError from './http-error.js';


@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) private readonly logger: LoggerInterface,
  ) {
    this.logger.info('Register ExceptionFilter');
  }

  catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    }

    return this.handleOtherError(error, req, res, next);
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${error.detail}]: ${error.httpStatusCode} -- ${error.message}`);
    res.status(error.httpStatusCode).json(createErrorObject(error.message));
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(error.message, error.stack);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject(error.message));
  }

}
