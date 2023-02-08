import { Expose } from 'class-transformer';

export class LogoutUserDto {
  @Expose()
    accessToken!: string;

  @Expose()
    email!: string;
}
