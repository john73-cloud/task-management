import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/users/users.service';
import { CreateUserDto } from './../src/users/dto/create-user.dto';
import { UserRole } from './../src/common/enums/user-role.enum';
import { ConfigService } from '@nestjs/config';
import { User } from './../src/users/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let testUser: User;
  const testUserPassword = 'TestPassword123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();

    usersService = moduleFixture.get<UsersService>(UsersService);
    const configService = moduleFixture.get<ConfigService>(ConfigService);

    // Clean up existing test user if any, then create a new one
    const email = 'test.user.auth@example.com';
    try {
      const existingUser = await usersService.findByEmail(email);
      if (existingUser) {
        await usersService.remove(existingUser.id); // Assumes remove method by ID exists
      }
    } catch (error) {
      // Ignore if user not found
    }

    const createUserDto: CreateUserDto = {
      email,
      password: testUserPassword,
      firstName: 'Test',
      lastName: 'UserAuth',
      role: UserRole.USER,
    };
    testUser = await usersService.create(createUserDto);
  });

  afterAll(async () => {
    // Clean up the test user
    if (testUser && usersService.remove) {
      try {
        await usersService.remove(testUser.id);
      } catch (error) {
      }
    }
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should log in a user and return a JWT token', async () => {
      const loginDto = {
        email: testUser.email,
        password: testUserPassword,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200); 

      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');
    });

    it('should fail to log in with incorrect password', () => {
      const loginDto = {
        email: testUser.email,
        password: 'WrongPassword123!',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401); // Unauthorized
    });

    it('should fail to log in with a non-existent email', () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: testUserPassword,
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401); // Unauthorized (or 404 depending on your auth service logic)
    });
  });
});

