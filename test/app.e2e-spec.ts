import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';
import { CreateExpenseDto } from '../src/expense/dto';
import { CreateCategoryDto } from '../src/category/dto';

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
    await app.listen(3334);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3334');
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'marckraw@icloud.com',
      password: '123',
    };
    describe('Signup', () => {
      it('should throw an exception if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: '',
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw an exception if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: '',
          })
          .expectStatus(400);
      });
      it('should throw an exception if bo body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw an exception if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: '',
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw an exception if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
            password: '',
          })
          .expectStatus(400);
      });
      it('should throw an exception if bo body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .get('/users/me')
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'changedName',
          email: 'someone@gmail.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Categories', () => {
    it('should create category', () => {
      const dto: CreateCategoryDto = {
        title: 'Jedzenie na mieście',
      };

      return pactum
        .spec()
        .post('/categories')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody(dto)
        .expectStatus(201)
        .stores('createdCategoryId', 'id');
    });

    it('should get categories array', () => {
      return pactum
        .spec()
        .get('/categories')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(200)
        .expectJsonLength(1);
    });
  });

  describe('Expense', () => {
    describe('Get empty array of expenses', () => {
      it('should get EMPTY array of expenses', () => {
        return pactum
          .spec()
          .get('/expenses')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create expense', () => {
      it('should create expense (passing all arguments)', () => {
        const dto: CreateExpenseDto = {
          title: 'Jedzenie uber eats',
          description: 'Jedzenie z uber eatsa 20.00 CHF',
          categoryId: 1,
        };

        return pactum
          .spec()
          .post('/expenses')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('createdExpenseId', 'id');
      });
    });
    describe('Get bookmarks', () => {
      it('should get all bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{createdBookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBodyContains('$S{createdBookmarkId}');
      });
    });
    describe('Edit bookmark', () => {
      it('should edit bookmark with passed id', () => {
        const dto: EditBookmarkDto = {
          link: 'https://ef.design',
          title: 'Changed to EF.DESIGN',
        };
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{createdBookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link);
      });
    });
    describe('Delete bookmark', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{createdBookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(204);
      });
      it('should get empty bookmarks after delete', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
