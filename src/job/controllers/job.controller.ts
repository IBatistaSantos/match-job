import { Body, Controller, Post } from '@nestjs/common';
import { CreateJobDTO } from './dtos/create-job.dto';
import { CreateJobService } from '../services/create-job.service';

@Controller('jobs')
export class JobController {
  constructor(private readonly createJobService: CreateJobService) {}

  @Post()
  async createJob(@Body() createJobDTO: CreateJobDTO) {
    return this.createJobService.execute(createJobDTO);
  }
}
