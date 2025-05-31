import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Task } from './entities/task.entity';
import { PaginatedTasksDto } from './dto/paginated-tasks.dto';
import { TaskStatus } from '../common/enums/task-status.enum';
import { TaskPriority } from '../common/enums/task-priority.enum';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Task created successfully.', type: Task })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request - Validation error.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks (paginated and filterable)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page (default: 10)' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus, description: 'Filter tasks by status' })
  @ApiQuery({ name: 'priority', required: false, enum: TaskPriority, description: 'Filter tasks by priority' })
  @ApiResponse({ status: HttpStatus.OK, description: 'A paginated list of tasks.', type: PaginatedTasksDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  findAll(
    @CurrentUser() user: User,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.tasksService.findAll(
      user,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      status,
      priority,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Task ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Task details.', type: Task })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - User cannot access this task.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Task ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Task updated successfully.', type: Task })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request - Validation error.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - User cannot update this task.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskDto: UpdateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Task ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Task deleted successfully.' }) // Or HttpStatus.NO_CONTENT if nothing is returned
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - User cannot delete this task.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.tasksService.remove(id, user);
  }
}

