import { ClassConstructor, plainToInstance } from 'class-transformer';
import crypto from 'crypto';

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
