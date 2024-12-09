import { Candidate } from '../entities/candidate';

export interface CandidateRepository {
  findById(id: string): Promise<Candidate | undefined>;
  findByEmail(email: string): Promise<Candidate | undefined>;
  save(candidate: Candidate): Promise<void>;
}
