import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, createdBy: string): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      createdBy,
    });

    return this.tasksRepository.save(task);
  }

  async findAll(user: User, page = 1, limit = 10, status?: string, priority?: string) {
    const queryBuilder = this.tasksRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedToUser', 'assignedUser')
      .leftJoinAndSelect('task.createdByUser', 'createdUser');

    if (user.role !== UserRole.ADMIN) {
      queryBuilder.where('task.assignedTo = :userId OR task.createdBy = :userId', {
        userId: user.id,
      });
    }

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('task.priority = :priority', { priority });
    }

    const [tasks, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedToUser', 'createdByUser'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (user.role !== UserRole.ADMIN && 
        task.assignedTo !== user.id && 
        task.createdBy !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    
    Object.assign(task, updateTaskDto);
    
    if (updateTaskDto.status === 'COMPLETED' && !task.completedAt) {
      task.completedAt = new Date();
    }

    return this.tasksRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.findOne(id, user);
    
    if (user.role !== UserRole.ADMIN && task.createdBy !== user.id) {
      throw new ForbiddenException('Only task creators or admins can delete tasks');
    }

    await this.tasksRepository.remove(task);
  }
}

