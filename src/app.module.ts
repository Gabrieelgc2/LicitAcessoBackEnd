import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { OportunidadesController } from './oportunidades/oportunidades.controller';
import { EditaisController } from './editais/editais.controller';
import { ChecklistModule } from './checklist/checklist.module';
import { UserDocumentsModule } from './user-documents/user-documents.module';
import { AlertsModule } from './alerts/alerts.module';
import { ProposalsModule } from './proposals/proposals.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ChecklistModule,
    UserDocumentsModule,
    AlertsModule,
    ProposalsModule,
    FavoritesModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  controllers: [AppController, OportunidadesController, EditaisController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
