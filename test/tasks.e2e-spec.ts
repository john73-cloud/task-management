import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/users/users.service';
import { CreateUserDto } from './../src/users/dto/create-user.dto';
import { UserRole } from './../src/common/enums/user-role.enum';
import { CreateTaskDto } from './../src/tasks/dto/create-task.dto';
import { UpdateTaskDto } from './../src/tasks/dto/update-task.dto';
import { TaskStatus } from './../src/common/enums/task-status.enum';
import { TaskPriority } from './../src/common/enums/task-priority.enum';
import { User } from './../src/users/entities/user.entity';
import { Task } from './../src/tasks/entities/task.entity';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let user: User;
  let adminUser: User;
  let userAuthToken: string;
  let adminAuthToken: string;
  let createdTaskId: string;
  let assignedToUserId: string; 

  const userPassword = 'TestUserPassword123!';
  const adminPassword = 'TestAdminPassword123!';

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

    const userEmail = 'test.task.user@example.com';
    const adminEmail = 'test.task.admin@example.com';

    try { 
      const existingUser = await usersService.findByEmail(userEmail);
      if (existingUser) await usersService.remove(existingUser.id);
    } catch (e) {}
    try { 
      const existingAdmin = await usersService.findByEmail(adminEmail);
      if (existingAdmin) await usersService.remove(existingAdmin.id);
    } catch (e) {}

    user = await usersService.create({
      email: userEmail,
      password: userPassword,
      firstName: 'Task',
      lastName: 'User',
      role: UserRole.USER,
    } as CreateUserDto);
    assignedToUserId = user.id;

    adminUser = await usersService.create({
      email: adminEmail,
      password: adminPassword,
      firstName: 'Task',
      lastName: 'Admin',
      role: UserRole.ADMIN,
    } as CreateUserDto);

    const userLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userEmail, password: userPassword })
      .expect(200);
    userAuthToken = userLoginResponse.body.access_token;

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password: adminPassword })
      .expect(200);
    adminAuthToken = adminLoginResponse.body.access_token;
  });

  afterAll(async () => {
    if (user) try { await usersService.remove(user.id); } catch (e) {}
    if (adminUser) try { await usersService.remove(adminUser.id); } catch (e) {}
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a task when authenticated as a user', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'E2E Test Task',
        description: 'This is a task created during e2e testing.',
        assignedTo: assignedToUserId, 
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        dueDate: new Date().toISOString(),
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${userAuthToken}`)
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(createTaskDto.title);
      createdTaskId = response.body.id; 
    });

    it('should fail to create a task without authentication', () => {
      const createTaskDto: CreateTaskDto = {
        title: 'E2E Test Task Fail',
        description: 'This should not be created.',
        assignedTo: assignedToUserId,
      };
      return request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(401);
    });
  });

  describe('GET /tasks', () => {
    it('should get a list of tasks when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${userAuthToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      const foundTask = response.body.data.find((task: Task) => task.id === createdTaskId);
      expect(foundTask).toBeDefined();
    });

    it('admin should get a list of all tasks', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .send({
          title: 'Admin Task',
          description: 'Task by admin for admin',
          assignedTo: adminUser.id,
          status: TaskStatus.TODO, 
          priority: TaskPriority.MEDIUM,
          dueDate: new Date().toISOString() 
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2); 
    });
  });

  describe('GET /tasks/:id', () => {
    it('should get a specific task by ID when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${userAuthToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdTaskId);
      expect(response.body.title).toBe('E2E Test Task');
    });

    it('should return 404 for a non-existent task ID', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000'; 
      return request(app.getHttpServer())
        .get(`/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${userAuthToken}`)
        .expect(404);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a task when authenticated', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated E2E Test Task',
        status: TaskStatus.IN_PROGRESS,
      };

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${userAuthToken}`)
        .send(updateTaskDto)
        .expect(200);

      expect(response.body.title).toBe(updateTaskDto.title);
      expect(response.body.status).toBe(updateTaskDto.status);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task when authenticated as creator or admin', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${userAuthToken}`) 
        .expect(200); 

      await request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .set('Authorization', `Bearer ${userAuthToken}`)
        .expect(404);
    });

    it('should allow admin to delete a task they did not create', async () => {
      const taskByUserResponse = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${userAuthToken}`)
        .send({ 
          title: 'Admin Delete Test', 
          description: 'Task to be deleted by admin.', 
          assignedTo: user.id,
          status: TaskStatus.TODO,
          priority: TaskPriority.LOW,
          dueDate: new Date().toISOString()
        })
        .expect(201);

      const taskByUser = taskByUserResponse.body;

      await request(app.getHttpServer())
        .delete(`/tasks/${taskByUser.id}`)
        .set('Authorization', `Bearer ${adminAuthToken}`)
        .expect(200);
    });
  });
});

