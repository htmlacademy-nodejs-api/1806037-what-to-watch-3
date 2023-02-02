import EventEmitter from 'events';
import { createReadStream, ReadStream } from 'fs';
import { FileReaderinterface } from './file-reader.interface.js';


export default class TSVFileReader extends EventEmitter implements FileReaderinterface {
  private stream: ReadStream;

  constructor (
    public filename: string,
  ) {
    super();
    this.stream = createReadStream(this.filename, {
      highWaterMark: 16384,
      encoding: 'utf8',
    });
  }

  public async read(): Promise<void> {
    let lineRead = '';
    let endLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of this.stream) {
      lineRead += chunk.toString();

      while ((endLinePosition = lineRead.indexOf('\n')) >= 0) {
        const completeRow = lineRead.slice(0, endLinePosition + 1);
        lineRead = lineRead.slice(endLinePosition + 1);
        importedRowCount++;

        this.emit('line', completeRow);
      }

      this.emit('end', importedRowCount);
    }
  }

}
