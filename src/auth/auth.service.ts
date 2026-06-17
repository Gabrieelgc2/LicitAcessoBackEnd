import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleAuthService } from './GoogleAuth/GoogleAuthService'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private googleAuthService: GoogleAuthService,
  ) {}

async loginGoogle(idToken: string) {
    try{
    const googleUser = await this.googleAuthService.verifyToken(idToken)
    let user = await this.prisma.user.findUnique({ where: { email: googleUser.email }
     })

      // 3. Se o usuário não existir, cria um novo
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            name: googleUser.name || 'Usuário Google',
            email: googleUser.email || '',
          },
        })
      }

      const payload = { sub: user.id, email: user.email }
      const jwt = this.jwtService.sign(payload)

      return {
        access_token: jwt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('[AuthService] Erro no fluxo de login do Google:', error)
      throw new UnauthorizedException('Token inválido ou expirado')
    }
  }
}
