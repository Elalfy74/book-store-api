import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { User } from '@prisma/client';
import axios from 'axios';

import { PrismaService } from 'nestjs-prisma';
import { TokenService } from './token.service';

import { GoogleLoginDto, LoginDto, RegisterDto } from './dtos';

type GenerateTokensReturn = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto): Promise<GenerateTokensReturn> {
    const { password } = dto;
    // Hash password and register user
    dto.password = await hash(password, 12);

    const user = await this.prisma.user.create({
      data: dto,
    });

    return this.generateTokens(user);
  }

  async login({ email, password: hash }: LoginDto): Promise<GenerateTokensReturn> {
    // Check email
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Maybe signed with google
    if (!user || !user.password) throw new UnauthorizedException('Invalid Email or Password');

    // Check Password
    const isEqual = await compare(hash, user.password);
    if (!isEqual) throw new UnauthorizedException('Invalid Email or Password');

    return this.generateTokens(user);
  }

  async googleLogin(dto: GoogleLoginDto): Promise<GenerateTokensReturn> {
    const email = await this.verifyGoogleToken(dto.accessToken);
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) return this.generateTokens(user);

    // Take the first part of the email
    const newUserName = email.split('@')[0];
    const newUser = await this.prisma.user.create({
      data: {
        email,
        name: newUserName,
      },
    });

    return this.generateTokens(newUser);
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

  private generateTokens(user: User): GenerateTokensReturn {
    const accessToken = this.tokenService.signToken(
      {
        userId: user.id,
        email: user.email,
      },
      'access',
    );

    const refreshToken = this.tokenService.signToken(
      {
        userId: user.id,
        email: user.email,
      },
      'refresh',
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
