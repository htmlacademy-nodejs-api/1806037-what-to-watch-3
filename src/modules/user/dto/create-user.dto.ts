import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @Expose()
  @IsEmail()
    email!: string;

  @Expose()
  @IsString()
  @MinLength(6)
  @MaxLength(12)
    password!: string;

  @Expose()
  @IsString()
  @MinLength(1)
  @MaxLength(15)
    username!: string;

  @Expose()
  @Transform(({ obj }) => obj.avatar || '')
  @IsString()
    avatar?: string;
}
