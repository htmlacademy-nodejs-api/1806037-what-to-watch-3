import { FilmMockDataGeneratorInterface } from './film-mock-data-generator.interface.js';
import { MockDataType } from '../../assets/type/mock-data.type.js';
import { getRandomItems, getRandomValue } from '../../assets/helper/helpers.js';

export default class FilmMockDataGenerator implements FilmMockDataGeneratorInterface {
  constructor (
    private readonly mockData: MockDataType,
  )
  { }

  public generate(): string {
    const title = getRandomValue<string>(this.mockData.title);
    const description = getRandomValue<string>(this.mockData.description);
    const postDate = getRandomValue<string>(this.mockData.postDate);
    const genres = getRandomItems<string>(this.mockData.genre).join(',');
    const releaseYear = +getRandomValue<string>(this.mockData.releaseYear);
    const rating = +getRandomValue<string>(this.mockData.rating);
    const previewVideoLink = getRandomValue<string>(this.mockData.previewVideoLink);
    const videoLink = getRandomValue<string>(this.mockData.videoLink);
    const actors = getRandomItems<string>(this.mockData.actors).join(',');
    const director = getRandomValue<string>(this.mockData.director);
    const duration = +getRandomValue<string>(this.mockData.duration);
    const posterLink = getRandomValue<string>(this.mockData.posterLink);
    const backgroundImageLink = getRandomValue<string>(this.mockData.backgroundImageLink);
    const backgroundColor = getRandomValue<string>(this.mockData.backgroundColor);

    return [
      title,
      description,
      postDate,
      genres,
      releaseYear,
      rating,
      previewVideoLink,
      videoLink,
      actors,
      director,
      duration,
      posterLink,
      backgroundImageLink,
      backgroundColor,
    ].join('\t');
  }

}
