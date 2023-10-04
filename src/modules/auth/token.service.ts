import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { ISession, JwtPayload } from 'src/global/interfaces';

@Injectable()
export class TokenService {
  constructor(private jwt: JwtService, private config: ConfigService) {}

  signToken(payload: ISession, type: 'access' | 'refresh') {
    const secret =
      type === 'access'
        ? this.config.get('ACCESS_TOKEN_SECRET')
        : this.config.get('REFRESH_TOKEN_SECRET');

    // AccessToken has expire data but refreshToken doesn't
    if (type === 'access') {
      return this.jwt.sign(payload, {
        secret,
        expiresIn: +this.config.get('ACCESS_TOKEN_TTL'),
      });
    } else {
      return this.jwt.sign(payload, {
        secret,
      });
    }
  }

  reIssueAccessToken(refreshToken: string) {
    // Verify the refresh token
    const decoded: JwtPayload | undefined =
      this.verifyRefreshToken(refreshToken);

    if (!decoded) return false;

    // Create new AccessToken
    const newAccessToken = this.signToken(
      { email: decoded.email, userId: decoded.userId },
      'access',
    );

    // Send then new AccessToken along side with the user object
    return {
      newAccessToken,
      user: {
        email: decoded.email,
        userId: decoded.userId,
      },
    };
  }

  private verifyRefreshToken(refreshToken: string) {
    try {
      return this.jwt.verify(refreshToken, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      });
    } catch (e: any) {
      console.error(e);
      return undefined;
    }
  }
}
