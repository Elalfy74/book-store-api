import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { User } from '@prisma/client';
import axios from 'axios';

import type { TokensAndUser } from '../shared/interfaces';
import { TokensService } from '../shared/tokens.service';
import { UsersService } from 'src/modules/users/users.service';

import { GoogleLoginDto } from './dtos';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async login(dto: GoogleLoginDto): Promise<TokensAndUser> {
    let user: User | null = null;
    const email = await this.verifyGoogleToken(dto.accessToken);

    user = await this.usersService.findOne({ where: { email } });

    if (user) {
      const tokens = this.tokensService.generateAuthTokens({ userId: user.id, email: user.email });

      return {
        tokens,
        user,
      };
    }

    // Take the first part of the email
    const newUserName = email.split('@')[0];
    user = await this.usersService.create({
      data: {
        email,
        name: newUserName,
      },
    });

    const tokens = this.tokensService.generateAuthTokens({ userId: user.id, email: user.email });

    return {
      tokens,
      user,
    };
  }

  private async verifyGoogleToken(token: string): Promise<string> {
    const GOOGLE_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';

    try {
      const { data } = await axios.get<{ email: string }>(`${GOOGLE_URL}${token}`);
      return data.email;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
