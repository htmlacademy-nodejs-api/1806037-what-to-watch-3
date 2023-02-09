import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import { LogoutUserDto } from '../../../modules/user/dto/logout-user.dto.js';


export interface LogoutUserEntity extends Base, TimeStamps { }

@modelOptions({
  schemaOptions: {
    collection: 'LogoutUser',
    timestamps: true,
  }
})
export class LogoutUserEntity {
  @prop({
    required: true,
  })
  public accessToken!: string;

  @prop({
    required: true,
  })
  public accessTokenExp!: number;

  @prop({
    required: true,
  })
  public email!: string;


  constructor (dto: LogoutUserDto) {
    const { accessToken, email, accessTokenExp } = dto;

    this.accessToken = accessToken;
    this.email = email;
    this.accessTokenExp = accessTokenExp;
  }
}

export const LogoutUserModel = getModelForClass(LogoutUserEntity);
