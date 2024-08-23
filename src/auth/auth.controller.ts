import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from 'src/dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post("register")
  register(@Body() dto: SignUpDTO) {
    return this.authService.register(dto);
  }

  @Post("login")
  login(@Body() dto: SignInDTO, @Res() res: Response) {
    return this.authService.login(dto, res)
  }
}
