import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JobSchema,
  JobStructure,
} from './repositories/implementations/job.schema';
import { CreateJobService } from './services/create-job.service';
import { MongoJobRepository } from './repositories/implementations/mongo-job.repository';
import { JobController } from './controllers/job.controller';
import {
  CandidateDocument,
  CandidateSchema,
} from '@/candidate/repositories/implementations/mongo/candidate.schema';
import { FindMatchCandidateService } from './services/find-match-candidate.service';
import { OpenAIEmbed } from '@/shared/providers/embed/implementations/openai-embed.provider';
import { PineconeProvider } from '@/shared/providers/vectorial-database/implementations/pinecone.provider';
import { DeleteJobService } from './services/delete.job.service';
import { UpdateJobService } from './services/update-job.service';
import { DetailJobService } from './services/details-job.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobStructure.name, schema: JobSchema },
      {
        name: CandidateDocument.name,
        schema: CandidateSchema,
      },
    ]),
  ],
  controllers: [JobController],
  providers: [
    CreateJobService,
    DeleteJobService,
    UpdateJobService,
    DetailJobService,
    FindMatchCandidateService,
    {
      provide: 'JobRepository',
      useClass: MongoJobRepository,
    },
    {
      provide: 'EmbeddingProvider',
      useClass: OpenAIEmbed,
    },
    {
      provide: 'VectorialDatabase',
      useClass: PineconeProvider,
    },
  ],
})
export class JobModule {}
