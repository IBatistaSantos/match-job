import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { Candidate } from '../entities/candidate';
import { EmbeddingProvider } from '../../shared/providers/embed/embed.provider';
import { VectorialDatabase } from '../../shared/providers/vectorial-database/vectorial-database.provider';
import { CandidateRepository } from '../repositories/candidate.repository';
import { HashProvider } from '@/shared/providers/hash/hash.provider';

interface CreateCandidateInput {
  name: string;
  email: string;
  password: string;
  skills: string[];
  resume: string;
}

@Injectable()
export class CreateCandidateService {
  constructor(
    @Inject('CandidateRepository')
    private readonly repository: CandidateRepository,
    @Inject('EmbeddingProvider')
    private readonly embeddingProvider: EmbeddingProvider,
    @Inject('VectorialDatabase')
    private readonly vectorialDB: VectorialDatabase,
    @Inject('HashProvider')
    private readonly hashProvider: HashProvider,
  ) {}
  async execute(params: CreateCandidateInput): Promise<{ id: string }> {
    const existingCandidate = await this.repository.findByEmail(params.email);

    if (existingCandidate) {
      throw new BadRequestException('Candidate with this email already exists');
    }

    const hashedPassword = await this.hashProvider.hash(params.password);

    const candidate = new Candidate({
      name: params.name,
      email: params.email,
      password: hashedPassword,
      skills: params.skills,
      resume: params.resume,
    });

    const embeddedResume = await this.embeddingProvider.embed(candidate.resume);

    if (!embeddedResume) {
      throw new BadRequestException('Resume embedding failed');
    }

    await this.vectorialDB.index(candidate.id, embeddedResume);

    await this.repository.save(candidate);

    return { id: candidate.id };
  }
}
