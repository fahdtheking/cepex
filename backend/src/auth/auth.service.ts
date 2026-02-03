import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles.enum';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  signToken(params: { userId: string; role: Role }) {
    return this.jwtService.sign({ sub: params.userId, role: params.role });
  }
}
