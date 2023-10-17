import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { Serialize } from 'src/global/interceptors';

import { AuthResService } from '../shared/auth-res.service';
import { AuthResponseDto } from '../shared/dtos';

import { CredentialsService } from './credentials.service';
import { RegisterDto, LoginDto } from './dtos';

@Controller('auth/credential')
@ApiTags('Auth')
@Serialize(AuthResponseDto)
export class CredentialsController {
  constructor(
    private readonly credentialsService: CredentialsService,
    private readonly authResService: AuthResService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const authServiceResults = await this.credentialsService.register(dto);

    return this.authResService.generateAuthResponse(authServiceResults, res);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const authServiceResults = await this.credentialsService.login(dto);

    return this.authResService.generateAuthResponse(authServiceResults, res);
  }
}
