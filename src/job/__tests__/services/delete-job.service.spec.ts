import { MockProxy, mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { JobRepository } from '@/job/repositories/job.repository';

import { Job } from '@/job/entities/job.entity';
import { NotFoundException } from '@nestjs/common';
import { DeleteJobService } from '@/job/services/delete.job.service';

describe('DeleteJobService', () => {
  let service: DeleteJobService;
  let repository: MockProxy<JobRepository>;
  let job: Job;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteJobService,
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

    service = module.get<DeleteJobService>(DeleteJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete a job', async () => {
    await service.execute(job.id);

    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'INACTIVE',
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
