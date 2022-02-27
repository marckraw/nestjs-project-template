import { Module } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
