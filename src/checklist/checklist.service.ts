import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_DOCS = [
  {
    docType: 'CCMEI',
    title: 'CCMEI',
    description: 'Certificado de Condição de Microempreendedor Individual',
    status: 'pending',
  },
  {
    docType: 'RG_CPF',
    title: 'RG / CPF Sócios',
    description: 'Digitalização colorida dos documentos de identidade',
    status: 'pending',
  },
  {
    docType: 'CND_UNIAO',
    title: 'Certidão Negativa (União)',
    description: 'Prova de regularidade fiscal perante a Fazenda Nacional',
    status: 'pending',
    actionUrl: 'https://gov.br',
  },
  {
    docType: 'CND_MUNICIPAL',
    title: 'Certidão Municipal',
    description: 'Necessário para este edital',
    status: 'pending',
  },
  {
    docType: 'ATESTADO',
    title: 'Atestado de Capacidade',
    description: 'Comprovante de execução de serviço similar anterior',
    status: 'pending',
  },
];

@Injectable()
export class ChecklistService {
  constructor(private prisma: PrismaService) {}

  async getChecklist(userId: string, bidId: string) {
    const existing = await this.prisma.bidDocument.findMany({
      where: { userId, bidId },
      orderBy: { createdAt: 'asc' },
    });

    if (existing.length > 0) return existing;

    // Seed default documents on first access
    await this.prisma.bidDocument.createMany({
      data: DEFAULT_DOCS.map(d => ({ ...d, userId, bidId })),
      skipDuplicates: true,
    });

    return this.prisma.bidDocument.findMany({
      where: { userId, bidId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateStatus(userId: string, bidId: string, docId: string, status: string) {
    const doc = await this.prisma.bidDocument.findUnique({ where: { id: docId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    if (doc.userId !== userId || doc.bidId !== bidId) throw new ForbiddenException();

    return this.prisma.bidDocument.update({
      where: { id: docId },
      data: {
        status,
        lastUpdated: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      },
    });
  }
}
