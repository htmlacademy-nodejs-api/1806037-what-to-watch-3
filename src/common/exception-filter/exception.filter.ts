import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { ServiceErrorEnum } from '../../assets/enum/service-error.enum.js';
import { createErrorObject } from '../../assets/helper/helpers.js';
import { ExceptionFilterInterface } from '../../assets/interface/exception-filter.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import HttpError from './http-error.js';
import ValidationError from './validation-error.js';


@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) private readonly logger: LoggerInterface,
  ) {
    this.logger.info('Register ExceptionFilter');
  }

  catch(error: Error | HttpError | ValidationError, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    } else if (error instanceof ValidationError) {
      return this.handleValidationError(error, req, res, next);
    }

    return this.handleOtherError(error, req, res, next);
  }

  private handleValidationError(error: ValidationError, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(`[ValidationError]: ${error.message}`);
    error.details.forEach((errorField) => this.logger.error(`[${errorField.property}] --- ${errorField.messages}`));

    res.status(StatusCodes.BAD_REQUEST).json(createErrorObject(ServiceErrorEnum.ValidationError, error.message, error.details));
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${error.detail}]: ${error.httpStatusCode} -- ${error.message}`);
    res.status(error.httpStatusCode).json(createErrorObject(ServiceErrorEnum.CommonError, error.message));
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(error.message, error.stack);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject(ServiceErrorEnum.ServiceError, error.message));
  }

}
