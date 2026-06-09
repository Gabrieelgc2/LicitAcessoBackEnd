import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class SecurityLogExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('SecurityLog');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // 1. Captura o ID do usuário (vindo do Google Auth/Passport guard) se existir
    const userId = (request as any).user?.id || 'ANONYMOUS';

    // 2. Cria o payload original de erro
    const rawBody = request.body ? JSON.stringify(request.body) : '{}';

    // 3. Aplica a máscara em dados sensíveis usando Expressões Regulares (Regex)
    const maskedBody = this.maskSensitiveData(rawBody);

    // 4. Formata o Log mascarado para o console (Exatamente como pede o documento)
    this.logger.error(
      `[Erro ${status}] Falha na requisição na rota ${request.url}. Usuário ID: ${userId}. Payload: ${maskedBody}`
    );

    // 5. Envia a resposta limpa para o cliente (sem expor detalhes internos do banco ou NestJS)
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof HttpException ? exception.message : 'Erro interno no servidor.',
    });
  }

  // Função auxiliar com Regex para encontrar e ofuscar e-mails e CPFs
  private maskSensitiveData(jsonString: string): string {
    try {
      // Máscara para e-mails (ex: joao.silva@email.com -> j***@email.com)
      let masked = jsonString.replace(
        /"email"\s*:\s*"([^"]+)"/g,
        (match, email) => {
          const [name, domain] = email.split('@');
          return `"email": "${name[0]}***@${domain}"`;
        }
      );

      // Máscara para CPFs (caso capture algum em formato string ou número em requests futuras)
      masked = masked.replace(
        /"cpf"\s*:\s*"(\d{3})\d{6}(\d{2})"/g,
        `"cpf": "$1.***.***-$2"`
      );

      return masked;
    } catch {
      return '[Erro ao processar payload para log]';
    }
  }
}