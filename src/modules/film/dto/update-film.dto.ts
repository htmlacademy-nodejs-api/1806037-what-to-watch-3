import { Expose } from 'class-transformer';
import { IsString, MinLength, MaxLength, IsEnum, IsNumber, IsArray } from 'class-validator';
import { GenreEnum } from '../../../assets/enum/genre.enum.js';
import { GenreType } from '../../../assets/type/genre.type.js';

export class UpdateFilmDto {
  @Expose()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  public title!: string;

  @Expose()
  @IsString()
  @MinLength(20)
  @MaxLength(1024)
  public description!: string;

  @Expose()
  @IsEnum(Object.create(GenreEnum))
  public genre!: GenreType;

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
  @IsArray({
    each: true,
  })
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
