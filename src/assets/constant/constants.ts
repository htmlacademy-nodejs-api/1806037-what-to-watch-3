export const ConstantsValue = {
  ZERO_VALUE: 0,
  ONE_VALUE: 1,
  DEFAULT_RATING_FILM: 0,
  DEFAULT_FILM_LIMIT: 60,
  DEFAULT_COMMENT_LIMIT: 50,
  JWT_ALGORITHM: 'HS256',
  BYPASS_DATABASE_TIME: 1000 * 60 * 120,
  LIMIT_BYPASS_LOGOUT_USER_COUNT: 20,
  COMMENT_MIN_LENGTH: 5,
  COMMENT_MAX_LENGTH: 1024,
  COMMENT_MIN_RATING: 1,
  COMMENT_MAX_RATING: 10,
  FILM_TITLE_MIN_LENGTH: 2,
  FILM_TITLE_MAX_LENGTH: 100,
  FILM_DESCRIPTION_MIN_LENGTH: 20,
  FILM_DESCRIPTION_MAX_LENGTH: 1024,
  USER_PASSWORD_MIN_LENGTH: 6,
  USER_PASSWORD_MAX_LENGTH: 12,
  USER_USERNAME_MIN_LENGTH: 1,
  USER_USERNAME_MAX_LENGTH: 15,

} as const;

export const LifeTimeJwtTokenEnum = {
  AccessTokenLifeTime: '2d',
} as const;
