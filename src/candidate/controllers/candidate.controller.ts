import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateCandidateService } from '../services/create-candidate.service';
import { CreateCandidateDTO } from './dtos/create-candidate.dto';
import { AuthCandidateService } from '../services/auth-candidate.service';
import { AuthCandidateDTO } from './dtos/auth-candidate.dto';
import { ProfileCandidateService } from '../services/profile-candidate.service';

import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import {
  GetUser,
  UserRequestData,
} from '@/shared/decorator/get-user.decorator';

@Controller('candidates')
export class CandidateController {
  constructor(
    private readonly createCandidateService: CreateCandidateService,
    private readonly authCandidateService: AuthCandidateService,
    private readonly profileCandidateService: ProfileCandidateService,
  ) {}

  @Post()
  async createCandidate(@Body() createCandidateDTO: CreateCandidateDTO) {
    return this.createCandidateService.execute(createCandidateDTO);
  }

  @Post('auth/login')
  async login(@Body() params: AuthCandidateDTO) {
    return this.authCandidateService.execute(params);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@GetUser() user: UserRequestData) {
    return this.profileCandidateService.execute(user.id);
  }
}
