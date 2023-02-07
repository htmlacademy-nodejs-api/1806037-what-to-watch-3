import { Expose, Transform } from 'class-transformer';

export class FilmFullInfoRdo {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
    id!: string;

  @Expose()
  @Transform(({ obj }) => obj.creatorUser._id.toString())
    creatorUserId!: string;

  @Expose()
    title!: string;

  @Expose()
    description!: string;

  @Expose()
    postDate!: Date;

  @Expose()
  @Transform(({ obj }) => (obj.genres as []).map((item: any) => ({
    id: item._id.toString(),
    genre: item.genre,
  })))
    genres!: object[];

  @Expose()
    releaseYear!: number;

  @Expose()
    rating!: number;

  @Expose()
    previewVideoLink!: string;

  @Expose()
    videoLink!: string;

  @Expose()
    actors!: string[];

  @Expose()
    director!: string;

  @Expose()
    duration!: number;

  @Expose()
    posterLink!: string;

  @Expose()
    backgroundImageLink!: string;

  @Expose()
    backgroundColor!: string;

  @Expose()
    commentCount!: number;

}
