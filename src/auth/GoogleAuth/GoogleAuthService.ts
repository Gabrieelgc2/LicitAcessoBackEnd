import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;
  private googleClientId: string;

  constructor(private configService: ConfigService) {
    this.googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID') || '';
    
    // Inicializa o cliente oficial do Google
    this.client = new OAuth2Client(this.googleClientId);
  }

  async verifyToken(idToken: string) {
    try {
      // Valida a assinatura digital e se o token pertence ao seu app (audience)
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.googleClientId,
      });
      
      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Token inválido');
      
      // Retorna apenas os dados limpos que nos interessam
      return {
        email: payload.email,
        name: payload.name,
      };
    } catch (error) {
      throw new UnauthorizedException('Falha ao validar token com o Google');
    }
  }
}