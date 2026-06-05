import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProposalsService, CreateProposalDto, UpdateProposalDto } from './proposals.service';

@Controller('proposals')
@UseGuards(JwtAuthGuard)
export class ProposalsController {
  constructor(private proposalsService: ProposalsService) {}

  @Get()
  getProposals(@Request() req: any) {
    return this.proposalsService.getProposals(req.user.userId);
  }

  @Post()
  createProposal(@Request() req: any, @Body() dto: CreateProposalDto) {
    return this.proposalsService.createProposal(req.user.userId, dto);
  }

  @Patch(':id')
  updateProposal(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateProposalDto) {
    return this.proposalsService.updateProposal(req.user.userId, id, dto);
  }
}
