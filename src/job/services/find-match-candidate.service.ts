import { EmbeddingProvider } from '@/shared/providers/embed/embed.provider';
import { JobRepository } from '../repositories/job.repository';
import { VectorialDatabase } from '@/shared/providers/vectorial-database/vectorial-database.provider';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CandidateProps } from '@/candidate/entities/candidate';

export interface FindMatchCandidateResponse extends CandidateProps {
  score: number;
}

@Injectable()
export class FindMatchCandidateService {
  constructor(
    @Inject('JobRepository')
    private readonly repository: JobRepository,
    @Inject('EmbeddingProvider')
    private readonly embeddingProvider: EmbeddingProvider,
    @Inject('VectorialDatabase')
    private readonly vectorialDB: VectorialDatabase,
  ) {}

  async execute(jobId: string): Promise<FindMatchCandidateResponse[]> {
    const job = await this.repository.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const embeddingJobDescription = await this.embeddingProvider.embed(
      job.description,
    );

    const listIdsAndScores = await this.vectorialDB.search(
      embeddingJobDescription,
    );

    if (!listIdsAndScores.length) {
      return [];
    }

    const candidateIds = listIdsAndScores.map((item) => item.id);

    const candidates = await this.repository.listCandidates(candidateIds);

    const scoreMap = new Map(
      listIdsAndScores.map((item) => [
        item.id,
        Number(item.score * 100).toFixed(2),
      ]),
    );

    return candidates.map((candidate) => ({
      ...candidate.toJSON(),
      score: Number(scoreMap.get(candidate.id) || 0),
    }));
  }
}
