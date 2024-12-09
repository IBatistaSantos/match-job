import { MockProxy, mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { JobRepository } from '@/job/repositories/job.repository';

import { Job } from '@/job/entities/job.entity';
import { NotFoundException } from '@nestjs/common';
import { DetailJobService } from '@/job/services/details-job.service';

describe('DetailJobService', () => {
  let service: DetailJobService;
  let repository: MockProxy<JobRepository>;
  let job: Job;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetailJobService,
        {
          provide: 'JobRepository',
          useValue: (repository = mock<JobRepository>()),
        },
      ],
    }).compile();

    job = new Job({
      id: faker.string.uuid(),
      description: faker.person.jobDescriptor(),
      skills: [faker.person.jobArea(), faker.person.jobArea()],
      title: faker.person.jobTitle(),
    });

    repository.findById.mockResolvedValue(job);

    service = module.get<DetailJobService>(DetailJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a job', async () => {
    const result = await service.execute(job.id);

    expect(result).toEqual(
      expect.objectContaining({
        id: job.id,
        description: job.description,
        skills: job.skills,
        title: job.title,
      }),
    );
  });

  it('should throw an error if job does not exist', async () => {
    repository.findById.mockResolvedValueOnce(undefined);

    await expect(service.execute(job.id)).rejects.toThrow(
      new NotFoundException('Job not found'),
    );
  });
});
