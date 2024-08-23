import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get("me")
  @UseGuards(AuthGuard)
  getMe(@Req() req: any) {
    return this.usersService.getMe(req);
  }
}
