import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskPriority } from '../../common/enums/task-priority.enum';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tasks')
export class Task {
  @ApiProperty({ description: 'Unique identifier for the task', example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the task', example: 'Implement API documentation' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Detailed description of the task', example: 'Use Swagger to document all API endpoints.' })
  @Column('text')
  description: string;

  @ApiProperty({ description: 'ID of the user to whom the task is assigned', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', format: 'uuid' })
  @Column('uuid')
  assignedTo: string;

  @ApiProperty({ description: 'ID of the user who created the task', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', format: 'uuid' })
  @Column('uuid')
  createdBy: string;

  @ApiProperty({ enum: TaskStatus, description: 'Current status of the task', example: TaskStatus.IN_PROGRESS })
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority, description: 'Priority level of the task', example: TaskPriority.HIGH })
  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @ApiProperty({ description: 'Due date for the task', type: 'string', format: 'date-time', example: '2023-12-31T23:59:59Z', required: false })
  @Column({ nullable: true })
  dueDate: Date;

  @ApiProperty({ description: 'Date and time when the task was completed', type: 'string', format: 'date-time', example: '2023-12-30T10:00:00Z', required: false })
  @Column({ nullable: true })
  completedAt: Date;

  @ApiProperty({ description: 'Date and time when the task was created', type: 'string', format: 'date-time', example: '2023-12-01T09:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the task was last updated', type: 'string', format: 'date-time', example: '2023-12-15T14:30:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => User, description: 'User object to whom the task is assigned', required: false })
  @ManyToOne(() => User, user => user.assignedTasks)
  @JoinColumn({ name: 'assignedTo' })
  assignedToUser: User;

  @ApiProperty({ type: () => User, description: 'User object who created the task', required: false })
  @ManyToOne(() => User, user => user.createdTasks)
  @JoinColumn({ name: 'createdBy' })
  createdByUser: User;
}

