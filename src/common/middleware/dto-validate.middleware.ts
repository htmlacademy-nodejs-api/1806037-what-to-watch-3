import { ClassConstructor } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { fillTransformObject } from '../../assets/helper/helpers.js';
import { MiddlewareInterface } from '../../assets/interface/middleware.interface.js';
import { CreateCommentDto } from '../../modules/comment/dto/create-comment.dto.js';
import { CreateFilmDto } from '../../modules/film/dto/create-film.dto.js';
import { UpdateFilmDto } from '../../modules/film/dto/update-film.dto.js';
import { CreateUserDto } from '../../modules/user/dto/create-user.dto.js';
import { LoginUserDto } from '../../modules/user/dto/login-user.dto.js';
import HttpError from '../exception-filter/http-error.js';

export class DtoValidateMiddleware implements MiddlewareInterface {
  constructor (
    private targetClassConstructor: ClassConstructor<
    CreateUserDto | LoginUserDto | CreateFilmDto | UpdateFilmDto | CreateCommentDto
    >,
  ) { }

  public async execute(req: Request, _res: Response, next: NextFunction) {
    if (this.targetClassConstructor === CreateUserDto) {
      (req.body as CreateUserDto).avatar = `${(req.file?.destination)?.substring(1)}/${req.file?.filename}`;
    }

    const transformBody = fillTransformObject(this.targetClassConstructor, req.body);
    const errors = validateSync(transformBody);

    if (errors.length > 0) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        errors.toString(),
        DtoValidateMiddleware.name
      );
    }

    req.body = transformBody;

    return next();
  }
}
