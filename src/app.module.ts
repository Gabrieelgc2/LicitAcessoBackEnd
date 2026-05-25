import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { OportunidadesController } from './oportunidades/oportunidades.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [AppController, OportunidadesController],
  providers: [AppService],
})
export class AppModule {}
