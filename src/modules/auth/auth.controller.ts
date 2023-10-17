import { Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { JwtAuthGuard } from 'src/global/guards';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('refreshToken', null);
  }

  @Get('checkauth')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  checkAuth() {
    return true;
  }
}
