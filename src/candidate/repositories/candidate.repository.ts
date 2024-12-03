import { Candidate } from '../entities/candidate';

export interface CandidateRepository {
  findByEmail(email: string): Promise<Candidate | undefined>;
  save(candidate: Candidate): Promise<void>;
}
