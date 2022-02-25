import { Module } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController]
})
export class UserModule {}
