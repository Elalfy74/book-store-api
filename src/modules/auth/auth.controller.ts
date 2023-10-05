import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { Serialize } from 'src/global/interceptors';
import { GetUser } from 'src/global/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/global/guards';
import { ISession } from 'src/global/interfaces';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto, GoogleLoginDto } from './dtos';

@Controller('auth')
@ApiTags('Auth')
@Serialize(AuthResponseDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const savedUser = await this.authService.register(dto);

    response.cookie('refreshToken', savedUser.refreshToken, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });

    return savedUser;
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(dto);

    response.cookie('refreshToken', user.refreshToken, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });

    return user;
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('refreshToken', null, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
  }

  @Post('google')
  @HttpCode(200)
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.googleLogin(dto);
  }

  @Get('checkauth')
  @UseGuards(JwtAuthGuard)
  getMe(@GetUser() user: ISession) {
    return user;
  }
}
