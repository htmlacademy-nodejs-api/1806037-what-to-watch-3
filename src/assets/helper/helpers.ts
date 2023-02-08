import { ClassConstructor, plainToInstance } from 'class-transformer';
import crypto from 'crypto';
import * as jose from 'jose';
import { GenreType } from '../type/genre.type';

export const createFilmData = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, postDate, genres, releaseYear, rating, previewVideoLink, videoLink, actors, director, duration, posterLink, backgroundImageLink, backgroundColor, creatorUser] = tokens;

  return {
    title,
    description,
    postDate: new Date() ?? postDate,
    genres: genres.split(',') as GenreType[],
    releaseYear: +releaseYear,
    rating: +rating,
    previewVideoLink,
    videoLink,
    actors: actors.split(','),
    director,
    duration: +duration,
    posterLink,backgroundImageLink,
    backgroundColor,
    creatorUser,
  };
};

export const generateRandomValue = (min: number, max: number) => Math.round((Math.random() * (max - min)) + min);

export const getRandomItems = <T>(items: T[]): T[] => {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length - 1);

  return items.slice(startPosition, endPosition);
};

export const getRandomValue = <T>(items: T[]): T => items[generateRandomValue(0, items.length - 1)];

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

export const getMongoDBUri = (
  username: string,
  password: string,
  host: string,
  port: number,
  databaseName: string,
): string => `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);

  return shaHasher.update(line).digest('hex');
};

export const fillTransformObject = <T, V>(classConstructor: ClassConstructor<T>, plainObject: V | V[]) => plainToInstance(classConstructor, plainObject, { excludeExtraneousValues: true });

export const createErrorObject = (message: string) => ({
  error: message,
});

export const createJWT = async (algotithm: string, lifeTime: string, jwtSecret: string, payload: object): Promise<string> => new jose.SignJWT({...payload})
  .setProtectedHeader({alg: algotithm})
  .setIssuedAt()
  .setExpirationTime(lifeTime)
  .sign(crypto.createSecretKey(jwtSecret, 'utf8'));

export const verifyJWT = async (token: string, jwtSecret: string) => {
  try {
    await jose.jwtVerify(token, crypto.createSecretKey(jwtSecret, 'utf8'));

    return true;
  } catch (err) {
    return false;
  }
};
