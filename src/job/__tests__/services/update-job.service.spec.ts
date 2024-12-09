import { MockProxy, mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { JobRepository } from '@/job/repositories/job.repository';

import { Job } from '@/job/entities/job.entity';
import { UpdateJobService } from '@/job/services/update-job.service';
import { NotFoundException } from '@nestjs/common';

describe('UpdateJobService', () => {
  let service: UpdateJobService;
  let repository: MockProxy<JobRepository>;
  let job: Job;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateJobService,
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

    service = module.get<UpdateJobService>(UpdateJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update a job', async () => {
    const data = {
      title: faker.person.jobTitle(),
    };

    await service.execute({
      id: job.id,
      data,
    });

    expect(job.title).toBe(data.title);
    expect(repository.update).toHaveBeenCalledWith(job);
  });

  it('should throw an error if job does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.execute({
        id: job.id,
        data: {},
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
