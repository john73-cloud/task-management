import { IsOptional, IsEnum, IsUUID, IsDateString, IsString } from 'class-validator';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskPriority } from '../../common/enums/task-priority.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'New title for the task', example: 'Refactor user module' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Updated detailed description for the task', example: 'Improve performance and readability.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'New ID of the user to whom the task is assigned', example: 'c3ffbc00-9c0b-4ef8-bb6d-6bb9bd380b33', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiPropertyOptional({ enum: TaskStatus, description: 'Updated status of the task', example: TaskStatus.COMPLETED })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, description: 'Updated priority of the task', example: TaskPriority.LOW })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: 'Updated due date for the task', type: 'string', format: 'date-time', example: '2024-02-28T18:00:00Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Date and time when the task was completed', type: 'string', format: 'date-time', example: '2024-02-27T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}

