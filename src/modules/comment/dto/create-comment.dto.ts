import { Expose } from 'class-transformer';
import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ConstantsValue } from '../../../assets/constant/constants.js';

export class CreateCommentDto {
  @Expose()
  @IsString()
  @MinLength(ConstantsValue.COMMENT_MIN_LENGTH)
  @MaxLength(ConstantsValue.COMMENT_MAX_LENGTH)
    comment!: string;

  @Expose()
  @IsInt()
  @Min(ConstantsValue.COMMENT_MIN_RATING)
  @Max(ConstantsValue.COMMENT_MAX_RATING)
    rating!: number;

}
