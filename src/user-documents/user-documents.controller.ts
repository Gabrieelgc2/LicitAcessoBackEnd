import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDocumentsService, CreateDocumentDto } from './user-documents.service';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class UserDocumentsController {
  constructor(private userDocumentsService: UserDocumentsService) {}

  @Get()
  getDocuments(@Request() req: any) {
    return this.userDocumentsService.getDocuments(req.user.userId);
  }

  @Post()
  createDocument(@Request() req: any, @Body() dto: CreateDocumentDto) {
    return this.userDocumentsService.createDocument(req.user.userId, dto);
  }

  @Delete(':id')
  deleteDocument(@Request() req: any, @Param('id') id: string) {
    return this.userDocumentsService.deleteDocument(req.user.userId, id);
  }
}
