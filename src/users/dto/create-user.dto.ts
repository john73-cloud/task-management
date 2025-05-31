import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'new.user@example.com', description: 'User\'s email address (must be unique)' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', description: 'User\'s first name' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User\'s last name' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'SecureP@ss123', description: 'User\'s password (at least 6 characters, as per @MinLength(6))' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER, description: 'User\'s role (defaults to USER if not provided)', required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

