import { validate } from 'class-validator';
import { createFilmData, fillTransformObject, getErrorMessage, getMongoDBUri } from '../../assets/helper/helpers.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import ConfigService from '../../common/config/config.service.js';
import { DatabaseInterface } from '../../common/database/database.interface.js';
import DatabaseService from '../../common/database/database.service.js';
import { FilmModel } from '../../common/database/entity/film.entity.js';
import { GenreModel } from '../../common/database/entity/genre.entity.js';
import TSVFileReader from '../../common/file-reader/tsv-file-reader.js';
import ConsoleLoggerService from '../../common/logger/console-logger.service.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { CreateFilmDto } from '../../modules/film/dto/create-film.dto.js';
import { FilmServiceInterface } from '../../modules/film/film-service.interface.js';
import FilmService from '../../modules/film/film.service.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class ImportCliCommand implements CliCommandInterface {
  public readonly name = '--import';
  public creatorUserId = '63df78963bfe990c85df436d';

  private readonly logger: LoggerInterface;
  private readonly config: ConfigInterface;
  private readonly databaseService: DatabaseInterface;
  private readonly filmService: FilmServiceInterface;

  constructor () {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.config = new ConfigService(this.logger);

    this.databaseService = new DatabaseService(this.logger);
    this.filmService = new FilmService(this.logger, FilmModel, GenreModel);
  }

  public async execute(filename: string): Promise<void> {
    const mongoDbUri = getMongoDBUri(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseService.connect(mongoDbUri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.log(`Не удалось импортировать данные из файла по причине: ${getErrorMessage(err)}`);
    }
  }

  private async onLine(line: string, resolve: () => void) {
    const film = createFilmData(line);
    await this.saveFilmToMongoDB(film, this.creatorUserId);
    resolve();
  }

  private onComplete(rowCount: number) {
    console.log(`${rowCount} rows imported.`);
  }

  private async saveFilmToMongoDB (dto: CreateFilmDto, creatorUserId: string) {
    const dtoTransform = fillTransformObject(CreateFilmDto, dto);
    const errors = await validate(dtoTransform);

    if (errors.length > 0) {
      throw errors.toString();
    }

    await this.filmService.create(dto, creatorUserId);
  }
}
