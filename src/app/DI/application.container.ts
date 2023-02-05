import { Container } from 'inversify';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import Application from '../application.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import ConfigService from '../../common/config/config.service.js';
import { DatabaseInterface } from '../../common/database/database.interface.js';
import DatabaseService from '../../common/database/database.service.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import LoggerService from '../../common/logger/logger.service.js';

const applicationDIContainer = new Container();

applicationDIContainer.bind<Application>(ComponentSymbolEnum.Application).to(Application).inSingletonScope();
applicationDIContainer.bind<LoggerInterface>(ComponentSymbolEnum.LoggerInterface).to(LoggerService).inSingletonScope();
applicationDIContainer.bind<ConfigInterface>(ComponentSymbolEnum.ConfigInterface).to(ConfigService).inSingletonScope();
applicationDIContainer.bind<DatabaseInterface>(ComponentSymbolEnum.DatabaseInterface).to(DatabaseService).inSingletonScope();

export { applicationDIContainer };
