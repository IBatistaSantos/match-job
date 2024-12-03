import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { Candidate } from '../entities/candidate';
import { EmbeddingProvider } from '../providers/embed/embed.provider';
import { SearchProvider } from '../providers/search/search.provider';
import { CandidateRepository } from '../repositories/candidate.repository';

interface CreateCandidateInput {
  name: string;
  email: string;
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
    @Inject('SearchProvider')
    private readonly searchProvider: SearchProvider,
  ) {}
  async execute(params: CreateCandidateInput): Promise<{ id: string }> {
    const existingCandidate = await this.repository.findByEmail(params.email);

    if (existingCandidate) {
      throw new BadRequestException('Candidate with this email already exists');
    }

    const candidate = new Candidate(params);

    const embeddedResume = await this.embeddingProvider.embed(candidate.resume);

    if (!embeddedResume) {
      throw new BadRequestException('Resume embedding failed');
    }

    await this.searchProvider.index(candidate.id, embeddedResume);

    await this.repository.save(candidate);

    return { id: candidate.id };
  }
}
