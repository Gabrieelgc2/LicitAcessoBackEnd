import { Controller, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChecklistService } from './checklist.service';

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
    @Param('docId') docId: string,
    @Body('status') status: string,
  ) {
    return this.checklistService.updateStatus(req.user.userId, bidId, docId, status);
  }
}
