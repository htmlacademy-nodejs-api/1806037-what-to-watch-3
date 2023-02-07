import { Expose, Transform } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { DEFAULT_FILM_LIMIT, ONE_VALUE, ZERO_VALUE } from '../../../assets/constant/constants.js';
import HttpError from '../../../common/exception-filter/http-error.js';

export class FilmQuery {
  @Expose()
  @Transform(({ obj }) => {
    const transformValue = +obj.limit;
    if (transformValue && Number.isNaN(transformValue)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Limit query is not number.',
        FilmQuery.name
      );
    }

    return (transformValue < ZERO_VALUE || !transformValue) ? DEFAULT_FILM_LIMIT : transformValue;
  })
    limit!: number;

  @Expose()
  @Transform(({ obj }) => {
    const transformValue = +obj.page;
    if (transformValue && Number.isNaN(transformValue)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Page query is not number.',
        FilmQuery.name
      );
    }

    return (transformValue < ONE_VALUE || !transformValue) ? ONE_VALUE : transformValue;
  })
    page!: number;

  @Expose()
  @Transform(({ obj }) => {
    if ((obj.genre as string) === '') {
      return [];
    }
    if (!obj.genre) {
      return;
    }

    return (obj.genre as string).trim().split(',');
  })
    genres?: string[];
}
