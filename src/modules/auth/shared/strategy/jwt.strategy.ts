import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

import { JwtPayload } from 'src/global/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        JwtStrategy.cookieExtractor,
      ]),

      secretOrKey: config.get('ACCESS_TOKEN_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.userId,
      email: payload.email,
    };
  }

  private static cookieExtractor(req: Request) {
    let token: string | null = null;
    if (req.cookies) token = req.cookies['accessToken'];
    return token;
  }
}
