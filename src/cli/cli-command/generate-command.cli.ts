import got from 'got';

import FilmMockDataGenerator from '../../assets/helper/film-generator.js';
import TSVFileWriter from '../../assets/helper/tsv-file-writer.js';
import { MockDataType } from '../../assets/type/mock-data.type.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class GenerateCliCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockDataType;

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const filmCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch (err) {
      return console.error(`Can't fetch data from ${url}.`);
    }

    const filmGeneratorString = new FilmMockDataGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let index = 0; index < filmCount; index++) {
      await tsvFileWriter.write(filmGeneratorString.generate());
    }

    console.log(`File ${filepath} was created!`);
  }
}
