import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

let appInitialized = false

async function createNestApp() {
  if (appInitialized) {
    return  // Se já foi inicializado, não inicializa novamente
  }

  const app = await NestFactory.create(
    AppModule,
  )

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173', 'https://licitacessobackend.onrender.com']

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requisições sem origem (como Webhooks, curl, Postman, Outro Back-End, etc.)
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
  console.log(`Application is running on: http://localhost:${port}`)
}


if (require.main === module) {
  void bootstrapLocal()
}
