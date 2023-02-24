import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types.js';

import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { CommentEntity } from '../../common/database/entity/comment.entity.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { ConstantsValue } from '../../assets/constant/constants.js';


@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.CommentModel) private readonly commentModel: ModelType<CommentEntity>,
  ) { }


  async create(dto: CreateCommentDto, creatorUserId: Types.ObjectId | string, filmId: Types.ObjectId | string): Promise<DocumentType<CommentEntity>> {
    const newComment = new CommentEntity(dto, creatorUserId, filmId);

    const result = await this.commentModel.create(newComment);
    this.logger.info('New comment is created...');

    return result;
  }

  async findByFilmId(filmId: string, options: { page: number, limit: number }): Promise<DocumentType<CommentEntity>[]> {
    const skip = (() => {
      if (options.limit > ConstantsValue.DEFAULT_COMMENT_LIMIT) {
        return ConstantsValue.DEFAULT_COMMENT_LIMIT * (options.page - ConstantsValue.ONE_VALUE);
      }

      return ConstantsValue.ZERO_VALUE;
    })();
    const count = (() => {
      if (options.limit > ConstantsValue.DEFAULT_COMMENT_LIMIT && (ConstantsValue.DEFAULT_COMMENT_LIMIT * options.page) < options.limit) {
        return ConstantsValue.DEFAULT_COMMENT_LIMIT * options.page;
      }

      return options.limit;
    })();

    return await this.commentModel.find(
      {
        filmId: filmId,
      }, {}, {
        populate: ['creatorUser'],
        skip: skip,
        limit: count,
        sort: { createdAt: -1 },
      },
    );
  }

  async deleteByFilmId(filmId: string): Promise<number | null> {
    const result = await this.commentModel.deleteMany({ filmId: filmId }).exec();

    return result.deletedCount;
  }

}
