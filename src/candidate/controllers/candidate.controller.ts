import { Body, Controller, Post } from '@nestjs/common';
import { CreateCandidateService } from '../services/create-candidate.service';
import { CreateCandidateDTO } from './dtos/create-candidate.dto';

@Controller('candidates')
export class CandidateController {
  constructor(
    private readonly createCandidateService: CreateCandidateService,
  ) {}

  @Post()
  async createCandidate(@Body() createCandidateDTO: CreateCandidateDTO) {
    return this.createCandidateService.execute(createCandidateDTO);
  }
}
