import { Body, Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('govbr/callback')
  async govBrCallback(
    @Body('code') code: string
  ) {
    return this.authService.loginGovBr(code)
  }
}