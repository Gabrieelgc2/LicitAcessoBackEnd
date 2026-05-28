import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'

import { PrismaService } from '../prisma/prisma.service'
import { FirebaseService } from '../firebase/firebase.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private firebaseService: FirebaseService
  ) {}

  async loginFirebase(idToken: string) {
    try {
      // 1. Valida o token com o Firebase Admin SDK
      const decodedToken = await this.firebaseService.getAuth().verifyIdToken(idToken);

      // 2. Busca o usuário no banco pelo e-mail
      let user = await this.prisma.user.findUnique({
        where: {
          email: decodedToken.email
        }
      });

      // 3. Se o usuário não existir, cria um novo
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            name: decodedToken.name || 'Usuário Google',
            email: decodedToken.email || '',
          }
        });
      }

      // 4. Gera o payload para o seu JWT interno
      const payload = {
        sub: user.id,
        email: user.email
      };

      // 5. Assina o JWT e retorna para o front-end
      const jwt = this.jwtService.sign(payload);

      return {
        access_token: jwt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      };
    } catch (error) {
      console.error('[AuthService] Erro ao validar token:', error);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
