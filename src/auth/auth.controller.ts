import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google')
  loginGoogle(@Body('idToken') idToken: string) {
    console.log('[AuthController] /auth/google received idToken:', idToken)
    return this.authService.loginGoogle(idToken)
}
}
