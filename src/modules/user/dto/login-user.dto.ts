import { Expose } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @Expose()
  @IsEmail()
    email!: string;

  @Expose()
  @IsString()
  @MinLength(6)
  @MaxLength(12)
    password!: string;

}
