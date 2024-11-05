import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/user.model';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { KnexService } from '../knex/knex.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private knexService: KnexService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ message: string; token: string; user: User }> {
    const knex = this.knexService.getKnex();

    const user = await knex('users').where({ email }).first();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return {
      message: 'Login successful',
      token,
      user,
    };
  }
}
