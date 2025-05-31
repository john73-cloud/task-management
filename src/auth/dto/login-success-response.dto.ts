import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/user-role.enum';

class LoginUserResponseDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', format: 'uuid', description: "User's unique ID" })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: "User's email address" })
  email: string;

  @ApiProperty({ example: 'John', description: "User's first name" })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: "User's last name" })
  lastName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER, description: "User's role" })
  role: UserRole;
}

export class LoginSuccessResponseDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QudGFzay51c2VyQGV4YW1wbGUuY29tIiwic3ViIjoiZWM3YTUzMDktZDM5ZS00NzJkLWFjNDMtYjQ3YTVkMzBhMTE0Iiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MTcyMDc3NjUsImV4cCI6MTcxNzIxMTM2NX0.abc123xyz', 
    description: 'JWT Access Token for subsequent authenticated requests'
  })
  access_token: string;

  @ApiProperty({ type: LoginUserResponseDto, description: 'Details of the authenticated user' })
  user: LoginUserResponseDto;
}

