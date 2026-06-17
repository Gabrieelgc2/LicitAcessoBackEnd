import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://licitacessobackend.onrender.com',
      ]

  app.enableCors({
    origin: (origin, callback) => {
      // Permite curl, Postman, webhooks e outros backends
      if (!origin) {
        return callback(null, true)
      }

      // Em produção só permite origens cadastradas
      if (process.env.NODE_ENV === 'production') {
        const isAllowed = allowedOrigins.some(
          (allowed) => allowed.trim() === origin,
        )

        if (isAllowed) {
          return callback(null, true)
        }

        return callback(
          new Error(
            'Bloqueado pelas políticas de CORS restritas de produção.',
          ),
          false,
        )
      }

      // Em desenvolvimento permite qualquer origem
      return callback(null, true)
    },
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const port = parseInt(process.env.PORT || '3000', 10)

  await app.listen(port)

  console.log(`Application is running on port ${port}`)
}

void bootstrap()