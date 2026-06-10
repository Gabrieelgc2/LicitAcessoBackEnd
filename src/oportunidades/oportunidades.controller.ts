import { Controller, Get, Query } from '@nestjs/common';
import { IsNotEmpty, IsString, IsOptional, IsNumberString, Length } from 'class-validator';
import { MongoClient, Db } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI!;
const MONGO_DB = process.env.MONGO_DB!;

export class GetPorEstadoDto {
  @IsNotEmpty({ message: 'periodo_inicio é obrigatório' })
  @IsString({ message: 'periodo_inicio deve ser uma string' })
  periodo_inicio!: string;

  @IsNotEmpty({ message: 'periodo_fim é obrigatório' })
  @IsString({ message: 'periodo_fim deve ser uma string' })
  periodo_fim!: string;

  @IsOptional()
  @IsString({ message: 'uf deve ser uma string' })
  @Length(2, 2, { message: 'uf deve ter exatamente 2 caracteres' })
  uf?: string;
}

export class GetPorAreaServicoDto {
  @IsNotEmpty({ message: 'periodo_inicio é obrigatório' })
  @IsString({ message: 'periodo_inicio deve ser uma string' })
  periodo_inicio!: string;

  @IsNotEmpty({ message: 'periodo_fim é obrigatório' })
  @IsString({ message: 'periodo_fim deve ser uma string' })
  periodo_fim!: string;

  @IsOptional()
  @IsString({ message: 'ramo_mei deve ser uma string' })
  ramo_mei?: string;
}

export class GetPorMesDto {
  @IsNotEmpty({ message: 'mes é obrigatório' })
  @IsNumberString({}, { message: 'mes deve ser numérico' })
  mes!: string;

  @IsNotEmpty({ message: 'ano é obrigatório' })
  @IsNumberString({}, { message: 'ano deve ser numérico' })
  ano!: string;
}

export class GetPorSituacaoDto {
  @IsNotEmpty({ message: 'periodo_inicio é obrigatório' })
  @IsString({ message: 'periodo_inicio deve ser uma string' })
  periodo_inicio!: string;

  @IsNotEmpty({ message: 'periodo_fim é obrigatório' })
  @IsString({ message: 'periodo_fim deve ser uma string' })
  periodo_fim!: string;

  @IsOptional()
  @IsString({ message: 'situacao_nome deve ser uma string' })
  situacao_nome?: string;
}

export class GetPorFaixaValorDto {
  @IsNotEmpty({ message: 'periodo_inicio é obrigatório' })
  @IsString({ message: 'periodo_inicio deve ser uma string' })
  periodo_inicio!: string;

  @IsNotEmpty({ message: 'periodo_fim é obrigatório' })
  @IsString({ message: 'periodo_fim deve ser uma string' })
  periodo_fim!: string;

  @IsOptional()
  @IsString({ message: 'faixa_valor deve ser uma string' })
  faixa_valor?: string;
}

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
  async getPorEstado(@Query() query: GetPorEstadoDto): Promise<any> {
    const { periodo_inicio: periodoInicio, periodo_fim: periodoFim, uf } = query;
    try {
      const db = await this.getDatabase();
      const filtro: any = this.filtroPeriodo(periodoInicio, periodoFim);
      if (uf) filtro.uf = uf;
      
      const dados = await db
        .collection('gold_estado')
        .find(filtro, {
          projection: { _id: 0 },
        })
        .toArray();
      return { por_estado: dados };
    } catch (error) {
      console.error('[por-estado]', error);
      return { por_estado: [] };
    }
  }

  @Get('por-area-servico')
  async getPorAreaServico(@Query() query: GetPorAreaServicoDto): Promise<any> {
    const { periodo_inicio: periodoInicio, periodo_fim: periodoFim, ramo_mei: ramoMei } = query;
    try {
      const db = await this.getDatabase();
      const filtro: any = this.filtroPeriodo(periodoInicio, periodoFim);
      if (ramoMei) filtro.ramo_mei = ramoMei;

      const dados = await db
        .collection('gold_area_de_servico')
        .find(filtro, {
          projection: { _id: 0 },
        })
        .toArray();
      return { por_area_servico: dados };
    } catch (error) {
      console.error('[por-area-servico]', error);
      return { por_area_servico: [] };
    }
  }

  @Get('por-mes')
  async getPorMes(@Query() query: GetPorMesDto): Promise<any> {
    const { mes, ano } = query;
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
  async getPorSituacao(@Query() query: GetPorSituacaoDto): Promise<any> {
    const { periodo_inicio: periodoInicio, periodo_fim: periodoFim, situacao_nome: situacaoNome } = query;
    try {
      const db = await this.getDatabase();
      const filtro: any = this.filtroPeriodo(periodoInicio, periodoFim);
      if (situacaoNome) filtro.situacao_nome = situacaoNome;

      const dados = await db
        .collection('gold_situacao')
        .find(filtro, {
          projection: { _id: 0 },
        })
        .toArray();
      return { por_situacao: dados };
    } catch (error) {
      console.error('[por-situacao]', error);
      return { por_situacao: [] };
    }
  }

  // Mantido caso precise das rotas adicionais abaixo. Se não, pode excluí-las.
  @Get('por-faixa-valor')
  async getPorFaixaValor(@Query() query: GetPorFaixaValorDto): Promise<any> {
    const { periodo_inicio: periodoInicio, periodo_fim: periodoFim, faixa_valor: faixaValor } = query;
    try {
      const db = await this.getDatabase();
      const filtro: any = this.filtroPeriodo(periodoInicio, periodoFim);
      if (faixaValor) filtro.faixa_valor = faixaValor;

      const dados = await db
        .collection('gold_estado')
        .find(filtro, {
          projection: { _id: 0 },
        })
        .toArray();
      return { por_faixa_valor: dados };
    } catch (error) {
      console.error('[por-faixa-valor]', error);
      return { por_faixa_valor: [] };
    }
  }
}
