import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

import { AuthResService } from '../shared/auth-res.service';
import type { TokensAndUser } from '../shared/interfaces';

import { UsersService } from 'src/modules/users/users.service';

import { RegisterDto, LoginDto } from './dtos';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authResServices: AuthResService,
  ) {}

  async register(dto: RegisterDto): Promise<TokensAndUser> {
    const { password } = dto;
    // Hash password and register user
    dto.password = await hash(password, 12);

    const user = await this.usersService.create({ data: dto });

    return this.authResServices.generateAuthResults(user);
  }

  async login({ email, password: hash }: LoginDto): Promise<TokensAndUser> {
    // Check email
    const user = await this.usersService.findOne({ where: { email } });

    // Maybe signed with google
    if (!user || !user.password) throw new UnauthorizedException('Invalid Email or Password');

    // Check Password
    const isEqual = await compare(hash, user.password);
    if (!isEqual) throw new UnauthorizedException('Invalid Email or Password');

    return this.authResServices.generateAuthResults(user);
  }
}
