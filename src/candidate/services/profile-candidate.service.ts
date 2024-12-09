import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CandidateRepository } from '../repositories/candidate.repository';

@Injectable()
export class ProfileCandidateService {
  constructor(
    @Inject('CandidateRepository')
    private readonly repository: CandidateRepository,
  ) {}

  async execute(id: string) {
    const candidate = await this.repository.findById(id);
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate.toPublicJSON();
  }
}
