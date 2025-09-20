import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  // 구글 로그인 시작
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  // 구글 로그인 콜백
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req) {
    const { access_token, ...user } = req.user;

    return {
      message: 'Login success',
      token: access_token,
      user,
    };
  }
}
