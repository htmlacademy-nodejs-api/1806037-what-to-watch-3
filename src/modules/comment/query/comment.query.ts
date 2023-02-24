import { Expose, Transform } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { ConstantsValue } from '../../../assets/constant/constants.js';
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

    return (transformValue < ConstantsValue.ZERO_VALUE || !obj.limit) ? ConstantsValue.DEFAULT_COMMENT_LIMIT : transformValue;
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

    return (transformValue < ConstantsValue.ONE_VALUE || !obj.page) ? ConstantsValue.ONE_VALUE : transformValue;
  })
    page!: number;
}
