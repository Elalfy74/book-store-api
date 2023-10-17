import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './shared/strategy';

import { AuthController } from './auth.controller';
import { CredentialsController } from './credentials/credentials.controller';
import { GoogleAuthController } from './google/google-auth.controller';

import { CredentialsService } from './credentials/credentials.service';
import { GoogleAuthService } from './google/google-auth.service';
import { AuthResService } from './shared/auth-res.service';
import { TokensService } from './shared/tokens.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController, CredentialsController, GoogleAuthController],
  providers: [JwtStrategy, CredentialsService, GoogleAuthService, AuthResService, TokensService],
})
export class AuthModule {}
