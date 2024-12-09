import { MockProxy, mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthCandidateService } from '@/candidate/services/auth-candidate.service';
import { CandidateRepository } from '@/candidate/repositories/candidate.repository';
import { HashProvider } from '@/shared/providers/hash/hash.provider';
import { Candidate } from '@/candidate/entities/candidate';
import { faker } from '@faker-js/faker/.';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthCandidateService', () => {
  let service: AuthCandidateService;
  let repository: MockProxy<CandidateRepository>;
  let hashProvider: MockProxy<HashProvider>;
  let candidate: Candidate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthCandidateService,
        {
          provide: 'CandidateRepository',
          useValue: (repository = mock<CandidateRepository>()),
        },
        {
          provide: 'HashProvider',
          useValue: (hashProvider = mock<HashProvider>()),
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('access_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
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

    repository.findByEmail.mockResolvedValue(candidate);
    hashProvider.compare.mockResolvedValue(true);

    service = module.get<AuthCandidateService>(AuthCandidateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return access_token and user', async () => {
    const result = await service.execute({
      email: candidate.email,
      password: candidate.password,
    });

    expect(result.access_token).toBeDefined();
    expect(result.user).toEqual(candidate.toPublicJSON());
  });

  it('should throw an error if candidate not found', async () => {
    repository.findByEmail.mockResolvedValue(undefined);

    await expect(
      service.execute({
        email: candidate.email,
        password: candidate.password,
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('should throw an error if password is invalid', async () => {
    hashProvider.compare.mockResolvedValue(false);

    await expect(
      service.execute({
        email: candidate.email,
        password: candidate.password,
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  describe('validateUser', () => {
    it('should return user', async () => {
      repository.findById.mockResolvedValue(candidate);

      const result = await service.validateUser(candidate.id);

      expect(result).toEqual(candidate.toPublicJSON());
    });

    it('should return null if user not found', async () => {
      repository.findById.mockResolvedValue(undefined);

      const result = await service.validateUser(candidate.id);

      expect(result).toBeNull();
    });
  });
});
