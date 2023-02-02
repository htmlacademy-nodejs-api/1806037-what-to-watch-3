import { inject, injectable } from 'inversify';
import { config } from 'dotenv';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ConfigInterface } from './config.interface.js';
import { configSchema, ConfigSchemaType } from './config.schema.js';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';

@injectable()
export default class ConfigService implements ConfigInterface {
  private logger: LoggerInterface;
  private config: ConfigSchemaType;

  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) logger: LoggerInterface,
  ) {
    this.logger = logger;

    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configSchema.load({});
    configSchema.validate({
      allowed: 'strict',
      output: this.logger.info,
    });

    this.config = configSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof ConfigSchemaType>(key: T): ConfigSchemaType[T] {
    return this.config[key];
  }

}
