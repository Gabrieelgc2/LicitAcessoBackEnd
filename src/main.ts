import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'

import serverlessExpress
  from '@codegenie/serverless-express'

import express from 'express'

import { AppModule }
  from '../src/app.module'

const app = express()

async function bootstrap() {
  const nestApp =
    await NestFactory.create(
      AppModule,
      new ExpressAdapter(app)
    )

  nestApp.enableCors()

  await nestApp.init()

  return serverlessExpress({
    app
  })
}

let server: any

export default async function handler(
  req: any,
  res: any
) {
  server =
    server ?? (await bootstrap())

  return server(req, res)
}