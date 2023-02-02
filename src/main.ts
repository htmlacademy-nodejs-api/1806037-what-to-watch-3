import 'reflect-metadata';

import { Container } from 'inversify';
import Application from './app/application.js';
import { ComponentSymbolEnum } from './assets/enum/component.symbol.enum.js';
import { ConfigInterface } from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';
import { LoggerInterface } from './common/logger/logger.interface.js';
import LoggerService from './common/logger/logger.service.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(ComponentSymbolEnum.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(ComponentSymbolEnum.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<ConfigInterface>(ComponentSymbolEnum.ConfigInterface).to(ConfigService).inSingletonScope();

const application = applicationContainer.get<Application>(ComponentSymbolEnum.Application);
await application.init();
