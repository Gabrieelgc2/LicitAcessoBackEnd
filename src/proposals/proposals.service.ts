import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_PROPOSALS = [
  { name: 'Serviços de TI — Ministério da Saúde', organization: 'Ministério da Saúde', date: '2026-05-15', status: 'ganhou' },
  { name: 'Limpeza e Conservação — Prefeitura SP', organization: 'Prefeitura de São Paulo', date: '2026-05-20', status: 'em_andamento' },
  { name: 'Consultoria Financeira — TCU', organization: 'TCU', date: '2026-04-10', status: 'perdeu' },
  { name: 'Manutenção Predial — INSS', organization: 'INSS', date: '2026-04-01', status: 'cancelado' },
  { name: 'Desenvolvimento de Software — Serpro', organization: 'Serpro', date: '2026-03-20', status: 'ganhou' },
  { name: 'Fornecimento de Equipamentos — MEC', organization: 'Ministério da Educação', date: '2026-03-05', status: 'em_andamento' },
];

export class CreateProposalDto {
  @IsNotEmpty({ message: 'name é obrigatório' })
  @IsString({ message: 'name deve ser uma string' })
  name!: string;

  @IsNotEmpty({ message: 'organization é obrigatório' })
  @IsString({ message: 'organization deve ser uma string' })
  organization!: string;

  @IsNotEmpty({ message: 'date é obrigatório' })
  @IsString({ message: 'date deve ser uma string' })
  date!: string;

  @IsOptional()
  @IsString({ message: 'status deve ser uma string' })
  status?: string;

  @IsOptional()
  @IsString({ message: 'bidId deve ser uma string' })
  bidId?: string;
}

export class UpdateProposalDto {
  @IsOptional()
  @IsString({ message: 'status deve ser uma string' })
  status?: string;

  @IsOptional()
  @IsString({ message: 'name deve ser uma string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'organization deve ser uma string' })
  organization?: string;
}

@Injectable()
export class ProposalsService {
  constructor(private prisma: PrismaService) {}

  async getProposals(userId: string) {
    const existing = await this.prisma.proposal.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    if (existing.length > 0) return existing;

    await this.prisma.proposal.createMany({
      data: DEFAULT_PROPOSALS.map(p => ({ ...p, userId })),
    });

    return this.prisma.proposal.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async createProposal(userId: string, dto: CreateProposalDto) {
    return this.prisma.proposal.create({
      data: {
        userId,
        name: dto.name,
        organization: dto.organization,
        date: dto.date,
        status: dto.status ?? 'em_andamento',
        bidId: dto.bidId,
      },
    });
  }

  async updateProposal(userId: string, id: string, dto: UpdateProposalDto) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id } });
    if (!proposal) throw new NotFoundException('Proposta não encontrada');
    if (proposal.userId !== userId) throw new ForbiddenException();

    return this.prisma.proposal.update({
      where: { id },
      data: dto,
    });
  }
}
