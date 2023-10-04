import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

import { PrismaService } from 'nestjs-prisma';
import { TokenService } from './token.service';

import { LoginDto, RegisterDto } from './dtos';

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
