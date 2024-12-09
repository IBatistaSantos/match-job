import { MockProxy, mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { JobRepository } from '@/job/repositories/job.repository';
import { EmbeddingProvider } from '@/shared/providers/embed/embed.provider';
import { VectorialDatabase } from '@/shared/providers/vectorial-database/vectorial-database.provider';
import { FindMatchCandidateService } from '@/job/services/find-match-candidate.service';

import { Job } from '@/job/entities/job.entity';
import { Candidate } from '@/candidate/entities/candidate';

describe('FindMatchCandidateService', () => {
  let service: FindMatchCandidateService;
  let repository: MockProxy<JobRepository>;
  let embeddingProvider: MockProxy<EmbeddingProvider>;
  let vectorialDB: MockProxy<VectorialDatabase>;
  let job: Job;
  let candidate: Candidate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindMatchCandidateService,
        {
          provide: 'JobRepository',
          useValue: (repository = mock<JobRepository>()),
        },
        {
          provide: 'EmbeddingProvider',
          useValue: (embeddingProvider = mock<EmbeddingProvider>()),
        },
        {
          provide: 'VectorialDatabase',
          useValue: (vectorialDB = mock<VectorialDatabase>()),
        },
      ],
    }).compile();

    job = new Job({
      id: faker.string.uuid(),
      description: faker.person.jobDescriptor(),
      skills: [faker.person.jobArea(), faker.person.jobArea()],
      title: faker.person.jobTitle(),
    });

    candidate = new Candidate({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      resume: faker.lorem.paragraph(),
      skills: [faker.person.jobArea(), faker.person.jobArea()],
    });

    repository.findById.mockResolvedValue(job);
    repository.listCandidates.mockResolvedValue([candidate]);

    embeddingProvider.embed.mockResolvedValue([
      faker.number.int(),
      faker.number.int(),
    ]);

    vectorialDB.search.mockResolvedValue([
      {
        id: 'candidate1',
        score: faker.number.float({ min: 0, max: 1 }),
      },
    ]);

    service = module.get<FindMatchCandidateService>(FindMatchCandidateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of candidates', async () => {
    const candidates = await service.execute(job.id);

    expect(candidates).toHaveLength(1);
    expect(candidates[0].id).toBe(candidate.id);
  });

  it('should return an empty list', async () => {
    repository.listCandidates.mockResolvedValueOnce([]);

    const candidates = await service.execute(job.id);

    expect(candidates).toHaveLength(0);
  });

  it('should throw an error when job is not found', async () => {
    repository.findById.mockResolvedValueOnce(null);

    await expect(service.execute(job.id)).rejects.toThrow('Job not found');
  });
});
