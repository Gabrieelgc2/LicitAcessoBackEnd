import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  constructor(private authService: AuthService) {}

  @Post('firebase')
  loginFirebase(@Body('idToken') idToken: string) {
    const maskedToken = idToken ? `${idToken.substring(0, 10)}...[masked]` : 'null';
    console.log('[AuthController] /auth/firebase received idToken:', maskedToken)
    return this.authService.loginFirebase(idToken)
  }

  @Post('cnpj/login')
  loginCnpj(@Body() body: { cnpj: string; senha: string }) {
    const cnpjDigits = body.cnpj?.replace(/\D/g, '')
    return this.authService.loginWithCnpj(cnpjDigits, body.senha)
  }

  @Post('cnpj/register')
  registerCnpj(
    @Body() body: { nomeEmpresa: string; cnpj: string; email: string; senha: string }
  ) {
    const cnpjDigits = body.cnpj?.replace(/\D/g, '')
    return this.authService.registerWithCnpj(body.nomeEmpresa, cnpjDigits, body.email, body.senha)
  }
}
