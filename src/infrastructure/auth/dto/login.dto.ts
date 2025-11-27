import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication',
    example: 'testuser',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}