import { Injectable } from '@nestjs/common';
import type { CookieOptions, Response } from 'express';
import type { User } from '@prisma/client';

import type { ISession } from 'src/global/interfaces';

import { TokensService } from './tokens.service';
import type { AuthServiceReturn } from './dtos';

type AuthResponse = Omit<AuthServiceReturn, 'refreshToken'>;

@Injectable()
export class AuthResService {
  constructor(private readonly tokensService: TokensService) {}

  private static readonly COOKIE_OPTIONS: CookieOptions = {
    sameSite: 'none',
    secure: true,
    httpOnly: true,
  };

  generateAuthResponse(authServiceResults: AuthServiceReturn, res: Response): AuthResponse {
    const { refreshToken, ...userWithAccess } = authServiceResults;

    res.cookie('refreshToken', refreshToken, AuthResService.COOKIE_OPTIONS);

    return userWithAccess;
  }

  generateAuthResults(user: User): AuthServiceReturn {
    const payload: ISession = { userId: user.id, email: user.email };
    const authTokens = this.tokensService.generateAuthTokens(payload);

    return {
      ...authTokens,
      user,
    };
  }
}
