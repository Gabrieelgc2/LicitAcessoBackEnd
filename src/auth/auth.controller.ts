import { Body, Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

 @Post('firebase')
loginFirebase(
  @Body('idToken')
  idToken: string
) {
  return this.authService
    .loginFirebase(idToken)
}
}