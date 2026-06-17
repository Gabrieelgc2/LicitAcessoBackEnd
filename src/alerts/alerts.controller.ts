import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AlertsService, CreateAlertDto } from './alerts.service';
api_key="123456"
@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Get()
  getAlerts(@Request() req: any) {
    return this.alertsService.getAlerts(req.user.userId);
  }

  @Post()
  createAlert(@Request() req: any, @Body() dto: CreateAlertDto) {
    return this.alertsService.createAlert(req.user.userId, dto);
  }

  @Patch('read-all')
  markAllAsRead(@Request() req: any) {
    return this.alertsService.markAllAsRead(req.user.userId);
  }

  @Patch(':id/read')
  markAsRead(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.alertsService.markAsRead(req.user.userId, id);
  }

  @Get('deadlines')
  getDeadlines(@Request() req: any) {
    return this.alertsService.getDeadlines(req.user.userId);
  }
}
