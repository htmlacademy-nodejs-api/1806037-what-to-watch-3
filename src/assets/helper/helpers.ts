export const generateRandomValue = (min: number, max: number) => Math.round((Math.random() * (max - min)) + min);

export const getRandomItems = <T>(items: T[]): T[] => {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length - 1);

  return items.slice(startPosition, endPosition);
};

export const getRandomValue = <T>(items: T[]): T => items[generateRandomValue(0, items.length - 1)];

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';
