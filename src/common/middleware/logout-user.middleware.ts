import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import * as jose from 'jose';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../assets/interface/middleware.interface.js';
import HttpError from '../exception-filter/http-error.js';
import { JwtPayloadDto } from '../../modules/user/dto/jwt-payload.dto.js';
import { LogoutUserDto } from '../../modules/user/dto/logout-user.dto.js';
import UserService from '../../modules/user/user.service.js';

export class LogoutUserMiddleware implements MiddlewareInterface {
  constructor (
    private readonly jwtSecret: string,
    private readonly userService: UserService,
  ) { }

  public async execute(req: Request & { user: LogoutUserDto }, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization?.split(' ');

    if (!authHeader) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'There is no authorization token in the request.',
        LogoutUserMiddleware.name
      );
    }

    const accessToken = authHeader[1];

    await this.userService.checkAccessToken(accessToken).catch((err) => {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        (err as Error).message,
        LogoutUserMiddleware.name
      );
    });

    try {
      const payload = (await jose.jwtVerify(accessToken, crypto.createSecretKey(this.jwtSecret, 'utf8'))).payload as unknown as JwtPayloadDto;
      req.user = {
        accessToken: accessToken,
        email: payload.email,
      };

      return next();
    } catch (err) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'JWT invalid.',
        LogoutUserMiddleware.name
      );
    }

  }
}
