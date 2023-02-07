import { Expose, Transform } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { DEFAULT_COMMENT_LIMIT, ONE_VALUE, ZERO_VALUE } from '../../../assets/constant/constants.js';
import HttpError from '../../../common/exception-filter/http-error.js';

export class CommentQuery {
  @Expose()
  @Transform(({ obj }) => {
    const transformValue = +obj.limit;
    if (transformValue && Number.isNaN(transformValue)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Limit query is not number.',
        CommentQuery.name
      );
    }

    return (transformValue < ZERO_VALUE || !transformValue) ? DEFAULT_COMMENT_LIMIT : transformValue;
  })
    limit!: number;

  @Expose()
  @Transform(({ obj }) => {
    const transformValue = +obj.page;
    if (transformValue && Number.isNaN(transformValue)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Page query is not number.',
        CommentQuery.name
      );
    }

    return (transformValue < ONE_VALUE || !transformValue) ? ONE_VALUE : transformValue;
  })
    page!: number;
}
