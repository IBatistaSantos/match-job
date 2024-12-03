import { Injectable, Inject } from '@nestjs/common';
import { Job } from '../entities/job.entity';
import { JobRepository } from '../repositories/job.repository';

interface CreateJobInput {
  title: string;
  description?: string;
  skills: string[];
}

@Injectable()
export class CreateJobService {
  constructor(
    @Inject('JobRepository')
    private readonly repository: JobRepository,
  ) {}
  async execute(params: CreateJobInput): Promise<{ id: string }> {
    const job = new Job({
      title: params.title,
      description: params.description,
      skills: params.skills,
    });

    await this.repository.save(job);

    return { id: job.id };
  }
}
