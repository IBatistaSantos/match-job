import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { Job } from '@/job/entities/job.entity';
import { JobRepository } from '../job.repository';
import { JobStructure } from './job.schema';
import { Candidate } from '@/candidate/entities/candidate';
import { CandidateDocument } from '@/candidate/repositories/implementations/mongo/candidate.schema';

@Injectable()
export class MongoJobRepository implements JobRepository {
  constructor(
    @InjectModel(JobStructure.name)
    private jobModel: Model<JobStructure>,

    @InjectModel(CandidateDocument.name)
    private candidateModel: Model<CandidateDocument>,
  ) {}

  async findById(id: string): Promise<Job | null> {
    const job = await this.jobModel
      .findOne({ _id: new Types.ObjectId(id), status: 'ACTIVE' })
      .exec();
    return job
      ? new Job({
          id: job._id.toString(),
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
          description: job.description,
          title: job.title,
          skills: job.skills,
        })
      : null;
  }
  async listCandidates(candidateIds: string[]): Promise<Candidate[]> {
    const candidates = await this.candidateModel
      .find({ _id: { $in: candidateIds }, status: 'ACTIVE' })
      .exec();
    return candidates.map(
      (candidate) =>
        new Candidate({
          id: candidate._id.toString(),
          createdAt: candidate.createdAt,
          updatedAt: candidate.updatedAt,
          password: candidate.password,
          status: candidate.status,
          name: candidate.name,
          email: candidate.email,
          skills: candidate.skills,
          resume: candidate.resume,
        }),
    );
  }
  async save(job: Job): Promise<void> {
    const jobJSON = job.toJSON();
    const { id, ...rest } = jobJSON;
    await this.jobModel.create({
      _id: new Types.ObjectId(id),
      ...rest,
    });
  }

  async update(job: Job): Promise<void> {
    const jobJSON = job.toJSON();
    const { id, ...rest } = jobJSON;
    await this.jobModel.updateOne({ _id: new Types.ObjectId(id) }, rest).exec();
  }
}
