import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS para o seu colega do Front-end conseguir acessar
  app.enableCors();

  // O Render fornece a porta automaticamente através da variável process.env.PORT
  const port = process.env.PORT || 3000;
  
  await app.listen(port, '0.0.0.0'); // O '0.0.0.0' é essencial para o Render conseguir mapear a porta
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
