import { createFilmData } from '../../assets/helper/create-mock-film.js';
import { getErrorMessage } from '../../assets/helper/helpers.js';
import TSVFileReader from '../../assets/helper/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class ImportCliCommand implements CliCommandInterface {
  public readonly name = '--import';

  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.log(`Не удалось импортировать данные из файла по причине: ${getErrorMessage(err)}`);
    }
  }

  private onLine(line: string) {
    const film = createFilmData(line);
    console.log(film);
  }

  private onComplete(rowCount: number) {
    console.log(`${rowCount} rows imported.`);
  }
}
