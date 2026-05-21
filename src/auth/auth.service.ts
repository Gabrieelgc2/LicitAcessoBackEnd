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
      const decodedToken =
        await this.firebaseService
          .getAuth()
          .verifyIdToken(idToken)

      let user =
        await this.prisma.user.findUnique({
          where: {
            email: decodedToken.email
          }
        })

      if (!user) {
        user =
          await this.prisma.user.create({
            data: {
              govId: decodedToken.uid,
              cpf: '',
              name:
                decodedToken.name || '',
              email:
                decodedToken.email || ''
            }
          })
      }

      const payload = {
        sub: user.id,
        email: user.email
      }

      const jwt =
        this.jwtService.sign(payload)

      return {
        access_token: jwt,
        user
      }
    } catch {
      throw new UnauthorizedException(
        'Token inválido'
      )
    }
  }
}