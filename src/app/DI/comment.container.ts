import { Container } from 'inversify';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { CommentServiceInterface } from '../../modules/comment/comment-service.interface.js';
import CommentService from '../../modules/comment/comment.service.js';
import { CommentEntity, CommentModel } from '../../common/database/entity/comment.entity.js';
import { ControllerInterface } from '../../assets/interface/controller.interface.js';
import CommentController from '../../modules/comment/comment.controller.js';

const commentDIContainer = new Container();

commentDIContainer.bind<ModelType<CommentEntity>>(ComponentSymbolEnum.CommentModel).toConstantValue(CommentModel);
commentDIContainer.bind<CommentServiceInterface>(ComponentSymbolEnum.CommentServiceinterface).to(CommentService).inSingletonScope();
commentDIContainer.bind<ControllerInterface>(ComponentSymbolEnum.CommentController).to(CommentController).inSingletonScope();

export { commentDIContainer };
