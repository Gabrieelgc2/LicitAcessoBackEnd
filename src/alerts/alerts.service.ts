import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

export class CreateAlertDto {
  @IsNotEmpty({ message: 'type é obrigatório' })
  @IsString({ message: 'type deve ser uma string' })
  type!: string;

  @IsNotEmpty({ message: 'title é obrigatório' })
  @IsString({ message: 'title deve ser uma string' })
  title!: string;

  @IsNotEmpty({ message: 'description é obrigatório' })
  @IsString({ message: 'description deve ser uma string' })
  description!: string;

  @IsOptional()
  @IsString({ message: 'dateTime deve ser uma string' })
  dateTime?: string;
}

const DEFAULT_ALERTS = [
  {
    type: 'novo_edital',
    title: 'Novo edital disponível',
    description: 'Edital de limpeza urbana — Prefeitura de São Paulo publicou nova licitação',
    dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    type: 'prazo_proximo',
    title: 'Prazo se aproximando',
    description: 'Inscrição para edital de TI do Ministério da Saúde encerra em 2 dias',
    dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    type: 'resultado',
    title: 'Resultado publicado',
    description: 'Você foi classificado na fase 2 da licitação de Serviços de TI #2024-001',
    dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    type: 'atualizacao',
    title: 'Edital atualizado',
    description: 'Critérios e documentação do edital de consultoria foram revisados',
    dateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
];

const DEFAULT_DEADLINES = [
  {
    title: 'Inscrição — Limpeza Urbana SP',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    description: 'Prazo final para envio de propostas',
  },
  {
    title: 'Entrega de Documentos — TI Gov',
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    description: 'Documentação técnica e certidões',
  },
  {
    title: 'Resultado Fase 1 — Consultoria',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    description: 'Publicação dos classificados na fase habilitatória',
  },
];

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async getAlerts(userId: string) {
    const existing = await this.prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (existing.length > 0) return existing;

    await this.prisma.alert.createMany({
      data: DEFAULT_ALERTS.map(a => ({ ...a, userId })),
    });

    return this.prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(userId: string, alertId: string) {
    const alert = await this.prisma.alert.findUnique({ where: { id: alertId } });
    if (!alert) throw new NotFoundException('Alerta não encontrado');
    if (alert.userId !== userId) throw new ForbiddenException();

    return this.prisma.alert.update({
      where: { id: alertId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.alert.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  }

  async createAlert(userId: string, dto: CreateAlertDto) {
    return this.prisma.alert.create({
      data: {
        userId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        dateTime: dto.dateTime ?? new Date().toISOString(),
        isRead: false,
      },
    });
  }

  async getDeadlines(userId: string) {
    const existing = await this.prisma.deadline.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    if (existing.length > 0) return existing;

    await this.prisma.deadline.createMany({
      data: DEFAULT_DEADLINES.map(d => ({ ...d, userId })),
    });

    return this.prisma.deadline.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }
}
