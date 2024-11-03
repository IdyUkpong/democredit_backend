import { Injectable } from '@nestjs/common';
import { KnexService } from '../knex/knex.service';
import { User } from '../model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly knexService: KnexService) {}

  async createUser(userData: User): Promise<User & { id: number }> {
    const knex = this.knexService.getKnex();

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUserData = {
      ...userData,
      password: hashedPassword,
      amount: userData.amount ?? 0,
    };

    const [userId] = await knex('users').insert(newUserData);
    return { ...newUserData, id: userId };
  }

  async fundAccount(
    accountNumber: number,
    amount: number,
  ): Promise<{ message: string; user: User }> {
    const knex = this.knexService.getKnex();

    const user = await knex('users').where({ accountNumber }).first();

    if (!user) {
      throw new Error('User not found');
    }

    const currentAmount = Number(user.amount) || 0;

    const newAmount = currentAmount + Number(amount);

    const formattedAmount = parseFloat(newAmount.toFixed(2));

    await knex('users')
      .where({ accountNumber })
      .update({ amount: formattedAmount });

    const updatedUser = await knex('users').where({ accountNumber }).first();

    return { message: 'Account funded successfully', user: updatedUser };
  }
}
