import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateJobDTO } from './dtos/create-job.dto';
import { UpdateJobDTO } from './dtos/update-job.dto';
import { CreateJobService } from '../services/create-job.service';
import {
  FindMatchCandidateResponse,
  FindMatchCandidateService,
} from '../services/find-match-candidate.service';
import { UpdateJobService } from '../services/update-job.service';
import { DeleteJobService } from '../services/delete.job.service';
import { DetailJobService } from '../services/details-job.service';

@Controller('jobs')
export class JobController {
  constructor(
    private readonly createJobService: CreateJobService,
    private readonly updateJobService: UpdateJobService,
    private readonly deleteJobService: DeleteJobService,
    private readonly detailJobService: DetailJobService,
    private readonly findMatchCandidateService: FindMatchCandidateService,
  ) {}

  @Post()
  async createJob(@Body() createJobDTO: CreateJobDTO) {
    return this.createJobService.execute(createJobDTO);
  }

  @Get(':id/match')
  async findMatchCandidate(
    @Param() jobId: string,
  ): Promise<FindMatchCandidateResponse[]> {
    return this.findMatchCandidateService.execute(jobId);
  }

  @Get(':id')
  async getJob(@Param() jobId: string) {
    return this.detailJobService.execute(jobId);
  }

  @Delete(':id')
  async deleteJob(@Param() jobId: string) {
    return this.deleteJobService.execute(jobId);
  }

  @Put(':id')
  async updateJob(@Param() jobId: string, @Body() updateJobDTO: UpdateJobDTO) {
    return this.updateJobService.execute({ id: jobId, data: updateJobDTO });
  }
}
