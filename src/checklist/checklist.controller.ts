import { Controller, Get, Patch, Param, Body, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChecklistService } from './checklist.service';

export class UpdateChecklistStatusDto {
  @IsNotEmpty({ message: 'status é obrigatório' })
  @IsString({ message: 'status deve ser uma string' })
  status!: string;
}

@Controller('checklist')
@UseGuards(JwtAuthGuard)
export class ChecklistController {
  constructor(private checklistService: ChecklistService) {}

  @Get(':bidId')
  getChecklist(@Request() req: any, @Param('bidId') bidId: string) {
    return this.checklistService.getChecklist(req.user.userId, bidId);
  }

  @Patch(':bidId/:docId')
  updateStatus(
    @Request() req: any,
    @Param('bidId') bidId: string,
    @Param('docId', ParseUUIDPipe) docId: string,
    @Body() dto: UpdateChecklistStatusDto,
  ) {
    return this.checklistService.updateStatus(req.user.userId, bidId, docId, dto.status);
  }
}
