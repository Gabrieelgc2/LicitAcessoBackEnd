import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { MongoClient, Db, ObjectId } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI!;
const MONGO_DB = process.env.MONGO_DB!;
const COLLECTION = 'contratacoes_processadas';

const PROJECTION_LISTA = {
  _id: 1,
  ano_compra: 1,
  data_publicacao_pncp: 1,
  modalidade_nome: 1,
  municipio_nome: 1,
  objeto_compra: 1,
  ramo_mei: 1,
  valor_total_estimado: 1,
  situacao_nome: 1,
};

export class GetEditaisDto {
  @IsOptional()
  @IsString({ message: 'data_inicio deve ser uma string' })
  data_inicio?: string;

  @IsOptional()
  @IsString({ message: 'data_fim deve ser uma string' })
  data_fim?: string;

  @IsOptional()
  @IsString({ message: 'ramo_mei deve ser uma string' })
  ramo_mei?: string;

  @IsOptional()
  @IsString({ message: 'situacao_nome deve ser uma string' })
  situacao_nome?: string;

  @IsOptional()
  @IsString({ message: 'municipio_nome deve ser uma string' })
  municipio_nome?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'pagina deve ser numérica' })
  pagina?: string = '1';

  @IsOptional()
  @IsNumberString({}, { message: 'tamanho deve ser numérico' })
  tamanho?: string = '20';
}

@Controller('editais')
export class EditaisController {
  private mongoClient: MongoClient | null = null;
  private dbInstance: Db | null = null;

  private async getDatabase(): Promise<Db> {
    if (this.dbInstance) return this.dbInstance;
    this.mongoClient = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    await this.mongoClient.connect();
    this.dbInstance = this.mongoClient.db(MONGO_DB);
    return this.dbInstance;
  }

  // GET /editais
  @Get()
  async getEditais(@Query() query: GetEditaisDto) {
    const {
      data_inicio: dataInicio,
      data_fim: dataFim,
      ramo_mei: ramoMei,
      situacao_nome: situacaoNome,
      municipio_nome: municipioNome,
      pagina = '1',
      tamanho = '20',
    } = query;

    const db = await this.getDatabase();
    const filtro: any = {};

    if (dataInicio || dataFim) {
      filtro.data_publicacao_pncp = {};
      if (dataInicio) filtro.data_publicacao_pncp.$gte = dataInicio;
      if (dataFim) filtro.data_publicacao_pncp.$lte = dataFim;
    }

    if (ramoMei) filtro.ramo_mei = { $regex: ramoMei, $options: 'i' };
    if (situacaoNome) filtro.situacao_nome = { $regex: situacaoNome, $options: 'i' };
    if (municipioNome) filtro.municipio_nome = { $regex: municipioNome, $options: 'i' };

    const skip = (parseInt(pagina) - 1) * parseInt(tamanho);
    const limit = Math.min(parseInt(tamanho), 100);

    try {
      const [dados, total] = await Promise.all([
        db.collection(COLLECTION)
          .find(filtro, { projection: PROJECTION_LISTA })
          .sort({ data_publicacao_pncp: -1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        db.collection(COLLECTION).countDocuments(filtro),
      ]);

      return {
        dados: dados.map(d => ({ ...d, _id: d._id.toString() })),
        paginacao: {
          total,
          pagina: parseInt(pagina),
          tamanho: limit,
          paginas: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('[editais]', error);
      return { dados: [], paginacao: { total: 0, pagina: 1, tamanho: limit, paginas: 0 } };
    }
  }

  // GET /editais/filtros — deve vir ANTES de /:id
  @Get('filtros')
  async getFiltros() {
    const db = await this.getDatabase();
    try {
      const [ramos, situacoes] = await Promise.all([
        db.collection(COLLECTION).distinct('ramo_mei'),
        db.collection(COLLECTION).distinct('situacao_nome'),
      ]);
      return {
        ramos_mei: ramos.filter(Boolean).sort(),
        situacoes: situacoes.filter(Boolean).sort(),
      };
    } catch (error) {
      console.error('[editais/filtros]', error);
      return { ramos_mei: [], situacoes: [] };
    }
  }

  // GET /editais/:id — detalhe completo
  @Get(':id')
  async getEditalById(@Param('id') id: string) {
    const db = await this.getDatabase();
    try {
      const doc = await db.collection(COLLECTION).findOne(
        { _id: new ObjectId(id) },
      );
      if (!doc) throw new NotFoundException('Edital não encontrado.');
      return { ...doc, _id: doc._id.toString() };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('[editais/:id]', error);
      throw new NotFoundException('Edital não encontrado.');
    }
  }
}
