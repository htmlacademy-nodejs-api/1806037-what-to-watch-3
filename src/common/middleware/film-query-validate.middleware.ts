import { ClassConstructor } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import { fillTransformObject } from '../../assets/helper/helpers.js';
import { MiddlewareInterface } from '../../assets/interface/middleware.interface.js';
import { CommentQuery } from '../../modules/comment/query/comment.query.js';
import { FilmQuery } from '../../modules/film/query/film.query.js';
import HttpError from '../exception-filter/http-error.js';

export class RequestQueryValidateMiddleware implements MiddlewareInterface {
  constructor (
    private targetClassConstructor: ClassConstructor<FilmQuery | CommentQuery>,
  ) { }

  public execute(req: Request, _res: Response, next: NextFunction) {
    try {
      const transformQuery = fillTransformObject(this.targetClassConstructor, req.query);
      req.query = transformQuery as unknown as core.Query;
    } catch (err) {
      throw new HttpError(
        (err as HttpError).httpStatusCode,
        (err as HttpError).message,
        RequestQueryValidateMiddleware.name,
      );
    }

    return next();
  }
}
