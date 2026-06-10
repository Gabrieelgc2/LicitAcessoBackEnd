import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

export class CreateDocumentDto {
  @IsNotEmpty({ message: 'name é obrigatório' })
  @IsString({ message: 'name deve ser uma string' })
  name!: string;

  @IsNotEmpty({ message: 'mimeType é obrigatório' })
  @IsString({ message: 'mimeType deve ser uma string' })
  mimeType!: string;

  @IsNotEmpty({ message: 'uploadDate é obrigatório' })
  @IsString({ message: 'uploadDate deve ser uma string' })
  uploadDate!: string;

  @IsOptional()
  @IsString({ message: 'status deve ser uma string' })
  status?: string;

  @IsOptional()
  @IsNumber({}, { message: 'size deve ser um número' })
  size?: number;

  @IsOptional()
  @IsString({ message: 'content deve ser uma string' })
  content?: string;
}

@Injectable()
export class UserDocumentsService {
  constructor(private prisma: PrismaService) {}

  async getDocuments(userId: string) {
    return this.prisma.userDocument.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        mimeType: true,
        uploadDate: true,
        status: true,
        size: true,
        createdAt: true,
      },
    });
  }

  async createDocument(userId: string, dto: CreateDocumentDto) {
    return this.prisma.userDocument.create({
      data: {
        userId,
        name: dto.name,
        mimeType: dto.mimeType,
        uploadDate: dto.uploadDate,
        status: dto.status ?? 'pendente',
        size: dto.size,
        content: dto.content,
      },
      select: {
        id: true,
        name: true,
        mimeType: true,
        uploadDate: true,
        status: true,
        size: true,
        createdAt: true,
      },
    });
  }

  async deleteDocument(userId: string, docId: string) {
    const doc = await this.prisma.userDocument.findUnique({ where: { id: docId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    if (doc.userId !== userId) throw new ForbiddenException();
    await this.prisma.userDocument.delete({ where: { id: docId } });
    return { success: true };
  }
}
