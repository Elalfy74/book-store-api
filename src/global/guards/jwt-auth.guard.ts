import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TokensService } from 'src/modules/auth/shared/tokens.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly tokensService: TokensService) {
    super();
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (user) return user;

    // Check for error
    if (err) throw err || new UnauthorizedException();

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const { refreshToken } = req.cookies;

    // In case of expiration, reissue AccessToken
    if (refreshToken && info && info.message === 'jwt expired') {
      const results = this.tokensService.reIssueAccessToken(refreshToken);
      // Send the new AccessToken in the header
      // And set the new user data in the request
      if (results) {
        res.setHeader('x-access-token', results.accessToken);
        user = results.payload;
      }
    }

    // If no accessToken or expired with no refresh token
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
