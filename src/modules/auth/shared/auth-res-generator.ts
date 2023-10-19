import type { CookieOptions, Response } from 'express';
import type { User } from '@prisma/client';

import type { TokensAndUser } from './interfaces';

export class AuthResGenerator {
  private static readonly COOKIE_OPTIONS: CookieOptions = {
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    path: '/',
  };

  public static generateAuthResponse({ tokens, user }: TokensAndUser, res: Response): User {
    res.cookie('refreshToken', tokens.refreshToken, this.COOKIE_OPTIONS);
    res.cookie('accessToken', tokens.accessToken, this.COOKIE_OPTIONS);

    return user;
  }
}
