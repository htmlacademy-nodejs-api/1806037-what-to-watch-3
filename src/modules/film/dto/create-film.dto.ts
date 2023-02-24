import { Expose } from 'class-transformer';
import { IsArray, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ConstantsValue } from '../../../assets/constant/constants.js';
import { GenreType } from '../../../assets/type/genre.type';

export class CreateFilmDto {
  @Expose()
  @IsString()
  @MinLength(ConstantsValue.FILM_TITLE_MIN_LENGTH)
  @MaxLength(ConstantsValue.FILM_TITLE_MAX_LENGTH)
  public title!: string;

  @Expose()
  @IsString()
  @MinLength(ConstantsValue.FILM_DESCRIPTION_MIN_LENGTH)
  @MaxLength(ConstantsValue.FILM_DESCRIPTION_MAX_LENGTH)
  public description!: string;

  @Expose()
  @IsArray()
  public genres!: GenreType[];

  @Expose()
  @IsNumber()
  public releaseYear!: number;

  @Expose()
  @IsString()
  public previewVideoLink!: string;

  @Expose()
  @IsString()
  public videoLink!: string;

  @Expose()
  @IsArray()
  public actors!: string[];

  @Expose()
  @IsString()
  public director!: string;

  @Expose()
  @IsNumber()
  public duration!: number;

  @Expose()
  @IsString()
  public posterLink!: string;

  @Expose()
  @IsString()
  public backgroundImageLink!: string;

  @Expose()
  @IsString()
  public backgroundColor!: string;
}
