export const ConstantValue = {
  ZERO_VALUE: 0,
  ONE_VALUE: 1,
  DEFAULT_RATING_FILM: 0,
  DEFAULT_FILM_LIMIT: 60,
  DEFAULT_COMMENT_LIMIT: 50,
  JWT_ALGORITHM: 'HS256',
  BYPASS_DATABASE_TIME: 1000 * 60 * 120,
  LIMIT_BYPASS_LOGOUT_USER_COUNT: 20,
} as const;

export const LifeTimeJwtTokenEnum = {
  AccessTokenLifeTime: '2d',
} as const;
