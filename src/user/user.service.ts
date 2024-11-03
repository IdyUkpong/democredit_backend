import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { KnexService } from '../knex/knex.service';
import { User } from '../model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly knexService: KnexService) {}

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const knex = this.knexService.getKnex();

    const existingUser = await knex('users')
      .where({ email: userData.email })
      .orWhere({ accountNumber: userData.accountNumber })
      .first();

    if (existingUser) {
      throw new ConflictException(
        'A user with the provided email or account number already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUserData = {
      ...userData,
      password: hashedPassword,
      amount: userData.amount ?? 0,
      bvn:userData.bvn
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
      throw new NotFoundException('User not found');
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
