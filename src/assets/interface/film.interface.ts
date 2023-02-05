import { Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { GenreEntity } from '../../common/database/entity/genre.entity.js';
import { UserEntity } from '../../common/database/entity/user.entity.js';
import { GenreType } from '../type/genre.type.js';

export interface FilmInterface {
  title: string,
	description: string,
	postDate: Date,
	genres: string[] | GenreType[] | Types.ObjectId[] | Ref<GenreEntity>[],
	releaseYear: number,
	rating: number,
	previewVideoLink: string,
	videoLink: string,
	actors: string[],
	director: string,
	duration: number,
	posterLink: string,
	backgroundImageLink: string,
	backgroundColor: string,

	creatorUser: Types.ObjectId | Ref<UserEntity> | string,
}
