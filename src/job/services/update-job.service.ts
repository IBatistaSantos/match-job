import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JobRepository } from '../repositories/job.repository';
import { JobProps } from '../entities/job.entity';

interface UpdateJobInput {
  id: string;
  data: Partial<JobProps>;
}

@Injectable()
export class UpdateJobService {
  constructor(
    @Inject('JobRepository') private readonly repository: JobRepository,
  ) {}

  async execute(params: UpdateJobInput) {
    const job = await this.repository.findById(params.id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    job.update(params.data);
    await this.repository.update(job);
  }
}
