import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class AddFavoriteDto {
  bidId!: string;
  objeto_compra!: string;
  municipio_nome?: string;
  valor_total_estimado?: number;
  situacao_nome?: string;
  ramo_mei?: string;
  modalidade_nome?: string;
  data_publicacao_pncp?: string;
}

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addFavorite(userId: string, dto: AddFavoriteDto) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_bidId: { userId, bidId: dto.bidId } },
    });
    if (existing) throw new ConflictException('Edital já está nos favoritos');

    return this.prisma.favorite.create({
      data: { userId, ...dto },
    });
  }

  async removeFavorite(userId: string, bidId: string) {
    const fav = await this.prisma.favorite.findUnique({
      where: { userId_bidId: { userId, bidId } },
    });
    if (!fav) throw new NotFoundException('Favorito não encontrado');
    if (fav.userId !== userId) throw new ForbiddenException();

    await this.prisma.favorite.delete({
      where: { userId_bidId: { userId, bidId } },
    });
    return { success: true };
  }

  async isFavorited(userId: string, bidId: string): Promise<boolean> {
    const fav = await this.prisma.favorite.findUnique({
      where: { userId_bidId: { userId, bidId } },
    });
    return !!fav;
  }
}
