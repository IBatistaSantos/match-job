import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JobSchema,
  JobStructure,
} from './repositories/implementations/job.schema';
import { CreateJobService } from './services/create-job.service';
import { MongoJobRepository } from './repositories/implementations/mongo-job.repository';
import { JobController } from './controllers/job.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: JobStructure.name, schema: JobSchema }]),
  ],
  controllers: [JobController],
  providers: [
    CreateJobService,
    {
      provide: 'JobRepository',
      useClass: MongoJobRepository,
    },
  ],
})
export class JobModule {}
