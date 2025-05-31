import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Task } from './src/tasks/entities/task.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Task],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
};

export const AppDataSource = new DataSource(AppDataSourceOptions);

