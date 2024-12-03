import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CandidateDocument,
  CandidateSchema,
} from './repositories/implementations/mongo/candidate.schema';
import { CreateCandidateService } from './services/create-candidate.service';
import { MongoCandidateRepository } from './repositories/implementations/mongo/mongo-candidate.repository';
import { OpenAIEmbed } from '../shared/providers/embed/implementations/openai-embed.provider';
import { PineconeProvider } from '../shared/providers/search/implementations/pinecone.provider';
import { CandidateController } from './controllers/candidate.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CandidateDocument.name,
        schema: CandidateSchema,
      },
    ]),
  ],
  controllers: [CandidateController],
  providers: [
    CreateCandidateService,
    {
      provide: 'CandidateRepository',
      useClass: MongoCandidateRepository,
    },
    {
      provide: 'EmbeddingProvider',
      useClass: OpenAIEmbed,
    },
    {
      provide: 'SearchProvider',
      useClass: PineconeProvider,
    },
  ],
})
export class CandidateModule {}
