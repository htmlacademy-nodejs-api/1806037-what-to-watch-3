import { GenreEnum } from '../enum/genre.enum.js';

export type GenreType = typeof GenreEnum[keyof typeof GenreEnum];
