import { MockProxy, mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';

import { CandidateRepository } from '@/candidate/repositories/candidate.repository';

import { Candidate } from '@/candidate/entities/candidate';
import { ProfileCandidateService } from '@/candidate/services/profile-candidate.service';

describe('ProfileCandidateService', () => {
  let service: ProfileCandidateService;
  let repository: MockProxy<CandidateRepository>;
  let candidate: Candidate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileCandidateService,
        {
          provide: 'CandidateRepository',
          useValue: (repository = mock<CandidateRepository>()),
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

    repository.findById.mockResolvedValue(candidate);

    service = module.get<ProfileCandidateService>(ProfileCandidateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a candidate', async () => {
    const result = await service.execute(candidate.id);

    expect(result).toEqual(candidate.toPublicJSON());
  });

  it('should throw user not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.execute(candidate.id)).rejects.toThrow(
      'Candidate not found',
    );
  });
});
