import { Exclude, Expose } from 'class-transformer';
import { IsString, MinLength, MaxLength, IsNumber, IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { GenreType } from '../../../assets/type/genre.type.js';
import { ConstantsValue } from '../../../assets/constant/constants.js';

export class UpdateFilmDto {
  @Exclude()
  @IsMongoId()
  public filmId!: string;

  @Expose()
  @IsString()
  @MinLength(ConstantsValue.FILM_TITLE_MIN_LENGTH)
  @MaxLength(ConstantsValue.FILM_TITLE_MAX_LENGTH)
  public title?: string;

  @Expose()
  @IsString()
  @MinLength(ConstantsValue.FILM_DESCRIPTION_MIN_LENGTH)
  @MaxLength(ConstantsValue.FILM_DESCRIPTION_MAX_LENGTH)
  public description?: string;

  @Expose()
  @IsArray()
  public genres?: GenreType[] | Types.ObjectId[];

  @Expose()
  @IsNumber()
  public releaseYear?: number;

  @Expose()
  @IsString()
  public previewVideoLink?: string;

  @Expose()
  @IsString()
  public videoLink?: string;

  @Expose()
  @IsArray({
    each: true,
  })
  public actors?: string[];

  @Expose()
  @IsString()
  public director?: string;

  @Expose()
  @IsNumber()
  public duration?: number;

  @Expose()
  @IsString()
  public posterLink?: string;

  @Expose()
  @IsString()
  public backgroundImageLink?: string;

  @Expose()
  @IsString()
  public backgroundColor?: string;
}
