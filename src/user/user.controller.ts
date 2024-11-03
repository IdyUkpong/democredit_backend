import { Controller, Post, Body } from '@nestjs/common';
import { KnexService } from '../knex/knex.service';
import { UserService } from './user.service';
import { User } from 'src/model/user.model';


@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService, // Use UserService here
    private readonly knexService: KnexService
  ) {}

  @Post()
  async createUser(@Body() userData: User) {
    const user = await this.userService.createUser(userData);
    return { message: 'User created successfully', user }; 
  }
}


