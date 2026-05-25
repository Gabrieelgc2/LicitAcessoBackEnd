import { Controller, Get, Query } from '@nestjs/common';
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI!;
const MONGO_DB = process.env.MONGO_DB!;

@Controller('oportunidades')
export class OportunidadesController {
  private async getDatabase() {
    const client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    return client.db(MONGO_DB);
  }

  private filtroPeriodo(periodoInicio: string, periodoFim: string) {
    const inicio = periodoInicio.replace(/-/g, '');
    const fim = periodoFim.replace(/-/g, '');
    return {
      periodo_inicio: { $lte: fim },
      periodo_fim: { $gte: inicio },
    };
  }

  @Get('por-estado')
  async getPorEstado(
    @Query('periodo_inicio') periodoInicio: string,
    @Query('periodo_fim') periodoFim: string,
  ): Promise<any> {
    try {
      const db = await this.getDatabase();
      const dados = await db
        .collection('gold_estado')
        .find(this.filtroPeriodo(periodoInicio, periodoFim), { projection: { _id: 0 } })
        .toArray();
      return { por_estado: dados };
    } catch (error) {
      console.error('[por-estado]', error);
      return { por_estado: [] };
    }
  }

  @Get('por-area-servico')
  async getPorAreaServico(
    @Query('periodo_inicio') periodoInicio: string,
    @Query('periodo_fim') periodoFim: string,
  ): Promise<any> {
    try {
      const db = await this.getDatabase();
      const dados = await db
        .collection('gold_area_de_servico')
        .find(this.filtroPeriodo(periodoInicio, periodoFim), { projection: { _id: 0 } })
        .toArray();
      return { por_area_servico: dados };
    } catch (error) {
      console.error('[por-area-servico]', error);
      return { por_area_servico: [] };
    }
  }

  @Get('por-faixa-valor')
  async getPorFaixaValor(
    @Query('periodo_inicio') periodoInicio: string,
    @Query('periodo_fim') periodoFim: string,
    @Query('faixa_valor') faixaValor?: string,
  ): Promise<any> {
    try {
      const db = await this.getDatabase();
      const filtro: any = this.filtroPeriodo(periodoInicio, periodoFim);
      if (faixaValor) filtro.faixa_valor = faixaValor;
      const dados = await db
        .collection('gold_faixa_de_valor')
        .find(filtro, { projection: { _id: 0 } })
        .toArray();
      return { por_faixa_valor: dados };
    } catch (error) {
      console.error('[por-faixa-valor]', error);
      return { por_faixa_valor: [] };
    }
  }

  @Get('por-mes')
  async getPorMes(
    @Query('mes') mes: string,
    @Query('ano') ano: string,
  ): Promise<any> {
    try {
      const db = await this.getDatabase();
      const filtro: any = {};
      if (mes) filtro.mes = parseInt(mes);
      if (ano) filtro.ano = parseInt(ano);
      const dados = await db
        .collection('gold_por_mes')
        .find(filtro, { projection: { _id: 0 } })
        .toArray();
      return { por_mes: dados };
    } catch (error) {
      console.error('[por-mes]', error);
      return { por_mes: [] };
    }
  }

  @Get('por-situacao')
  async getPorSituacao(
    @Query('periodo_inicio') periodoInicio: string,
    @Query('periodo_fim') periodoFim: string,
  ): Promise<any> {
    try {
      const db = await this.getDatabase();
      const dados = await db
        .collection('gold_situacao')
        .find(this.filtroPeriodo(periodoInicio, periodoFim), { projection: { _id: 0 } })
        .toArray();
      return { por_situacao: dados };
    } catch (error) {
      console.error('[por-situacao]', error);
      return { por_situacao: [] };
    }
  }

  @Get('filtros')
  async getFiltros(
    @Query('periodo_inicio') periodoInicio: string,
    @Query('periodo_fim') periodoFim: string,
  ): Promise<any> {
    try {
      const db = await this.getDatabase();
      const dados = await db
        .collection('gold_estado')
        .find(this.filtroPeriodo(periodoInicio, periodoFim), { projection: { _id: 0 } })
        .toArray();
      return { por_estado: dados };
    } catch (error) {
      console.error('[filtros]', error);
      return { por_estado: [] };
    }
  }
}
