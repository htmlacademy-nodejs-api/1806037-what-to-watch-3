import { Expose, Transform } from 'class-transformer';

export class CommentRdo {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
    id!: string;

  @Expose()
    comment!: string;

  @Expose()
    createdAt!: Date;

}
