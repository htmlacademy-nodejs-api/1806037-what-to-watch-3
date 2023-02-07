import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { HttpMethodEnum } from '../../assets/enum/http-method.enum.js';
import { fillTransformObject } from '../../assets/helper/helpers.js';
import { Controller } from '../../common/controller/controller.abstract.js';
import HttpError from '../../common/exception-filter/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import FilmService from '../film/film.service.js';
import CommentService from './comment.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentQuery } from './query/comment.query.js';
import { CommentRdo } from './rdo/comment.rdo.js';

@injectable()
export default class CommentController extends Controller {
  private readonly creatorUserId = '63df78963bfe990c85df436d';

  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.FilmServiceInterface) private readonly filmService: FilmService,
    @inject(ComponentSymbolEnum.CommentServiceinterface) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info(`Register routes for ${CommentController.name}`);

    this.addRoute({ path: '/:filmId', method: HttpMethodEnum.Get, handler: this.getCommentsByFilmId });
    this.addRoute({ path: '/:filmId', method: HttpMethodEnum.Post, handler: this.create });
  }

  async getCommentsByFilmId(req: Request, res: Response) {
    const query = fillTransformObject(CommentQuery, req.query);
    const filmId = req.params.filmId;

    if (!Types.ObjectId.isValid(filmId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `FilmID: ${filmId} is invalid MongoID`,
        CommentController.name
      );
    }

    try {
      const result = await this.commentService.findByFilmId(filmId, query);
      this.ok(res, fillTransformObject(CommentRdo, result));
    } catch (err) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        (err as Error).message,
        CommentController.name
      );
    }
  }

  async create(req: Request, res: Response) {
    const userId = this.creatorUserId;
    const filmId = req.params.filmId;

    if (!Types.ObjectId.isValid(filmId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `FilmID: ${filmId} is invalid MongoID`,
        CommentController.name
      );
    }

    const transformValue = fillTransformObject(CreateCommentDto, req.body);
    const errors = await validate(transformValue);

    if (errors.length > 0) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        errors.toString(),
        CommentController.name
      );
    }

    try {
      const result = await this.commentService.create(transformValue, userId, filmId);
      await this.filmService.incCommentCount(filmId);
      this.created(res, fillTransformObject(CommentRdo, result));
    } catch (err) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        (err as Error).message,
        CommentController.name
      );
    }
  }
}
