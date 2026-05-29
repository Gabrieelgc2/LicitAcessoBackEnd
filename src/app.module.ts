import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { OportunidadesController } from './oportunidades/oportunidades.controller';
import { EditaisController } from './editais/editais.controller';

@Module({
  imports: [
    PrismaModule,
    FirebaseModule,
    AuthModule,
  ],
  controllers: [AppController, OportunidadesController, EditaisController],
  providers: [AppService],
})
export class AppModule {}
