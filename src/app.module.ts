import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), // helps with getting envs into the project, also have ConfigService Globally available
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
  ],
})
export class AppModule {}
