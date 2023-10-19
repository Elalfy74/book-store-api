import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

import { AuthResService } from '../shared/auth-res.service';
import type { TokensAndUser } from '../shared/interfaces';

import { UsersService } from 'src/modules/users/users.service';

import { GoogleLoginDto } from './dtos';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authResService: AuthResService,
  ) {}

  async login(dto: GoogleLoginDto): Promise<TokensAndUser> {
    const email = await this.verifyGoogleToken(dto.accessToken);
    const user = await this.usersService.findOne({ where: { email } });

    if (user) return this.authResService.generateAuthResults(user);

    // Take the first part of the email
    const newUserName = email.split('@')[0];
    const newUser = await this.usersService.create({
      data: {
        email,
        name: newUserName,
      },
    });

    return this.authResService.generateAuthResults(newUser);
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
