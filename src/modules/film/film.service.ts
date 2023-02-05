import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';
import { inject, injectable } from 'inversify';
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
  ) { }


  async create(dto: CreateFilmDto, creatorUserId: string): Promise<DocumentType<FilmEntity>> {
    const { genres } = dto;

    const existGenres = await this.findGenresOrCreateGenres(genres);
    console.log(existGenres);

    const film = new FilmEntity(dto, creatorUserId, existGenres);

    const newFilm = await this.filmModel.create(film);
    this.logger.info(`New film: ${newFilm} is created.`);

    return newFilm;
  }

  async find(options?: unknown): Promise<DocumentType<FilmEntity>[]> {
    if (options) {
      // Реализация
    }

    return await this.filmModel.find({});
  }

  async findByGenre(genre: string): Promise<DocumentType<FilmEntity>[]> {
    // ???
    return await this.filmModel.find({
      genres: genre,
    });
  }

  async findById(id: string): Promise<DocumentType<FilmEntity> | null> {
    return await this.filmModel.findById(id);
  }

  async updateById(id: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return await this.filmModel.findByIdAndUpdate(id, dto, { new: true, });
  }

  async deleteById(id: string): Promise<void> {
    await this.filmModel.findByIdAndDelete(id);
  }


  async findGenresOrCreateGenres(genres: string[]): Promise<DocumentType<GenreEntity>[]> {
    console.log(genres);
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
      createdGenres.push(result);
    }

    return createdGenres;
  }

  async findGenres(options?: unknown): Promise<DocumentType<GenreEntity>[]> {
    if (options) {
      // Реализация
    }

    return await this.genreModel.find({});
  }

  async findGenreById(id: string): Promise<DocumentType<GenreEntity> | null> {
    return await this.genreModel.findById(id);
  }


}
