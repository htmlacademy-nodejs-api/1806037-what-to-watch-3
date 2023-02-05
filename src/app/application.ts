import { inject, injectable } from 'inversify';
import { ComponentSymbolEnum } from '../assets/enum/component.symbol.enum.js';
import { getMongoDBUri } from '../assets/helper/helpers.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { DatabaseInterface } from '../common/database/database.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { FilmServiceInterface } from '../modules/film/film-service.interface.js';

@injectable()
export default class Application {
  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.ConfigInterface) private readonly config: ConfigInterface,
    @inject(ComponentSymbolEnum.DatabaseInterface) private readonly databaseClient: DatabaseInterface,
    @inject(ComponentSymbolEnum.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
  ) { }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const mongoDbUri = getMongoDBUri(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(mongoDbUri);
    console.log(this.filmService);
  }

}
