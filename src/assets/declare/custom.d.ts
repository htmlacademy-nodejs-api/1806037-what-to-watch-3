import { JwtPayloadDto } from '../../modules/user/dto/jwt-payload.dto.js';
import { LogoutUserDto } from '../../modules/user/dto/logout-user.dto.js';

declare namespace Express {
  export interface Request {
    user: JwtPayloadDto | LogoutUserDto,
  }
}
