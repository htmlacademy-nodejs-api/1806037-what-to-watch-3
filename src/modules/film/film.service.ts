import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { DEFAULT_FILM_LIMIT, ONE_VALUE, ZERO_VALUE } from '../../assets/constant/constants.js';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { FilmEntity } from '../../common/database/entity/film.entity.js';
import { GenreEntity } from '../../common/database/entity/genre.entity.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.FilmModel) private readonly filmModel: ModelType<FilmEntity>,
    @inject(ComponentSymbolEnum.FilmModel) private readonly genreModel: ModelType<GenreEntity>,
  ) {
    this.init();
  }


  public async init() {
    // let count = 0;
    const result = await this.findByGenre(
      'scifi',
      // {
      //   _limit: 20,
      //   _page: 2,
      // }
    );
    console.log(result);
    // const result = await this.find({
    //   _limit: 20,
    //   _page: 2,
    // });
    // result.forEach((_item) => {
    //   // console.log(item);
    //   ++count;
    // });
    // console.log(count);
  }

  async create(dto: CreateFilmDto, creatorUserId: string): Promise<DocumentType<FilmEntity>> {
    const { genres } = dto;

    const existGenres = await this.createGenres(genres);

    const film = new FilmEntity(dto, creatorUserId, existGenres);

    const newFilm = await this.filmModel.create(film);
    this.logger.info(`New film: ${newFilm.title} is created.`);

    return newFilm;
  }

  async find(options?: { page?: number, limit?: number }): Promise<DocumentType<FilmEntity>[]> {
    const page = (!options?.page || options?.page < 1) ? ONE_VALUE : options?.page;
    const limit = (!options?.limit || options?.limit < 1) ? DEFAULT_FILM_LIMIT : options?.limit;

    const skip = (() => {
      if (limit > DEFAULT_FILM_LIMIT) {
        return DEFAULT_FILM_LIMIT * (page - ONE_VALUE);
      }

      return ZERO_VALUE;
    })();
    const count = (() => {
      if (limit > DEFAULT_FILM_LIMIT && (DEFAULT_FILM_LIMIT * page) < limit) {
        return DEFAULT_FILM_LIMIT * page;
      }

      return limit;
    })();

    return await this.filmModel
      .find({}, {}, {
        populate: ['creatorUser', 'genres'],
        skip: skip,
        limit: count - skip,
        sort: { postDate: -1 },
      });

  }

  async findByGenre(genre: string, options?: { page?: number, limit?: number }): Promise<DocumentType<FilmEntity>[]> {
    const page = (!options?.page || options?.page < 1) ? ONE_VALUE : options?.page;
    const limit = (!options?.limit || options?.limit < 1) ? DEFAULT_FILM_LIMIT : options?.limit;

    const skip = (() => {
      if (limit > DEFAULT_FILM_LIMIT) {
        return DEFAULT_FILM_LIMIT * (page - ONE_VALUE);
      }

      return ZERO_VALUE;
    })();
    const count = (() => {
      if (limit > DEFAULT_FILM_LIMIT && (DEFAULT_FILM_LIMIT * page) < limit) {
        return DEFAULT_FILM_LIMIT * page;
      }

      return limit;
    })();

    const aaa = await this.findGenres();
    console.log(aaa);

    return await this.genreModel
      .find({
        genre: genre,
      }, {}, {
        populate: ['creatorUser', 'genres'],
        skip: skip,
        limit: count - skip,
        sort: { postDate: -1 },
      });
  }

  async findById(id: string): Promise<DocumentType<FilmEntity> | null> {
    return await this.filmModel
      .findById(id)
      .populate(['creatorUser', 'genres']);
  }

  async updateById(id: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return await this.filmModel
      .findByIdAndUpdate(id, dto, { new: true, })
      .populate(['creatorUser', 'genres']);
  }

  async deleteById(id: string): Promise<void> {
    await this.filmModel.findByIdAndDelete(id);
  }


  async createGenres(genres: string[]): Promise<Types.ObjectId[]> {
    const createdGenres = [];

    const existGenres = await this.genreModel.find({
      genre: genres,
    });

    for await (const genre of genres) {
      if (existGenres.some((item) => item.genre === genre.trim() ? Boolean(createdGenres.push(item)) : false)) {

        continue;
      }


      const result = await this.genreModel.create(new GenreEntity(genre.trim()));
      this.logger.info(`Create new genre: ${genre}.`);
      createdGenres.push(result._id);
    }

    return createdGenres;
  }

  async findGenres(options?: unknown): Promise<DocumentType<GenreEntity>[]> {
    if (options) {
      // Реализация
    }

    return await this.genreModel.find();
  }

  async findGenreById(id: string): Promise<DocumentType<GenreEntity> | null> {
    return await this.genreModel.findById(id);
  }

  async findGenreByName(genre: string): Promise<DocumentType<GenreEntity> | null> {
    return await this.genreModel.findOne({
      genre: genre
    });
  }


}
