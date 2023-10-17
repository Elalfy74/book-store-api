import type { User } from '@prisma/client';

import type { Tokens } from '../tokens.service';

export type AuthServiceReturn = Tokens & {
  user: User;
};
