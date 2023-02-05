import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';

import { GenreEnum } from '../../../assets/enum/genre.enum.js';


export interface GenreEntity extends Base, TimeStamps { }

@modelOptions({
  schemaOptions: {
    collection: 'Genre',
    timestamps: true,
  },
})
export class GenreEntity {
  @prop({
    required: true,
    unique: true,
    enum: GenreEnum,
    type: () => String,
    trim: true,
  })
    genre!: string;

  constructor (genre: string) {
    this.genre = genre;
  }
}

export const GenreModel = getModelForClass(GenreEntity);
