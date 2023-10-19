import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { Serialize } from 'src/global/interceptors';

import { AuthResGenerator } from '../shared/auth-res-generator';
import { UserDto } from '../shared/dtos';

import { CredentialsService } from './credentials.service';
import { RegisterDto, LoginDto } from './dtos';

@Controller('auth/credentials')
@ApiTags('Auth')
@Serialize(UserDto)
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const tokensAndUser = await this.credentialsService.register(dto);

    return AuthResGenerator.generateAuthResponse(tokensAndUser, res);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokensAndUser = await this.credentialsService.login(dto);

    return AuthResGenerator.generateAuthResponse(tokensAndUser, res);
  }
}
