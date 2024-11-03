import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      bvn: userData.bvn,
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

  async transferFunds(
    senderAccountNumber: number,
    recipientAccountNumber: number,
    transferAmount: number,
  ): Promise<{ message: string; sender: User; recipient: User }> {
    const knex = this.knexService.getKnex();

    const sender = await knex('users')
      .where({ accountNumber: senderAccountNumber })
      .first();
    const recipient = await knex('users')
      .where({ accountNumber: recipientAccountNumber })
      .first();

    if (!sender) {
      throw new NotFoundException('Sender account not found');
    }

    if (!recipient) {
      throw new NotFoundException('Recipient account not found');
    }

    const amountToTransfer = Number(transferAmount);
    if (isNaN(amountToTransfer) || amountToTransfer <= 0) {
      throw new BadRequestException(
        'Transfer amount must be a valid positive number',
      );
    }

    const senderCurrentAmount = Number(sender.amount) || 0;
    if (senderCurrentAmount < amountToTransfer) {
      throw new BadRequestException('Insufficient funds');
    }

    const senderNewAmount = parseFloat(
      (senderCurrentAmount - amountToTransfer).toFixed(2),
    );
    const recipientNewAmount = parseFloat(
      (Number(recipient.amount) + amountToTransfer).toFixed(2),
    );

    await knex.transaction(async (trx) => {
      await trx('users')
        .where({ accountNumber: senderAccountNumber })
        .update({ amount: senderNewAmount });

      await trx('users')
        .where({ accountNumber: recipientAccountNumber })
        .update({ amount: recipientNewAmount });
    });

    const updatedSender = await knex('users')
      .where({ accountNumber: senderAccountNumber })
      .first();
    const updatedRecipient = await knex('users')
      .where({ accountNumber: recipientAccountNumber })
      .first();

    return {
      message: 'Transfer completed successfully',
      sender: updatedSender,
      recipient: updatedRecipient,
    };
  }
}
