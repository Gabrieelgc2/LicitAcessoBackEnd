import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { OportunidadesController } from './oportunidades/oportunidades.controller';
import { EditaisController } from './editais/editais.controller';
import { ChecklistModule } from './checklist/checklist.module';
import { UserDocumentsModule } from './user-documents/user-documents.module';
import { AlertsModule } from './alerts/alerts.module';
import { ProposalsModule } from './proposals/proposals.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    PrismaModule,
    FirebaseModule,
    AuthModule,
    ChecklistModule,
    UserDocumentsModule,
    AlertsModule,
    ProposalsModule,
    FavoritesModule,
  ],
  controllers: [AppController, OportunidadesController, EditaisController],
  providers: [AppService],
})
export class AppModule {}
