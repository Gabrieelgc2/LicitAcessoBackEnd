import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private firebaseService: FirebaseService,
  ) {}

  async loginFirebase(idToken: string) {
    try {
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(idToken)

      let user = await this.prisma.user.findUnique({
        where: {
          email: decodedToken.email,
        },
      });

      // 3. Se o usuário não existir, cria um novo
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            name: decodedToken.name || 'Usuário Google',
            email: decodedToken.email || '',
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
      console.error('[AuthService] Erro ao validar token Firebase:', error)
      throw new UnauthorizedException('Token inválido ou expirado')
    }
  }

  async loginWithCnpj(cnpj: string, senha: string) {
    const user = await this.prisma.user.findUnique({ where: { cnpj } })

    if (!user || !user.senhaHash) {
      throw new UnauthorizedException('CNPJ ou senha inválidos')
    }

    const senhaValida = await bcrypt.compare(senha, user.senhaHash)
    if (!senhaValida) {
      throw new UnauthorizedException('CNPJ ou senha inválidos')
    }

    const payload = { sub: user.id, email: user.email }
    const jwt = this.jwtService.sign(payload)

    return {
      access_token: jwt,
      user: { id: user.id, name: user.name, email: user.email, cnpj: user.cnpj }
    }
  }

  async registerWithCnpj(nomeEmpresa: string, cnpj: string, email: string, senha: string) {
    const cnpjExistente = await this.prisma.user.findUnique({ where: { cnpj } })
    if (cnpjExistente) {
      throw new ConflictException('CNPJ já cadastrado')
    }

    const emailExistente = await this.prisma.user.findUnique({ where: { email } })
    if (emailExistente) {
      throw new ConflictException('E-mail já cadastrado')
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const user = await this.prisma.user.create({
      data: { name: nomeEmpresa, email, cnpj, senhaHash }
    })

    const payload = { sub: user.id, email: user.email }
    const jwt = this.jwtService.sign(payload)

    return {
      access_token: jwt,
      user: { id: user.id, name: user.name, email: user.email, cnpj: user.cnpj }
    }
  }
}
