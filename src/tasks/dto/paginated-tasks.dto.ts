import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class PaginatedTasksDto {
  @ApiProperty({ type: () => [Task], description: 'Array of task objects for the current page' })
  data: Task[];

  @ApiProperty({ example: 100, description: 'Total number of tasks matching the query' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of tasks per page' })
  limit: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Indicates if there is a next page' })
  hasNextPage: boolean;

  @ApiProperty({ example: false, description: 'Indicates if there is a previous page' })
  hasPrevPage: boolean;
}

