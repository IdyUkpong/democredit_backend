import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { KnexService } from '../knex/knex.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { User } from 'src/model/user.model';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    createUser: jest.fn(),
    fundAccount: jest.fn(),
    transferFunds: jest.fn(),
    withdrawFunds: jest.fn(),
  };

  const mockUser = {
    id: 1,
    name: 'Idongesit Ukpong',
    email: 'idongesit@example.com',
    password: 'password123',
    accountNumber: 123456,
    bvn: '12345678901',
  };
  
  const mockKnexService = {};

  describe('fund', () => {
    it('should fund an account and return success message', async () => {
      const accountNumber = 1234567890;
      const amount = 1000;
      const result = { message: 'Account funded successfully', user: mockUser }; 
      mockUserService.fundAccount.mockResolvedValue(result);
  
      expect(await userController.fundAccount({ accountNumber, amount })).toEqual(result);
      expect(mockUserService.fundAccount).toHaveBeenCalledWith(accountNumber, amount);
    });
  });
  
  describe('transfer', () => {
    it('should transfer funds and return success message', async () => {
      const originatorAccountNumber = 1234567890;
      const beneficiaryAccountNumber = 9876543210;
      const transferAmount = 500;
      const result = { 
        message: 'Transfer successful', 
        originator: mockUser, 
        beneficiary: mockUser  
      };
      mockUserService.transferFunds.mockResolvedValue(result);
  
      expect(await userController.transferFunds(originatorAccountNumber, beneficiaryAccountNumber, transferAmount)).toEqual(result);
      expect(mockUserService.transferFunds).toHaveBeenCalledWith(originatorAccountNumber, beneficiaryAccountNumber, transferAmount);
    });
  });
  
  describe('withdraw', () => {
    it('should withdraw funds and return success message', async () => {
      const accountNumber = 1234567890;
      const amount = 500;
      const pin = 1234;
      const result = { message: 'Withdrawal successful', user: mockUser }; 
      mockUserService.withdrawFunds.mockResolvedValue(result);
  
      expect(await userController.withdrawFunds(accountNumber, amount, pin)).toEqual(result);
      expect(mockUserService.withdrawFunds).toHaveBeenCalledWith(accountNumber, amount, pin);
    });
  });
}
)