import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchemaType = {
  PORT: number,
  SALT: string;
  DB_HOST: string;
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
});
