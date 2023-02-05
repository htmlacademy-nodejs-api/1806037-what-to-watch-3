import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from '../../common/database/entity/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
}
