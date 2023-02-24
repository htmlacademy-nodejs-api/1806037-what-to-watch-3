import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { HttpMethodEnum } from '../../assets/enum/http-method.enum.js';
import { fillTransformObject } from '../../assets/helper/helpers.js';
import { ControllerAbstract } from '../../common/controller/controller.abstract.js';
import HttpError from '../../common/exception-filter/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { RequestQueryValidateMiddleware } from '../../common/middleware/request-query-validate.middleware.js';
import { MongoIDValidateMiddleware } from '../../common/middleware/mongoid-validate.middleware.js';
import { DtoValidateMiddleware } from '../../common/middleware/dto-validate.middleware.js';
import UserService from '../user/user.service.js';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';
import FilmService from './film.service.js';
import { FilmQuery } from './query/film.query.js';
import { FilmFullInfoRdo } from './rdo/film-full-info.rdo.js';
import { FilmInfoRdo } from './rdo/film-info.rdo.js';
import { AuthenticateMiddleware } from '../../common/middleware/authenticate.middleware.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { JwtPayloadDto } from '../user/dto/jwt-payload.dto.js';


@injectable()
export default class FilmController extends ControllerAbstract {
  private promoFilmId: string;

  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.ConfigInterface) readonly config: ConfigInterface,
    @inject(ComponentSymbolEnum.UserServiceInterface) readonly userService: UserService,
    @inject(ComponentSymbolEnum.FilmServiceInterface) readonly filmService: FilmService,
  ) {
    super(logger);

    this.promoFilmId = this.config.get('PROMO_FILM_ID');

    this.logger.info(`Register routes for ${FilmController.name}`);

    this.addRoute({ path: '/', method: HttpMethodEnum.Get, handler: this.index, middlewares: [new RequestQueryValidateMiddleware(FilmQuery),], });
    this.addRoute({ path: '/', method: HttpMethodEnum.Post, handler: this.create, middlewares: [new AuthenticateMiddleware(this.config.get('JWT_SECRET'), this.userService), new DtoValidateMiddleware(CreateFilmDto),], });
    this.addRoute({ path: '/film/:filmId', method: HttpMethodEnum.Put, handler: this.update, middlewares: [new AuthenticateMiddleware(this.config.get('JWT_SECRET'), this.userService), new MongoIDValidateMiddleware('filmId'), new DtoValidateMiddleware(UpdateFilmDto),], });
    this.addRoute({ path: '/film/:filmId', method: HttpMethodEnum.Get, handler: this.findById, middlewares: [new MongoIDValidateMiddleware('filmId'),], });
    this.addRoute({ path: '/film/:filmId', method: HttpMethodEnum.Delete, handler: this.delete, middlewares: [new AuthenticateMiddleware(this.config.get('JWT_SECRET'), this.userService), new MongoIDValidateMiddleware('filmId'),], });
    this.addRoute({ path: '/promo', method: HttpMethodEnum.Get, handler: this.getPromoFilm });
    this.addRoute({ path: '/favorite', method: HttpMethodEnum.Get, handler: this.myFavoriteFilms, middlewares: [new AuthenticateMiddleware(this.config.get('JWT_SECRET'), this.userService), new RequestQueryValidateMiddleware(FilmQuery),], });
    this.addRoute({ path: '/addfavorite/:filmId', method: HttpMethodEnum.Post, handler: this.addFavoriteFilm, middlewares: [new AuthenticateMiddleware(this.config.get('JWT_SECRET'), this.userService), new MongoIDValidateMiddleware('filmId'),], });
    this.addRoute({ path: '/removefavorite/:filmId', method: HttpMethodEnum.Post, handler: this.removeFavoriteFilm, middlewares: [new AuthenticateMiddleware(this.config.get('JWT_SECRET'), this.userService), new MongoIDValidateMiddleware('filmId'),], });
  }

  public async index(req: Request, res: Response) {
    const query = req.query as unknown as FilmQuery;

    let result;

    try {
      if (query.genres && query.genres.length > 0) {
        result = await this.filmService.findByGenre(query.genres, query);
      } else {
        result = await this.filmService.find(query);
      }

      this.ok(res, fillTransformObject(FilmInfoRdo, result));
    } catch (err) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        (err as Error).message,
        FilmController.name
      );
    }
  }

  public async create(req: Request, res: Response) {
    const creatorUserId = (req as unknown as { user: JwtPayloadDto }).user.id;
    const body = req.body as CreateFilmDto;

    try {
      const result = await this.filmService.create(body, creatorUserId);
      this.created(res, fillTransformObject(FilmFullInfoRdo, result));
    } catch (err) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        (err as Error).message,
        FilmController.name
      );
    }
  }

  public async update(req: Request, res: Response) {
    const creatorUserId = (req as unknown as { user: JwtPayloadDto }).user.id;
    const filmId = req.params.filmId;

    const body = req.body as UpdateFilmDto;

    try {
      const result = await this.filmService.updateById(filmId, body, creatorUserId);
      this.ok(res, fillTransformObject(FilmFullInfoRdo, result));
    } catch (err) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        (err as Error).message,
        FilmController.name
      );
    }
  }

  public async delete(req: Request, res: Response) {
    const creatorUserId = (req as unknown as { user: JwtPayloadDto }).user.id;
    const filmId = req.params.filmId;

    try {
      await this.filmService.deleteById(filmId, creatorUserId);
      this.ok(res, 'OK');
    } catch (err) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        (err as Error).message,
        FilmController.name
      );
    }
  }

  public async findById(req: Request, res: Response) {
    const filmId = req.params.filmId;

    try {
      const result = await this.filmService.findById(filmId);
      this.ok(res, fillTransformObject(FilmFullInfoRdo, result));
    } catch (err) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        (err as Error).message,
        FilmController.name
      );
    }
  }

  public async getPromoFilm(_req: Request, res: Response) {
    const promoFilmId = this.promoFilmId;
    if (!Types.ObjectId.isValid(promoFilmId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${promoFilmId} is not MongoID`,
        FilmController.name
      );
    }

    try {
      const result = await this.filmService.findById(promoFilmId);
      this.ok(res, fillTransformObject(FilmFullInfoRdo, result));
    } catch (err) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        (err as Error).message,
        FilmController.name
      );
    }
  }

  public async myFavoriteFilms(req: Request, res: Response) {
    const creatorUserId = (req as unknown as { user: JwtPayloadDto }).user.id;
    const query = req.query as unknown as FilmQuery;

    const favoriteFilms = await this.userService.getFavoriteFilmsList(creatorUserId);

    if (!favoriteFilms) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The user with this ID: ${creatorUserId} does not exist.`,
        FilmController.name
      );
    }

    try {
      const result = await this.filmService.findByIds(favoriteFilms.favoriteFilms, query);
      this.ok(res, fillTransformObject(FilmInfoRdo, result));
    } catch (err) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        (err as Error).message,
        FilmController.name
      );
    }
  }

  public async addFavoriteFilm(req: Request, res: Response) {
    const creatorUserId = (req as unknown as { user: JwtPayloadDto }).user.id;
    const filmId = req.params.filmId;

    try {
      await this.userService.addFavoriteFilm(creatorUserId, filmId);
      this.ok(res, 'Add film to favorite');
    } catch (err) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        (err as Error).message,
        FilmController.name
      );
    }
  }

  public async removeFavoriteFilm(req: Request, res: Response) {
    const creatorUserId = (req as unknown as { user: JwtPayloadDto }).user.id;
    const filmId = req.params.filmId;

    try {
      await this.userService.removeFavoriteFilm(creatorUserId, filmId);
      this.ok(res, 'Remove film to favorite');
    } catch (err) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        (err as Error).message,
        FilmController.name
      );
    }
  }

}
