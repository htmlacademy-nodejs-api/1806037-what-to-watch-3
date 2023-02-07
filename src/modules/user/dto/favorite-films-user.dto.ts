import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class FavoriteFilmsUserDto {
  @Expose()
    _id!: Types.ObjectId;

  @Expose()
    favoriteFilms!: Types.ObjectId[];
}
