import { Expose } from 'class-transformer';

export class JwtPayloadDto {
  @Expose()
    id!: string;

  @Expose()
    email!: string;

  @Expose()
    exp!: number;
}
