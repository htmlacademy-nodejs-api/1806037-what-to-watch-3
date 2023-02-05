import 'reflect-metadata';

import { Container } from 'inversify';
import { ComponentSymbolEnum } from './assets/enum/component.symbol.enum.js';

import Application from './app/application.js';
import { applicationDIContainer } from './app/DI/application.container.js';
import { userDIContainer } from './app/DI/user.container.js';
import { filmDIContainer } from './app/DI/film.container.js';


async function bootstrap() {
  const mainContainer = Container.merge(
    applicationDIContainer,
    userDIContainer,
    filmDIContainer,
  );

  const application = mainContainer.get<Application>(ComponentSymbolEnum.Application);
  await application.init();
}

bootstrap();
