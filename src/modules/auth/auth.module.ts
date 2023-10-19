import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';

import { JwtStrategy } from './shared/strategy';

// Controllers
import { AuthController } from './auth.controller';
import { CredentialsController } from './credentials/credentials.controller';
import { GoogleAuthController } from './google/google-auth.controller';

// Services
import { CredentialsService } from './credentials/credentials.service';
import { GoogleAuthService } from './google/google-auth.service';
import { TokensService } from './shared/tokens.service';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController, CredentialsController, GoogleAuthController],
  providers: [JwtStrategy, CredentialsService, GoogleAuthService, TokensService],
})
export class AuthModule {}
