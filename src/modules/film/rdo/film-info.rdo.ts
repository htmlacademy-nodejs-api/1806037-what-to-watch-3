import { Expose, Transform } from 'class-transformer';

export class FilmInfoRdo {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
    id!: string;

  @Expose()
  @Transform(({ obj }) => obj.creatorUser._id.toString())
    creatorUser!: string;

  @Expose()
    title!: string;

  @Expose()
    postDate!: Date;

  @Expose()
  @Transform(({ obj }) => (obj.genres as []).map((item: any) => ({
    id: item._id.toString(),
    genre: item.genre,
  })))
    genres!: object[];

  @Expose()
    previewVideoLink!: string;


  @Expose()
    posterLink!: string;

  @Expose()
    commentCount!: number;

}
