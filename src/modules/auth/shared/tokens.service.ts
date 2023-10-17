import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import type { ISession } from 'src/global/interfaces';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokensService {
  constructor(private readonly jwt: JwtService, private readonly config: ConfigService) {}

  private readonly ACCESS_TOKEN_SECRET: string = this.config.get('ACCESS_TOKEN_SECRET')!;
  private readonly ACCESS_TOKEN_TTL: number = +this.config.get('ACCESS_TOKEN_TTL');
  private readonly REFRESH_TOKEN_SECRET: string = this.config.get('REFRESH_TOKEN_SECRET')!;
  private readonly REFRESH_TOKEN_TTL: string = this.config.get('REFRESH_TOKEN_TTL')!;

  generateAuthTokens(payload: ISession): Tokens {
    console.log(this.ACCESS_TOKEN_SECRET, this.ACCESS_TOKEN_TTL, this.REFRESH_TOKEN_SECRET);

    const accessToken = this.signToken(payload, this.ACCESS_TOKEN_SECRET, this.ACCESS_TOKEN_TTL);
    const refreshToken = this.signToken(payload, this.REFRESH_TOKEN_SECRET, this.REFRESH_TOKEN_TTL);

    return {
      accessToken,
      refreshToken,
    };
  }

  private signToken(payload: ISession, secret: string, expiresIn: string | number): string {
    return this.jwt.sign(payload, { secret, expiresIn });
  }

  // reIssueAccessToken(refreshToken: string) {
  //   // Verify the refresh token
  //   const decoded = this.verifyRefreshToken(refreshToken);

  //   if (!decoded) return false;

  //   // Create new AccessToken
  //   const newAccessToken = this.signToken(
  //     { email: decoded.email, userId: decoded.userId },
  //     'access',
  //   );

  //   // Send then new AccessToken along side with the user object
  //   return {
  //     newAccessToken,
  //     user: {
  //       email: decoded.email,
  //       userId: decoded.userId,
  //     },
  //   };
  // }

  // private verifyRefreshToken(refreshToken: string) {
  //   try {
  //     return this.jwt.verify<JwtPayload>(refreshToken, {
  //       secret: this.config.get('REFRESH_TOKEN_SECRET'),
  //     });
  //   } catch (e: any) {
  //     return undefined;
  //   }
  // }
}
