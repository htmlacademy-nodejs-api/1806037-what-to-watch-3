import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchemaType = {
  PORT: number,
  SALT: string,
  DB_HOST: string,
  DB_PORT: number,
  DB_NAME: string,
  DB_USER: string,
  DB_PASSWORD: string,
  UPLOAD_DIRECTORY: string,
  JWT_SECRET: string,
  PROMO_FILM_ID: string,
};

export const configSchema = convict<ConfigSchemaType>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000,
  },
  SALT: {
    default: null,
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
  },
  DB_HOST: {
    default: '127.0.0.1',
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
  },
  DB_PORT: {
    default: 27027,
    env: 'DB_PORT',
    format: 'port',
    doc: 'Port to connect to the database (MongoDB)',
  },
  DB_NAME: {
    default: 'course-nodejs-what-to-watch',
    env: 'DB_NAME',
    format: String,
    doc: 'Database name (MongoDB)',
  },
  DB_USER: {
    default: null,
    env: 'DB_USER',
    format: String,
    doc: 'Username to connect to the database (MongoDB)',
  },
  DB_PASSWORD: {
    default: null,
    env: 'DB_PASSWORD',
    format: String,
    doc: 'Username to connect to the database (MongoDB)',
  },
  UPLOAD_DIRECTORY: {
    default: '/upload',
    env: 'UPLOAD_DIRECTORY',
    format: String,
    doc: 'Directory for upload files',
  },
  JWT_SECRET: {
    default: null,
    env: 'JWT_SECRET',
    format: String,
    doc: 'Secret for sign JWT',
  },
  PROMO_FILM_ID: {
    default: null,
    env: 'PROMO_FILM_ID',
    format: String,
    doc: 'Promo film MongoID',
  },
});
