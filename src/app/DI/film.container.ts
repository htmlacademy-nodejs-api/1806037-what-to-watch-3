import { Container } from 'inversify';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { GenreEntity, GenreModel } from '../../common/database/entity/genre.entity.js';
import { FilmEntity, FilmModel } from '../../common/database/entity/film.entity.js';
import { FilmServiceInterface } from '../../modules/film/film-service.interface.js';
import FilmService from '../../modules/film/film.service.js';
import { ControllerInterface } from '../../assets/interface/controller.interface.js';
import FilmController from '../../modules/film/film.controller.js';

const filmDIContainer = new Container();

filmDIContainer.bind<ModelType<GenreEntity>>(ComponentSymbolEnum.GenreModel).toConstantValue(GenreModel);
filmDIContainer.bind<ModelType<FilmEntity>>(ComponentSymbolEnum.FilmModel).toConstantValue(FilmModel);
filmDIContainer.bind<FilmServiceInterface>(ComponentSymbolEnum.FilmServiceInterface).to(FilmService).inSingletonScope();
filmDIContainer.bind<ControllerInterface>(ComponentSymbolEnum.FilmController).to(FilmController).inSingletonScope();

export { filmDIContainer };
