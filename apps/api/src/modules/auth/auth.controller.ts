import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type {
  AuthLoginDto,
  AuthRegisterDto,
  AuthenticatedUserDto,
} from '@monorepo-shop/shared';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: AuthLoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUserDto | undefined) {
    // Guard đã đảm bảo có user
    return this.authService.me(user!.id);
  }
}
