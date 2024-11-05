import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/user.model';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { KnexService } from '../knex/knex.service';


@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,
    private knexService:KnexService) {}

//   async generateToken(user: any) {
//     const payload = { id: user.id, email: user.email};
//     try {
//       return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });

//     } catch (error) {
//       throw new Error('Token generation failed');
//     }
//   }
  
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

    // Generate a token
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: '1h' } // Token expiry (adjust as needed)
    );

    return {
      message: 'Login successful',
      token,
      user,
    };
  }
}
