import { MockProxy, mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';

import { CandidateRepository } from '@/candidate/repositories/candidate.repository';
import { HashProvider } from '@/shared/providers/hash/hash.provider';
import { Candidate } from '@/candidate/entities/candidate';
import { CreateCandidateService } from '@/candidate/services/create-candidate.service';
import { VectorialDatabase } from '@/shared/providers/vectorial-database/vectorial-database.provider';
import { EmbeddingProvider } from '@/shared/providers/embed/embed.provider';

describe('CreateCandidateService', () => {
  let service: CreateCandidateService;
  let repository: MockProxy<CandidateRepository>;
  let hashProvider: MockProxy<HashProvider>;
  let embeddingProvider: MockProxy<EmbeddingProvider>;
  let vectorialDB: MockProxy<VectorialDatabase>;
  let candidate: Candidate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCandidateService,
        {
          provide: 'CandidateRepository',
          useValue: (repository = mock<CandidateRepository>()),
        },
        {
          provide: 'HashProvider',
          useValue: (hashProvider = mock<HashProvider>()),
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

    candidate = new Candidate({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      resume: faker.lorem.paragraph(),
      skills: [faker.lorem.word()],
    });

    repository.findByEmail.mockResolvedValue(undefined);
    hashProvider.hash.mockResolvedValue('hashedPassword');
    embeddingProvider.embed.mockResolvedValue([1, 2, 3, 4, 5]);
    vectorialDB.index.mockResolvedValue();

    service = module.get<CreateCandidateService>(CreateCandidateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a candidate', async () => {
    const result = await service.execute({
      email: candidate.email,
      name: candidate.name,
      password: candidate.password,
      resume: candidate.resume,
      skills: candidate.skills,
    });

    expect(result.id).toBeDefined();
    expect(vectorialDB.index).toHaveBeenCalledWith(result.id, [1, 2, 3, 4, 5]);
    expect(embeddingProvider.embed).toHaveBeenCalledWith(candidate.resume);
  });

  it('should throw an error if the candidate already exists', async () => {
    repository.findByEmail.mockResolvedValue(candidate);

    await expect(
      service.execute({
        email: candidate.email,
        name: candidate.name,
        password: candidate.password,
        resume: candidate.resume,
        skills: candidate.skills,
      }),
    ).rejects.toThrow('Candidate with this email already exists');
  });

  it('should throw an error if the resume embedding fails', async () => {
    embeddingProvider.embed.mockResolvedValue(undefined);

    await expect(
      service.execute({
        email: candidate.email,
        name: candidate.name,
        password: candidate.password,
        resume: candidate.resume,
        skills: candidate.skills,
      }),
    ).rejects.toThrow('Resume embedding failed');
  });
});
