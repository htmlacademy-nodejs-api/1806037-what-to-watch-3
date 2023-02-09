import { Expose, Transform } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { ConstantValue } from '../../../assets/constant/constants.js';
import HttpError from '../../../common/exception-filter/http-error.js';

export class CommentQuery {
  @Expose()
  @Transform(({ obj }) => {
    const transformValue = +obj.limit;
    if (obj.limit && Number.isNaN(transformValue)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Limit query is not number.',
        CommentQuery.name
      );
    }

    return (transformValue < ConstantValue.ZERO_VALUE || !obj.limit) ? ConstantValue.DEFAULT_COMMENT_LIMIT : transformValue;
  })
    limit!: number;

  @Expose()
  @Transform(({ obj }) => {
    const transformValue = +obj.page;
    if (obj.page && Number.isNaN(transformValue)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Page query is not number.',
        CommentQuery.name
      );
    }

    return (transformValue < ConstantValue.ONE_VALUE || !obj.page) ? ConstantValue.ONE_VALUE : transformValue;
  })
    page!: number;
}
