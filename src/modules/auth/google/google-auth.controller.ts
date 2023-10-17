import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { Serialize } from 'src/global/interceptors';

import { AuthResService } from '../shared/auth-res.service';
import { AuthResponseDto } from '../shared/dtos';

import { GoogleAuthService } from './google-auth.service';
import { GoogleLoginDto } from './dtos';

@Controller('auth/google')
@ApiTags('Auth')
@Serialize(AuthResponseDto)
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly authResService: AuthResService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: GoogleLoginDto, @Res({ passthrough: true }) res: Response) {
    const googleServiceResults = await this.googleAuthService.login(dto);

    return this.authResService.generateAuthResponse(googleServiceResults, res);
  }
}
