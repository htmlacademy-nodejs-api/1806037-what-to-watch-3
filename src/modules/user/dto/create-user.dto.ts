import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ConstantsValue } from '../../../assets/constant/constants.js';

export class CreateUserDto {
  @Expose()
  @IsEmail()
    email!: string;

  @Expose()
  @IsString()
  @MinLength(ConstantsValue.USER_PASSWORD_MIN_LENGTH)
  @MaxLength(ConstantsValue.USER_PASSWORD_MAX_LENGTH)
    password!: string;

  @Expose()
  @IsString()
  @MinLength(ConstantsValue.USER_USERNAME_MIN_LENGTH)
  @MaxLength(ConstantsValue.USER_USERNAME_MAX_LENGTH)
    username!: string;

  @Expose()
  @Transform(({ obj }) => obj.avatar || '')
  @IsString()
    avatar?: string;
}
