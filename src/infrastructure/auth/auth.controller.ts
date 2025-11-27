import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Generate JWT token for testing',
    description: 'Creates a JWT token that can be used to access protected endpoints',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns JWT access token',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username || 'testuser');
  }
}
