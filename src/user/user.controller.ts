import { Controller, Post, Body } from '@nestjs/common';
import { KnexService } from '../knex/knex.service';
import { UserService } from './user.service';
import { User } from 'src/model/user.model';


@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService, 
    private readonly knexService: KnexService
  ) {}

  @Post()
async createUser(@Body() userData: User) {
  const user = await this.userService.createUser(userData);
  return { message: 'User created successfully', user }; 
}


  @Post('fund')
  async fundAccount(@Body() body: { accountNumber: number; amount: number }) {
    const { accountNumber, amount } = body;
    return await this.userService.fundAccount(accountNumber, amount);
}
}


