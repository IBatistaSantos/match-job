import { Job } from '../entities/job.entity';

export interface JobRepository {
  save(job: Job): Promise<void>;
}
