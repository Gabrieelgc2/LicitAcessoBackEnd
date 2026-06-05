import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateDocumentDto {
  name: string;
  mimeType: string;
  uploadDate: string;
  status?: string;
  size?: number;
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
