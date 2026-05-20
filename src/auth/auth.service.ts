import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import axios from 'axios'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async loginGovBr(code: string) {
    const tokenResponse = await axios.post(
      'https://sso.staging.acesso.gov.br/token',
      {
        code
      }
    )

    const accessToken =
      tokenResponse.data.access_token

    const userInfo = await axios.get(
      'https://api.staging.account.gov.br/userinfo',
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`
        }
      }
    )

    const govUser = userInfo.data

    let user = await this.prisma.user.findUnique({
      where: {
        cpf: govUser.cpf
      }
    })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          govId: govUser.sub,
          cpf: govUser.cpf,
          name: govUser.name,
          email: govUser.email,
        }
      })
    }

    const payload = {
      sub: user.id,
      cpf: user.cpf
    }

    const jwt = this.jwtService.sign(payload)

    return {
      access_token: jwt,
      user
    }
  }
}