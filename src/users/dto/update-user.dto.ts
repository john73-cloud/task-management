import { IsEmail, IsString, IsOptional, MinLength, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/user-role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'updated.user@example.com', description: 'User\'s email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'UpdatedFirstName', description: 'User\'s first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'UpdatedLastName', description: 'User\'s last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'NewStrongPassword123!', description: 'User\'s new password (at least 8 characters)' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.USER, description: 'User\'s role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: true, description: 'Set user account active or inactive' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

