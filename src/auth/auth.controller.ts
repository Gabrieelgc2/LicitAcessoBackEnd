import { Body, Controller, Post } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

import { AuthService } from './auth.service';

export class GoogleLoginDto {
  @IsNotEmpty({ message: 'idToken é obrigatório' })
  @IsString({ message: 'idToken deve ser uma string' })
  idToken!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google')
  loginGoogle(@Body() body: GoogleLoginDto) {
    console.log('[AuthController] /auth/google received idToken:', body.idToken)
    return this.authService.loginGoogle(body.idToken)
  }
}
