import { Container } from 'inversify';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import { ComponentSymbolEnum } from '../../assets/enum/component.symbol.enum.js';
import { CommentServiceInterface } from '../../modules/comment/comment-service.interface.js';
import CommentService from '../../modules/comment/comment.service.js';
import { CommentEntity, CommentModel } from '../../common/database/entity/comment.entity.js';

const commentDIContainer = new Container();

commentDIContainer.bind<CommentServiceInterface>(ComponentSymbolEnum.CommentServiceinterface).to(CommentService).inSingletonScope();
commentDIContainer.bind<ModelType<CommentEntity>>(ComponentSymbolEnum.CommentModel).toConstantValue(CommentModel);

export { commentDIContainer };
