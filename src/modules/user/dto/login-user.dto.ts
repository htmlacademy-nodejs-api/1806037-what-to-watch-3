import { Expose } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ConstantsValue } from '../../../assets/constant/constants.js';

export class LoginUserDto {
  @Expose()
  @IsEmail()
    email!: string;

  @Expose()
  @IsString()
  @MinLength(ConstantsValue.USER_PASSWORD_MIN_LENGTH)
  @MaxLength(ConstantsValue.USER_PASSWORD_MAX_LENGTH)
    password!: string;

}
