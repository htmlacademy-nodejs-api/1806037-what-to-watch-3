import { Expose } from 'class-transformer';
import { IsInt, IsMongoId, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCommentDto {
  @Expose()
  @IsString()
  @MinLength(5)
  @MaxLength(1024)
    comment!: string;

  @Expose()
  @IsInt()
  @Min(1)
  @Max(10)
    rating!: number;

  @Expose()
  @IsMongoId()
    filmId!: string;

}
