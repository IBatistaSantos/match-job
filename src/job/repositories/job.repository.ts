import { Candidate } from '@/candidate/entities/candidate';
import { Job } from '../entities/job.entity';

export interface JobRepository {
  findById(id: string): Promise<Job | null>;
  listCandidates(candidateIds: string[]): Promise<Candidate[]>;
  save(job: Job): Promise<void>;
  update(job: Job): Promise<void>;
}
