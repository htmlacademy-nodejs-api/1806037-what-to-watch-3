import { Expose, Transform } from 'class-transformer';

export class UserRdo {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
    id!: string;

  @Expose()
    email!: string;

  @Expose()
    username!: string;

}
