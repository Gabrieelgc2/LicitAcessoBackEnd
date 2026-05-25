import 'dotenv/config'
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

  app.enableCors()
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
