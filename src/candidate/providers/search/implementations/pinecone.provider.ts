import { Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';

import { SearchProvider } from '../search.provider';

@Injectable()
export class PineconeProvider implements SearchProvider {
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
}
