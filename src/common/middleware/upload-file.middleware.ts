import { NextFunction, Request, Response } from 'express';
import mime from 'mime-types';
import multer, { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { MiddlewareInterface } from '../../assets/interface/middleware.interface.js';

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor (
    private readonly uploadDirectory: string,
    private readonly fieldName: string,
  ) { }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${extension}`);
      },
    });

    const uploadSingleFileMiddleware = multer({ storage: storage })
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
