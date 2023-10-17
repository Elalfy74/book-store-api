import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from 'nestjs-prisma';

import { AuthResService } from '../shared/auth-res.service';
import type { AuthServiceReturn } from '../shared/dtos';

import { RegisterDto, LoginDto } from './dtos';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authResServices: AuthResService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthServiceReturn> {
    const { password } = dto;
    // Hash password and register user
    dto.password = await hash(password, 12);

    const user = await this.prisma.user.create({
      data: dto,
    });

    return this.authResServices.generateAuthResults(user);
  }

  async login({ email, password: hash }: LoginDto): Promise<AuthServiceReturn> {
    // Check email
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Maybe signed with google
    if (!user || !user.password) throw new UnauthorizedException('Invalid Email or Password');

    // Check Password
    const isEqual = await compare(hash, user.password);
    if (!isEqual) throw new UnauthorizedException('Invalid Email or Password');

    return this.authResServices.generateAuthResults(user);
  }
}
