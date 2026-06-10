import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'

import serverlessExpress from '@codegenie/serverless-express'
import express from 'express'

import { AppModule } from './app.module'

const expressApp = express()
let server: any
let appInitialized = false

async function createNestApp() {
  if (appInitialized) {
    return
  }

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp)
  )

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173', 'https://licitacessobackend.onrender.com']

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requisições sem origem (como apps mobile, curl ou requests server-to-server)
      if (!origin) return callback(null, true)

      if (process.env.NODE_ENV === 'production') {
        const isAllowed = allowedOrigins.some((allowed) => allowed.trim() === origin)
        if (isAllowed) {
          callback(null, true)
        } else {
          callback(new Error('Bloqueado pelas políticas de CORS restritas de produção.'))
        }
      } else {
        // Modo flexível em desenvolvimento
        callback(null, true)
      }
    },
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos que não possuem decoradores na DTO
      forbidNonWhitelisted: true, // Lança erro se houver campos não permitidos
      transform: true, // Converte tipos automaticamente com base na DTO
    })
  )

  await app.init()
  appInitialized = true
}

async function bootstrapLocal() {
  await createNestApp()
  const port = parseInt(process.env.PORT || '3000', 10)
  await expressApp.listen(port)
  console.log(`Application is running on: http://localhost:${port}`)
}

async function getServerlessHandler() {
  await createNestApp()
  server = server ?? serverlessExpress({ app: expressApp })
  return server
}

if (require.main === module) {
  void bootstrapLocal()
}

export default async function handler(req: any, res: any) {
  const srv = await getServerlessHandler()
  return srv(req, res)
}
