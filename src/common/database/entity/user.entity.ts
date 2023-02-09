import typegoose, { getModelForClass } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import { Types } from 'mongoose';
import { createSHA256 } from '../../../assets/helper/helpers.js';
import { UserInterface } from '../../../assets/interface/user.interface.js';
import { CreateUserDto } from '../../../modules/user/dto/create-user.dto.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends Base, TimeStamps { }

@modelOptions({
  schemaOptions: {
    collection: 'User',
    timestamps: true,
  },
})
export class UserEntity implements UserInterface {
  @prop({
    unique: true,
    required: true,
  })
  public email!: string;

  @prop({
    required: true,
    default: '',
  })
  public passwordHash!: string;

  @prop({
    required: true,
    default: '',
  })
  public username!: string;

  @prop({
    default: '',
  })
  public avatar?: string;

  @prop({
    required: true,
    default: [],
  })
    favoriteFilms!: Types.ObjectId[];

  constructor (dto: CreateUserDto) {
    const { email, username, avatar } = dto;

    this.email = email;
    this.username = username;
    this.avatar = avatar;

    return this;
  }

  public setPasswordHash(password: string, salt: string): this {
    this.passwordHash = createSHA256(password, salt);

    return this;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }

  public verifyPassword(loginPassword: string, salt: string) {
    const loginPasswordHash = createSHA256(loginPassword, salt);

    return loginPasswordHash === this.passwordHash;
  }

}

export const UserModel = getModelForClass(UserEntity);
