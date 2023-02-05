import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { DatabaseInterface } from './database.interface.js';


@injectable()
export default class DatabaseService implements DatabaseInterface {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) private readonly logger: LoggerInterface,
  ) { }

  public async connect(uri: string): Promise<void> {
    this.logger.info('Try to connect to MongoDB...');
    await mongoose.connect(uri);
    this.logger.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Database connection closed.');
  }
}
