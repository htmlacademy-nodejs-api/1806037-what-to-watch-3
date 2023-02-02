import { GenreType } from '../type/genre.type.js';

export const createFilmData = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, postDate, genre, releaseYear, rating, previewVideoLink, videoLink, actors, director, duration, posterLink, backgroundImageLink, backgroundColor, creatorUser] = tokens;

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
};