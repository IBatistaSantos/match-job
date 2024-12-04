import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { JobRepository } from '../repositories/job.repository';

@Injectable()
export class DetailJobService {
  constructor(
    @Inject('JobRepository') private readonly jobRepository: JobRepository,
  ) {}

  async execute(jobId: string) {
    const job = await this.jobRepository.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }
}
