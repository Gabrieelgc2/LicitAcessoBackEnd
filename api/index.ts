import { createServer } from 'http'

import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'

import express from 'express';

import { AppModule } from '../src/app.module';

const expressApp = express();

let isInitialized = false

async function bootstrap() {
  if (isInitialized) {
    return
  }

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp)
  )

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : true

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  })

  await app.init()

  isInitialized = true
}

export default async function handler(
  req: any,
  res: any
) {
  await bootstrap()

  return createServer(expressApp)
    .emit('request', req, res)
}