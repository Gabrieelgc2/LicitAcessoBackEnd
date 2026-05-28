import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);

  onModuleInit() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    console.log('FIREBASE_PROJECT_ID:', projectId);
    console.log('FIREBASE_CLIENT_EMAIL:', clientEmail);
    console.log('FIREBASE_PRIVATE_KEY exists:', !!privateKey);

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn('Credenciais do Firebase ausentes. Firebase não será inicializado.');
      return;
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
  }

  getAuth(): any {
    return admin.auth();
  }
}
