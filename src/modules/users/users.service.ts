import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import type { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async findOne(dto: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return this.prisma.user.findUnique(dto);
  }

  public async create(dto: Prisma.UserCreateArgs): Promise<User> {
    return this.prisma.user.create(dto);
  }
}
