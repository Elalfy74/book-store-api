import type { User } from '@prisma/client';

import type { Tokens } from './tokens';

export interface TokensAndUser extends Tokens {
  user: User;
}
