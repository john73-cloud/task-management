import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { Task } from '../../tasks/entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier for the user', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User\'s email address', example: 'user@example.com', uniqueItems: true })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'User\'s first name', example: 'John' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'User\'s last name', example: 'Doe' })
  @Column()
  lastName: string;

  @ApiProperty({ enum: UserRole, description: 'Role of the user', example: UserRole.USER })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column()
  password: string;

  @ApiProperty({ description: 'Indicates if the user account is active', example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Date and time when the user was created', type: 'string', format: 'date-time', example: '2023-01-01T12:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the user was last updated', type: 'string', format: 'date-time', example: '2023-01-02T14:30:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => [Task], required: false, description: 'List of tasks assigned to this user' })
  @OneToMany(() => Task, task => task.assignedToUser)
  assignedTasks: Task[];

  @ApiProperty({ type: () => [Task], required: false, description: 'List of tasks created by this user' })
  @OneToMany(() => Task, task => task.createdByUser)
  createdTasks: Task[];
}

