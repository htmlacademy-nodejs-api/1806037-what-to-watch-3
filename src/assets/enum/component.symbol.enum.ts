export const ComponentSymbolEnum = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceinterface'),
  FilmServiceInterface: Symbol.for('FilmServiceInterface'),
  CommentServiceinterface: Symbol.for('CommentServiceinterface'),

  UserModel: Symbol.for('UserModel'),
  FilmModel: Symbol.for('FilmModel'),
  GenreModel: Symbol.for('GenreModel'),
  CommentModel: Symbol.for('CommentModel'),
} as const;
