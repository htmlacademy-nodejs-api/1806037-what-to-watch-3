import { Types } from 'mongoose';
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import { CommentInterface } from '../../../assets/interface/comment.interface.js';
import { CreateCommentDto } from '../../../modules/comment/dto/create-comment.dto.js';
import { FilmEntity } from './film.entity.js';
import { UserEntity } from './user.entity.js';


export interface CommentEntity extends Base, TimeStamps { }

@modelOptions({
  schemaOptions: {
    collection: 'Comment',
    timestamps: true,
  },
})
export class CommentEntity implements CommentInterface {
  @prop({
    required: true,
    trim: true,
  })
    comment!: string;

  @prop({
    required: true,
  })
    rating!: number;

  @prop({
    required: true,
    ref: FilmEntity,
  })
    filmId!: Ref<FilmEntity> | Types.ObjectId | string;

  @prop({
    required: true,
    ref: UserEntity,
  })
    creatorUser!: Ref<UserEntity> | Types.ObjectId | string;


  constructor (dto: CreateCommentDto, creatorUserId: Types.ObjectId | string) {
    const { comment, rating, filmId } = dto;

    this.comment = comment;
    this.rating = rating;
    this.filmId = filmId;

    this.creatorUser = creatorUserId;
  }

}

export const CommentModel = getModelForClass(CommentEntity);
