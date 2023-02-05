import { Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { UserEntity } from '../../common/database/entity/user.entity.js';

export interface CommentInterface {
  comment: string,
  rating: number,

  creatorUser: Types.ObjectId | Ref<UserEntity> | string,
}
