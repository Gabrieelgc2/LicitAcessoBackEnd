// import { Controller, Get, Query } from '@nestjs/common';
// import { MongoClient } from 'mongodb';

// @Controller('oportunidades')
// export class OportunidadesController {
//   private async getDatabase() {
//     const client = new MongoClient(process.env.MONGO_URI!, {
//       serverSelectionTimeoutMS: 5000,
//     });
//     await client.connect();
//     return client.db(process.env.MONGO_DB || 'pncp');
//   }

//   @Get('filtros')
//   async getFiltros(
//     @Query('periodo_inicio') periodoInicio: string,
//     @Query('periodo_fim') periodoFim: string,
//   ): Promise<any> {
//     console.log('[OportunidadesController] /oportunidades/filtros query:', {
//       periodo_inicio: periodoInicio,
//       periodo_fim: periodoFim,
//     });

//     try {
//       const db = await this.getDatabase();
//       const goldEstado = db.collection('gold_estado');

//       const filtroPeriodo = {
//         periodo_inicio: periodoInicio.replace(/-/g, ''),
//         periodo_fim: periodoFim.replace(/-/g, ''),
//       };
//       const proj = { projection: { _id: 0 } };

//       const porEstado = await goldEstado.find(filtroPeriodo, proj).toArray();

//       return { por_estado: porEstado };
//     } catch (error) {
//       console.error('Erro ao conectar ou buscar no MongoDB:', error);
//       return {
//         erro: 'Nao foi possivel conectar ao banco de dados.',
//         por_estado: [],
//       };
//     }
//   }
// }


import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI!;
const MONGO_DB = process.env.MONGO_DB!;

@Controller('oportunidades')
export class OportunidadesController {
  private mongoClient: MongoClient | null = null;
  private dbInstance: Db | null = null;

  // Reaproveita a conexão para evitar overhead e vazamento de conexões
  private async getDatabase(): Promise<Db> {
    if (this.dbInstance) {
      return this.dbInstance;
    }

    try {
      this.mongoClient = new MongoClient(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      await this.mongoClient.connect();
      this.dbInstance = this.mongoClient.db(MONGO_DB);
      return this.dbInstance;
    } catch (error) {
      console.error('Falha ao conectar no MongoDB:', error);
      throw error;
    }
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
    @Query('uf') uf?: string,
  ): Promise<any> {
    if (!periodoInicio || !periodoFim) {
      throw new BadRequestException('periodo_inicio e periodo_fim são obrigatórios');
    }
    try {
      const db = await this.getDatabase();
      const filtro: any = this.filtroPeriodo(periodoInicio, periodoFim);
      if (uf) filtro.uf = uf;
      
      const dados = await db
        .collection('gold_estado')
        .find(filtro, { projection: { _id: 0 } })
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
    @Query('ramo_mei') ramoMei?: string,
  ): Promise<any> {
    if (!periodoInicio || !periodoFim) {
      throw new BadRequestException('periodo_inicio e periodo_fim são obrigatórios');
    }
    try {
      const db = await this.getDatabase();
      const filtro: any = this.filtroPeriodo(periodoInicio, periodoFim);
      if (ramoMei) filtro.ramo_mei = ramoMei;

      const dados = await db
        .collection('gold_area_de_servico')
        .find(filtro, { projection: { _id: 0 } })
        .toArray();
      return { por_area_servico: dados };
    } catch (error) {
      console.error('[por-area-servico]', error);
      return { por_area_servico: [] };
    }
  }

  @Get('por-mes')
  async getPorMes(
    @Query('mes') mes: string,
    @Query('ano') ano: string,
  ): Promise<any> {
    if (!mes || !ano) {
      throw new BadRequestException('mes e ano são obrigatórios');
    }
    try {
      const db = await this.getDatabase();
      const filtro: any = {};
      filtro.mes = parseInt(mes, 10);
      filtro.ano = parseInt(ano, 10);

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
    @Query('situacao_nome') situacaoNome?: string,
  ): Promise<any> {
    if (!periodoInicio || !periodoFim) {
      throw new BadRequestException('periodo_inicio e periodo_fim são obrigatórios');
    }
    try {
      const db = await this.getDatabase();
      const filtro: any = this.filtroPeriodo(periodoInicio, periodoFim);
      if (situacaoNome) filtro.situacao_nome = situacaoNome;

      const dados = await db
        .collection('gold_situacao')
        .find(filtro, { projection: { _id: 0 } })
        .toArray();
      return { por_situacao: dados };
    } catch (error) {
      console.error('[por-situacao]', error);
      return { por_situacao: [] };
    }
  }

  // Mantido caso precise das rotas adicionais abaixo. Se não, pode excluí-las.
  @Get('por-faixa-valor')
  async getPorFaixaValor(
    @Query('periodo_inicio') periodoInicio: string,
    @Query('periodo_fim') periodoFim: string,
    @Query('faixa_valor') faixaValor?: string,
  ): Promise<any> {
    if (!periodoInicio || !periodoFim) {
      throw new BadRequestException('periodo_inicio e periodo_fim são obrigatórios');
    }
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
}
