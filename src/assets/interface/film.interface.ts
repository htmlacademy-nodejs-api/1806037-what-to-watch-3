import { GenreType } from '../type/genre.type.js';

export interface FilmInterface {
  title: string,
	description: string,
	postDate: Date,
	genre: GenreType,
	releaseYear: number,
	rating: number,
	previewVideoLink: string,
	videoLink: string,
	actors: string[],
	director: string,
	duration: number,
	posterLink: string,
	backgroundImageLink: string,
	backgroundColor: string,

	creatorUser: string,
}
