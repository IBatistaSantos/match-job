import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { EmbeddingProvider } from '../embed.provider';

@Injectable()
export class OpenAIEmbed implements EmbeddingProvider {
  private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION,
      project: process.env.OPENAI_PROJECT,
    });
  }
  async embed(input: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  }
}
