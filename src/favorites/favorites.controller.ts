import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavoritesService, AddFavoriteDto } from './favorites.service';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  getFavorites(@Request() req: any) {
    return this.favoritesService.getFavorites(req.user.userId);
  }

  @Post()
  addFavorite(@Request() req: any, @Body() dto: AddFavoriteDto) {
    return this.favoritesService.addFavorite(req.user.userId, dto);
  }

  @Delete(':bidId')
  removeFavorite(@Request() req: any, @Param('bidId') bidId: string) {
    return this.favoritesService.removeFavorite(req.user.userId, bidId);
  }
}
