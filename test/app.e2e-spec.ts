import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // strip out, stuff that are not defined in our DTO
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it.todo('should signup');
    });
    describe('Signin', () => {
      it.todo('should signin');
    });
  });
  describe('User', () => {
    describe('Get me', () => {});
    describe('Edit user', () => {});
  });
  describe('Bookmark', () => {
    describe('Create bookmark', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmark by id', () => {});
    describe('Edito bookmark', () => {});
    describe('Delete bookmark', () => {});
  });
});
