import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import cors from 'cors';
import { ComponentSymbolEnum } from '../assets/enum/component.symbol.enum.js';
import { getMongoDBUri } from '../assets/helper/helpers.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { DatabaseInterface } from '../common/database/database.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ControllerAbstract } from '../common/controller/controller.abstract.js';
import { ExceptionFilterInterface } from '../assets/interface/exception-filter.interface.js';

@injectable()
export default class Application {
  private readonly expressApp: Express;

  constructor (
    @inject(ComponentSymbolEnum.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(ComponentSymbolEnum.ConfigInterface) private readonly config: ConfigInterface,
    @inject(ComponentSymbolEnum.ExceptionFilterInterface) private readonly exceptionFilter: ExceptionFilterInterface,
    @inject(ComponentSymbolEnum.DatabaseInterface) private readonly databaseClient: DatabaseInterface,

    @inject(ComponentSymbolEnum.UserController) private readonly userController: ControllerAbstract,
    @inject(ComponentSymbolEnum.FilmController) private readonly filmController: ControllerAbstract,
    @inject(ComponentSymbolEnum.CommentController) private readonly commentController: ControllerAbstract,
  ) {
    this.expressApp = express();
  }

  public registerRoutes() {
    this.expressApp.use('/auth', this.userController.router);
    this.expressApp.use('/films', this.filmController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  public registerMiddlewares() {
    this.expressApp.use(cors());
    this.expressApp.use(express.json());
    this.expressApp.use(`/${this.config.get('UPLOAD_DIRECTORY')}`, express.static(this.config.get('UPLOAD_DIRECTORY')));
  }

  public registerExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

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

    this.registerMiddlewares();
    this.registerRoutes();
    this.registerExceptionFilters();

    this.expressApp.listen(this.config.get('PORT'));
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }

}
