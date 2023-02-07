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
import { FilmQuery } from './query/film.query.js';

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.FilmModel) private readonly filmModel: ModelType<FilmEntity>,
    @inject(ComponentSymbolEnum.GenreModel) private readonly genreModel: ModelType<GenreEntity>,
  ) { }


  async create(dto: CreateFilmDto, creatorUserId: string): Promise<DocumentType<FilmEntity>> {
    const { genres } = dto;

    const existGenres = await this.createGenres(genres);

    const film = new FilmEntity(dto, creatorUserId, existGenres);

    const newFilm = await this.filmModel.create(film);
    this.logger.info(`New film: ${newFilm.title} is created.`);

    return newFilm;
  }

  async find(options: FilmQuery): Promise<DocumentType<FilmEntity>[]> {
    const skip = (() => {
      if (options.limit > DEFAULT_FILM_LIMIT) {
        return DEFAULT_FILM_LIMIT * (options.page - ONE_VALUE);
      }

      return ZERO_VALUE;
    })();
    const limit = (() => {
      if (options.limit > DEFAULT_FILM_LIMIT && (DEFAULT_FILM_LIMIT * options.page) < options.limit) {
        return DEFAULT_FILM_LIMIT * options.page;
      }

      return options.limit;
    })();

    return await this.filmModel
      .find({}, null, {
        populate: ['creatorUser', 'genres'],
        skip: skip,
        limit: limit,
        sort: { postDate: -1 },
      })
      .exec();

  }

  async findByGenre(genres: string[], options: FilmQuery): Promise<DocumentType<FilmEntity>[]> {
    const skip = (() => {
      if (options.limit > DEFAULT_FILM_LIMIT) {
        return DEFAULT_FILM_LIMIT * (options.page - ONE_VALUE);
      }

      return ZERO_VALUE;
    })();
    const limit = (() => {
      if (options.limit > DEFAULT_FILM_LIMIT && (DEFAULT_FILM_LIMIT * options.page) < options.limit) {
        return DEFAULT_FILM_LIMIT * options.page;
      }

      return options.limit;
    })();

    const existGenre = await this.findGenresByNames(genres);

    if (existGenre?.length < 1) {
      throw new Error(`This genre(s): "${genres.toString()}" does not exist.`);
    }

    return await this.filmModel
      .find({
        genres: {
          $in: [...existGenre],
        },
      }, null, {
        populate: ['creatorUser', 'genres'],
        skip: skip,
        limit: limit,
        sort: { createdAt: -1 },
      })
      .exec();
  }

  async findById(id: string | string[]): Promise<DocumentType<FilmEntity> | null> {
    return await this.filmModel
      .findById(id)
      .populate(['creatorUser', 'genres'])
      .exec();
  }

  async findByIds(ids: Types.ObjectId[], options: FilmQuery): Promise<DocumentType<FilmEntity>[]> {
    const skip = (() => {
      if (options.limit > DEFAULT_FILM_LIMIT) {
        return DEFAULT_FILM_LIMIT * (options.page - ONE_VALUE);
      }

      return ZERO_VALUE;
    })();
    const limit = (() => {
      if (options.limit > DEFAULT_FILM_LIMIT && (DEFAULT_FILM_LIMIT * options.page) < options.limit) {
        return DEFAULT_FILM_LIMIT * options.page;
      }

      return options.limit;
    })();

    return await this.filmModel
      .find({
        _id: {
          $in: [...ids],
        },
      }, null, {
        populate: ['creatorUser', 'genres'],
        skip: skip,
        limit: limit,
        sort: { postDate: -1 },
      })
      .exec();
  }

  async updateById(id: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    const { genres } = dto;
    const updateData = {
      ...dto,
    };

    if (genres) {
      updateData.genres = await this.createGenres(genres as string[]);
    }

    return await this.filmModel
      .findByIdAndUpdate(
        id,
        updateData,
        {
          populate: ['creatorUser', 'genres'],
          new: true,
        }
      )
      .exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.filmModel.findByIdAndDelete(id).exec();
  }

  async incCommentCount(id: string): Promise<void> {
    const existFilm = await this.findById(id);

    if (!existFilm) {
      throw new Error(`The film with id: ${id} does not exist.`);
    }

    await this.filmModel.findByIdAndUpdate(id, {
      $inc: {
        commentCount: 1,
      },
    }).exec();
  }

  async decCommentCount(id: string): Promise<void> {
    const existFilm = await this.findById(id);

    if (!existFilm) {
      throw new Error(`The film with id: ${id} does not exist.`);
    }

    await this.filmModel.findByIdAndUpdate(id, {
      $inc: {
        commentCount: -1,
      },
    }).exec();
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

  async findGenres(): Promise<DocumentType<GenreEntity>[]> {
    return await this.genreModel.aggregate([
      {
        $lookup: {
          from: 'Film',
          let: { genreId: '$_id', },
          pipeline: [
            { $match: { $expr: { $in: ['$$genreId', '$genres'], }, } },
            { $project: { _id: 1, createdAt: 1, }, },
            { $sort: { createdAt: -1, }, }
          ],
          as: 'films',
        }
      },
      {
        $addFields: {
          filmCount: { $size: '$films', },
        },
      },
    ]).exec();
  }

  async findGenreById(id: string): Promise<DocumentType<GenreEntity> | null> {
    return await this.genreModel.findById(id);
  }

  async findGenreByName(genre: string): Promise<DocumentType<GenreEntity> | null> {
    return await this.genreModel.findOne({
      genre: genre
    });
  }

  async findGenresByNames(genres: string[]): Promise<DocumentType<GenreEntity>[]> {
    return await this.genreModel.find({
      genre: genres,
    });
  }

}
