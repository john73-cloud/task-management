import { IsNotEmpty, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskPriority } from '../../common/enums/task-priority.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task', example: 'Develop new feature' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Detailed description of the task', example: 'Implement user authentication module.' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'ID of the user to whom the task is assigned', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', format: 'uuid' })
  @IsUUID()
  assignedTo: string;

  @ApiPropertyOptional({ enum: TaskStatus, description: 'Initial status of the task (defaults to TODO if not provided)', example: TaskStatus.TODO, required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, description: 'Priority of the task (defaults to MEDIUM if not provided)', example: TaskPriority.MEDIUM, required: false })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: 'Due date for the task', type: 'string', format: 'date-time', example: '2024-01-15T18:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

