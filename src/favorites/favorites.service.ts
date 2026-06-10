import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

export class AddFavoriteDto {
  @IsNotEmpty({ message: 'bidId é obrigatório' })
  @IsString({ message: 'bidId deve ser uma string' })
  bidId!: string;

  @IsNotEmpty({ message: 'objeto_compra é obrigatório' })
  @IsString({ message: 'objeto_compra deve ser uma string' })
  objeto_compra!: string;

  @IsOptional()
  @IsString({ message: 'municipio_nome deve ser uma string' })
  municipio_nome?: string;

  @IsOptional()
  @IsNumber({}, { message: 'valor_total_estimado deve ser um número' })
  valor_total_estimado?: number;

  @IsOptional()
  @IsString({ message: 'situacao_nome deve ser uma string' })
  situacao_nome?: string;

  @IsOptional()
  @IsString({ message: 'ramo_mei deve ser uma string' })
  ramo_mei?: string;

  @IsOptional()
  @IsString({ message: 'modalidade_nome deve ser uma string' })
  modalidade_nome?: string;

  @IsOptional()
  @IsString({ message: 'data_publicacao_pncp deve ser uma string' })
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
