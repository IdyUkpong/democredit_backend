import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/model/user.model';
import { LoginDto } from 'src/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}


  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ message: string; token: string; user: User }> {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }



// @Post('login')
// async login(@Body() { email, password }: { email: string; password: string }) {
//   const user = await this.userService.findUserByEmail(email);
//   if (!user) {
//     throw new BadRequestException('Invalid email or password');
//   }

//   const passwordValid = await bcrypt.compare(password, user.password);
//   if (!passwordValid) {
//     throw new BadRequestException('Invalid email or password');
//   }

//   const token = await this.authService.generateToken(user);

//   return { message: 'Login successful', user,
//   token
// };
// }

}