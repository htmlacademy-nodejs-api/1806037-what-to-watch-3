import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { CommentEntity } from '../../common/database/entity/comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto, creatorUserId: Types.ObjectId, filmId: Types.ObjectId): Promise<DocumentType<CommentEntity>>;
  findByFilmId(filmId: string, options: { page: number, limit: number }): Promise<DocumentType<CommentEntity>[]>;
  deleteByFilmId(filmId: string): Promise<number | null>;
}
