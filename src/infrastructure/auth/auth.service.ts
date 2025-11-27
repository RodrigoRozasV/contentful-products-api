import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(username: string) {
    const payload = { username, sub: '1' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Simple method to generate a token for testing
  async login(username: string) {
    return this.generateToken(username);
  }
}
