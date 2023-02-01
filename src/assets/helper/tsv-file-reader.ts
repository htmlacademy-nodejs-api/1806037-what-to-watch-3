import { readFileSync } from 'fs';
import { FileReaderinterface } from '../interface/file-reader.interface.js';
import { FilmInterface } from '../interface/film.interface.js';
import { GenreType } from '../type/genre.type.js';

export default class TSVFileReader implements FileReaderinterface {
  private rawData = '';

  constructor (
    public filename: string,
  ) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, {
      encoding: 'utf-8',
    });
  }

  public toArray(): FilmInterface[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((row) => row.split('\t'))
      .map((item) => {
        const [title, description, postDate, genre, releaseYear, rating, previewVideoLink, videoLink, actors, director, duration, posterLink, backgroundImageLink, backgroundColor, creatorUser] = item;

        return {
          title,
          description,
          postDate: new Date(postDate),
          genre: genre as GenreType,
          releaseYear: +releaseYear,
          rating: +rating,
          previewVideoLink,
          videoLink,
          actors: actors.split(','),
          director,
          duration: +duration,
          posterLink,backgroundImageLink,
          backgroundColor,
          creatorUser,
        };
      });

  }

}
