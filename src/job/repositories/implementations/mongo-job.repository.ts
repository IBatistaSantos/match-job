import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { Job } from '@/job/entities/job.entity';
import { JobRepository } from '../job.repository';
import { JobDocument, JobStructure } from './job.schema';

@Injectable()
export class MongoJobRepository implements JobRepository {
  constructor(
    @InjectModel(JobStructure.name)
    private jobModel: Model<JobDocument>,
  ) {}
  async save(job: Job): Promise<void> {
    const jobJSON = job.toJSON();
    const { id, ...rest } = jobJSON;
    await this.jobModel.create({
      _id: new Types.ObjectId(id),
      ...rest,
    });
  }
}
