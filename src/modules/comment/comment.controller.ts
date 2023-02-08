import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { HttpMethodEnum } from '../../assets/enum/http-method.enum.js';
import { fillTransformObject } from '../../assets/helper/helpers.js';
import { Controller } from '../../common/controller/controller.abstract.js';
import HttpError from '../../common/exception-filter/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { RequestQueryValidateMiddleware } from '../../common/middleware/film-query-validate.middleware.js';
import { MongoIDValidateMiddleware } from '../../common/middleware/mongoid-validate.middleware.js';
import { DtoValidateMiddleware } from '../../common/middleware/dto-validate.middleware.js';
import FilmService from '../film/film.service.js';
import CommentService from './comment.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentQuery } from './query/comment.query.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import UserService from '../user/user.service.js';
import { AuthenticateMiddleware } from '../../common/middleware/authenticate.middleware.js';
import { JwtPayloadDto } from '../user/dto/jwt-payload.dto.js';

@injectable()
export default class CommentController extends Controller {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.ConfigInterface) readonly config: ConfigInterface,
    @inject(ComponentSymbolEnum.UserServiceInterface) readonly userService: UserService,
    @inject(ComponentSymbolEnum.FilmServiceInterface) private readonly filmService: FilmService,
    @inject(ComponentSymbolEnum.CommentServiceinterface) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info(`Register routes for ${CommentController.name}`);

    this.addRoute({ path: '/:filmId', method: HttpMethodEnum.Get, handler: this.getCommentsByFilmId, middlewares: [new MongoIDValidateMiddleware('filmId'), new RequestQueryValidateMiddleware(CommentQuery)], });
    this.addRoute({ path: '/:filmId', method: HttpMethodEnum.Post, handler: this.create, middlewares: [new AuthenticateMiddleware(this.config.get('JWT_SECRET'), this.userService), new MongoIDValidateMiddleware('filmId'), new DtoValidateMiddleware(CreateCommentDto)], });
  }

  async getCommentsByFilmId(req: Request, res: Response) {
    const filmId = req.params.filmId;
    const query = req.query as unknown as CommentQuery;

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
    const creatorUserId = (req as unknown as { user: JwtPayloadDto }).user.id;

    const filmId = req.params.filmId;
    const body = req.body as CreateCommentDto;

    try {
      const result = await this.commentService.create(body, creatorUserId, filmId);
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
