import { DocumentType, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import { Types } from 'mongoose';
import { DEFAULT_RATING_FILM } from '../../../assets/constant/constants.js';

import { FilmInterface } from '../../../assets/interface/film.interface.js';
import { CreateFilmDto } from '../../../modules/film/dto/create-film.dto.js';
import { GenreEntity } from './genre.entity.js';
import { UserEntity } from './user.entity.js';

export interface FilmEntity extends Base, TimeStamps { }

@modelOptions({
  schemaOptions: {
    collection: 'Film',
    timestamps: true,
  },
})
export class FilmEntity implements FilmInterface {
  @prop({
    required: true,
    default: '',
    trim: true,
  })
    title!: string;

  @prop({
    required: true,
    default: '',
    trim: true,
  })
    description!: string;

  @prop({
    required: true,
  })
    postDate!: Date;

  @prop({
    ref: GenreEntity,
    required: true,
    default: [],
    _id: false,

  })
    genres!: Ref<GenreEntity>[];

  @prop({
    required: true,
  })
    releaseYear!: number;

  @prop({
    required: true,
  })
    rating!: number;

  @prop({
    required: true,
    default: '',
    trim: true,
  })
    previewVideoLink!: string;

  @prop({
    required: true,
    default: '',
    trim: true,
  })
    videoLink!: string;

  @prop({
    required: true,
    default: [],
    type: Array,
  })
    actors!: string[];

  @prop({
    required: true,
    default: '',
    trim: true,
  })
    director!: string;

  @prop({
    required: true,
  })
    duration!: number;

  @prop({
    required: true,
    default: '',
    trim: true,
  })
    posterLink!: string;

  @prop({
    required: true,
    default: '',
    trim: true,
  })
    backgroundImageLink!: string;

  @prop({
    required: true,
    default: '',
    trim: true,
  })
    backgroundColor!: string;

  @prop({
    required: true,
    default: 0,
  })
    commentCount!: number;


  @prop({
    ref: UserEntity,
    required: true,
  })
    creatorUser!: Ref<UserEntity> | string;


  constructor (dto: CreateFilmDto, creatorUserId: Types.ObjectId | string, genresId: DocumentType<GenreEntity>[] | Types.ObjectId[]) {
    const { title, description, releaseYear, previewVideoLink, videoLink, actors, director, duration, posterLink, backgroundImageLink, backgroundColor } = dto;

    this.title = title;
    this.description = description;
    this.postDate = new Date();
    this.genres = genresId;
    this.releaseYear = releaseYear;
    this.rating = DEFAULT_RATING_FILM;
    this.previewVideoLink = previewVideoLink;
    this.videoLink = videoLink;
    this.actors = actors;
    this.director = director;
    this.duration = duration;
    this.posterLink = posterLink;
    this.backgroundImageLink = backgroundImageLink;
    this.backgroundColor = backgroundColor;

    this.creatorUser = creatorUserId;

  }

}

export const FilmModel = getModelForClass(FilmEntity);
