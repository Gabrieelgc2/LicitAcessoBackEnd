import { Controller, Get, Query } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Controller('oportunidades')
export class OportunidadesController {
  private async getDatabase() {
    const client = new MongoClient(process.env.MONGO_URI!, {
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    return client.db(process.env.MONGO_DB || 'pncp');
  }

  @Get('filtros')
  async getFiltros(
    @Query('periodo_inicio') periodoInicio: string,
    @Query('periodo_fim') periodoFim: string,
  ): Promise<any> {
    console.log('[OportunidadesController] /oportunidades/filtros query:', {
      periodo_inicio: periodoInicio,
      periodo_fim: periodoFim,
    });

    try {
      const db = await this.getDatabase();
      const goldEstado = db.collection('gold_estado');

      const filtroPeriodo = {
        periodo_inicio: periodoInicio.replace(/-/g, ''),
        periodo_fim: periodoFim.replace(/-/g, ''),
      };
      const proj = { projection: { _id: 0 } };

      const porEstado = await goldEstado.find(filtroPeriodo, proj).toArray();

      return { por_estado: porEstado };
    } catch (error) {
      console.error('Erro ao conectar ou buscar no MongoDB:', error);
      return {
        erro: 'Nao foi possivel conectar ao banco de dados.',
        por_estado: [],
      };
    }
  }
}
