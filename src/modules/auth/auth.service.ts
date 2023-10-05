import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { User } from '@prisma/client';
import axios from 'axios';

import { PrismaService } from 'nestjs-prisma';
import { TokenService } from './token.service';

import { GoogleLoginDto, LoginDto, RegisterDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto) {
    const { password } = dto;
    // Hash password and register user
    dto.password = await hash(password, 12);

    const user = await this.prisma.user.create({
      data: dto,
    });

    return this.generateTokens(user);
  }

  async login({ email, password: hash }: LoginDto) {
    // Check email
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new UnauthorizedException('Invalid Email or Password');

    // Check Password
    const isEqual = await compare(hash, user.password);
    if (!isEqual) throw new UnauthorizedException('Invalid Email or Password');

    return this.generateTokens(user);
  }

  async googleLogin(dto: GoogleLoginDto) {
    console.log(dto.accessToken);
    const email = await this.verifyGoogleToken(dto.accessToken);

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      return this.generateTokens(user);
    }

    const newUser = await this.prisma.user.create({
      data: {
        email,
        name: email.split('@')[0],
      },
    });
    return this.generateTokens(newUser);
  }

  private async verifyGoogleToken(token: string) {
    try {
      const { data } = await axios.get<{ email: string }>(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
      );
      return data.email;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private generateTokens(user: User) {
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
