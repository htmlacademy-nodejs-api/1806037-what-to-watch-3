import { Expose, Transform } from 'class-transformer';

export class CommentRdo {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
    id!: string;

  @Expose()
  @Transform(({ obj }) => obj._id.toString())
    creatorUser!: string;

  @Expose()
    comment!: string;

  @Expose()
    rating!: number;

  @Expose()
    createdAt!: Date;

}
