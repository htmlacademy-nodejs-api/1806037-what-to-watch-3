import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import { Types } from 'mongoose';
import { CommentInterface } from '../../../assets/interface/comment.interface';
import { CreateCommentDto } from '../../../modules/comment/dto/create-comment.dto';
import { UserEntity } from './user.entity';


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
  })
    comment!: string;

  @prop({
    required: true,
  })
    rating!: number;

  @prop({
    ref: UserEntity,
    required: true,
  })
    creatorUser!: string | Ref<UserEntity, Types.ObjectId>;


  constructor (dto: CreateCommentDto, creatorUserId: Types.ObjectId) {
    const { comment, rating } = dto;

    this.comment = comment;
    this.rating = rating;
    this.creatorUser = creatorUserId;
  }

}

export const CommentModel = getModelForClass(CommentEntity);
