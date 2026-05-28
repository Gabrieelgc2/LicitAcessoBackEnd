import { createServer } from 'http'

import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'

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

  app.enableCors()

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