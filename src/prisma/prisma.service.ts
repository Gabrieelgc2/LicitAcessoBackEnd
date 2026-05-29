import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit
{
  async onModuleInit() {
    try {
      await this.$connect()
    } catch (err) {
      console.warn('[PrismaService] Banco PostgreSQL indisponível — rotas de auth não funcionarão.', err)
    }
  }
}