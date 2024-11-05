import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return a token and user on successful login', async () => {
    const loginDto = { email: 'test@example.com', password: 'password' };
    mockAuthService.login.mockResolvedValue({ message: 'Login successful', token: 'someToken', user: { email: 'test@example.com' } });

    const result = await authController.login(loginDto);
    expect(result).toEqual({ message: 'Login successful', token: 'someToken', user: { email: 'test@example.com' } });
  });

  it('should throw an UnauthorizedException on invalid credentials', async () => {
    const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
    mockAuthService.login.mockRejectedValue(new UnauthorizedException());

    await expect(authController.login(loginDto))
      .rejects
      .toThrow(UnauthorizedException);
  });
});
