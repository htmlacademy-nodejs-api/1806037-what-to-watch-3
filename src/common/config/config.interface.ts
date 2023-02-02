import { ConfigSchemaType } from './config.schema.js';

export interface ConfigInterface {
  get<T extends keyof ConfigSchemaType>(key: T): ConfigSchemaType[T];
}
