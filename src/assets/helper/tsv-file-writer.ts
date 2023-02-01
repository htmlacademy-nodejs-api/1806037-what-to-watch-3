import { createWriteStream, WriteStream } from 'fs';
import { FileWriterInterface } from '../interface/file-writer.interface.js';

export default class TSVFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor (
    public readonly filename: string,
  ) {
    this.stream = createWriteStream(this.filename, {
      highWaterMark: 2 ** 16,
      encoding: 'utf8',
      flags: 'w',
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.stream.write(`${row}\n`)) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }

    return Promise.resolve();
  }
}
