import { DocumentType } from '@typegoose/typegoose';
import { FilmEntity } from '../../common/database/entity/film.entity.js';
import { GenreEntity } from '../../common/database/entity/genre.entity.js';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';

export interface FilmServiceInterface {
  create(dto: CreateFilmDto, creatorUserId: string): Promise<DocumentType<FilmEntity>>;
  find(options?: unknown): Promise<DocumentType<FilmEntity>[]>;
  findByGenre(genre: string): Promise<DocumentType<FilmEntity>[]>;
  findById(id: string): Promise<DocumentType<FilmEntity> | null>;
  updateById(id: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  deleteById(id: string): void;

  findGenresOrCreateGenres(genres: string[]): Promise<DocumentType<GenreEntity>[]>;
  findGenres(options?: unknown): Promise<DocumentType<GenreEntity>[]>;
  findGenreById(id: string): Promise<DocumentType<GenreEntity> | null>;
}
