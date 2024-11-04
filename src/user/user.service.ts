import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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

  async login(
    email: string,
    password: string,
  ): Promise<{ message: string; user: User }> {
    const knex = this.knexService.getKnex();

    const user = await knex('users').where({ email }).first();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      user,
    };
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
    originatorAccountNumber: number,
    beneficiaryAccountNumber: number,
    transferAmount: number,
  ): Promise<{ message: string; originator: User; beneficiary: User }> {
    const knex = this.knexService.getKnex();

    const originator = await knex('users')
      .where({ accountNumber: originatorAccountNumber })
      .first();
    const beneficiary = await knex('users')
      .where({ accountNumber: beneficiaryAccountNumber })
      .first();

    if (!originator) {
      throw new NotFoundException('Originator account not found');
    }

    if (!beneficiary) {
      throw new NotFoundException('Recipient account not found');
    }

    const amountToTransfer = Number(transferAmount);
    if (isNaN(amountToTransfer) || amountToTransfer <= 0) {
      throw new BadRequestException(
        'Transfer amount must be a valid positive number',
      );
    }

    const originatorCurrentAmount = Number(originator.amount) || 0;
    if (originatorCurrentAmount < amountToTransfer) {
      throw new BadRequestException('Insufficient funds');
    }

    const originatorNewAmount = parseFloat(
      (originatorCurrentAmount - amountToTransfer).toFixed(2),
    );
    const beneficiaryNewAmount = parseFloat(
      (Number(beneficiary.amount) + amountToTransfer).toFixed(2),
    );

    await knex.transaction(async (transaction) => {
      await transaction('users')
        .where({ accountNumber: originatorAccountNumber })
        .update({ amount: originatorNewAmount });

      await transaction('users')
        .where({ accountNumber: beneficiaryAccountNumber })
        .update({ amount: beneficiaryNewAmount });
    });

    const updatedoriginator = await knex('users')
      .where({ accountNumber: originatorAccountNumber })
      .first();
    const updatedBeneficiary = await knex('users')
      .where({ accountNumber: beneficiaryAccountNumber })
      .first();

    return {
      message: 'Transfer completed successfully',
      originator: updatedoriginator,
      beneficiary: updatedBeneficiary,
    };
  }

  async withdrawFunds(
    accountNumber: number,
    amount: number,
    pin: number,
  ): Promise<{ message: string; user: User }> {
    const knex = this.knexService.getKnex();

    if (!/^\d{4}$/.test(String(pin))) {
      throw new BadRequestException('PIN must be a 4-digit number');
    }

    const user = await knex('users').where({ accountNumber }).first();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const withdrawalAmount = Number(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      throw new BadRequestException(
        'Withdrawal amount must be a valid positive number',
      );
    }

    const currentAmount = Number(user.amount) || 0;
    if (currentAmount < withdrawalAmount) {
      throw new BadRequestException('Insufficient funds');
    }

    const newAmount = parseFloat((currentAmount - withdrawalAmount).toFixed(2));

    await knex('users').where({ accountNumber }).update({ amount: newAmount });

    const updatedUser = await knex('users').where({ accountNumber }).first();

    return {
      message: 'Withdrawal completed successfully',
      user: updatedUser,
    };
  }
}
