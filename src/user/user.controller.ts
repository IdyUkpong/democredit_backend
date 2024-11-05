import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { KnexService } from '../knex/knex.service';
import { UserService } from './user.service';
import { User } from 'src/model/user.model';
import { JwtAuthGuard } from 'src/auth/jwt.guard';


@Controller('users')
@UseGuards(JwtAuthGuard)
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


// @Post('login')
// async loginUser(@Body() loginData: LoginDto) {
//   const user = await this.userService.login(loginData.email, loginData.password);
//   return { message: 'Login successful', user }; 
// }

  @Post('fund')
  async fundAccount(@Body() body: { accountNumber: number; amount: number }) {
    const { accountNumber, amount } = body;
    return await this.userService.fundAccount(accountNumber, amount);
}

@Post('transfer')
  async transferFunds(
    @Body('originatorAccountNumber') originatorAccountNumber: number,
    @Body('beneficiaryAccountNumber') beneficiaryAccountNumber: number,
    @Body('transferAmount') transferAmount: number
  ): Promise<{ message: string; originator: User; beneficiary: User }> {
    return this.userService.transferFunds(originatorAccountNumber, beneficiaryAccountNumber, transferAmount);
  }

  @Post('withdraw')
  async withdrawFunds(
    @Body('accountNumber') accountNumber: number,
    @Body('amount') amount: number,
    @Body('pin') pin: number
  ): Promise<{ message: string; user: User }> {
    return this.userService.withdrawFunds(accountNumber, amount, pin);
  }
  

}


