import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @Expose()
  @IsEmail()
    email!: string;

  @Expose()
  @IsString()
    password!: string;

  @Expose()
  @IsString()
    username!: string;

  // avatar?: string;
}
