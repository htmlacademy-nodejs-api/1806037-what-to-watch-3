export interface FileReaderinterface {
  readonly filename: string;
  read(): void;
}
