import { ISession } from './session.interface';

export class JwtPayload extends ISession {
  iat: string;
}
