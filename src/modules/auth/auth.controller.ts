import { Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { GetUser } from 'src/global/decorators';
import { JwtAuthGuard } from 'src/global/guards';
import { Serialize } from 'src/global/interceptors';
import type { ISession } from 'src/global/interfaces';

import { UsersService } from '../users/users.service';

import { UserDto } from './shared/dtos';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('refreshToken', null);
  }

  @Get('current-user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Serialize(UserDto)
  public async getCurrentUser(@GetUser() currentUser: ISession) {
    return this.usersService.findOne({ where: { id: currentUser.userId } });
  }
}
