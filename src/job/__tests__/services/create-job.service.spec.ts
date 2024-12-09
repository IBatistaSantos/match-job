import { MockProxy, mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { JobRepository } from '@/job/repositories/job.repository';

import { CreateJobService } from '@/job/services/create-job.service';

describe('CreateJobService', () => {
  let service: CreateJobService;
  let repository: MockProxy<JobRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateJobService,
        {
          provide: 'JobRepository',
          useValue: (repository = mock<JobRepository>()),
        },
      ],
    }).compile();

    repository.save.mockResolvedValue();

    service = module.get<CreateJobService>(CreateJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a job', async () => {
    const params = {
      description: faker.person.jobDescriptor(),
      skills: [faker.person.jobArea(), faker.person.jobArea()],
      title: faker.person.jobTitle(),
    };
    await service.execute(params);

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        description: params.description,
        skills: params.skills,
        title: params.title,
      }),
    );
  });
});
