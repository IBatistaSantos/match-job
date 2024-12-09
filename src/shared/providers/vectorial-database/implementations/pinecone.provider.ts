import { Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';

import {
  VectorialDatabase,
  VectorialDatabaseOutput,
} from '../vectorial-database.provider';

@Injectable()
export class PineconeProvider implements VectorialDatabase {
  private pc: Pinecone;
  private INDEX_NAME = 'match-job';

  constructor() {
    this.pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  async index(id: string, embed: number[]): Promise<void> {
    const indexName = this.pc.index(this.INDEX_NAME);

    await indexName.upsert([
      {
        id,
        values: embed,
      },
    ]);
  }

  async search(embed: number[]): Promise<VectorialDatabaseOutput[]> {
    const indexName = this.pc.index(this.INDEX_NAME);

    const response = await indexName.query({
      vector: embed,
      topK: 10,
    });

    return response.matches.map((match) => ({
      id: match.id,
      score: match.score,
    }));
  }
}
