import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { CandidateRepository } from '../repositories/candidate.repository';
import { HashProvider } from '@/shared/providers/hash/hash.provider';

interface AuthCandidateInput {
  email: string;
  password: string;
}

@Injectable()
export class AuthCandidateService {
  constructor(
    @Inject('CandidateRepository')
    private readonly repository: CandidateRepository,
    @Inject('HashProvider')
    private readonly hashProvider: HashProvider,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(params: AuthCandidateInput) {
    const { email, password } = params;
    const candidate = await this.repository.findByEmail(email);
    if (!candidate) throw new BadGatewayException('Invalid email or password');

    const isValid = await this.hashProvider.compare(
      password,
      candidate.password,
    );

    if (!isValid) throw new BadGatewayException('Invalid email or password');

    const payload = { email: candidate.email, sub: candidate.id };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1d',
      }),
      user: candidate.toPublicJSON(),
    };
  }

  async validateUser(userId: any) {
    const user = await this.repository.findById(userId);
    return user ? user.toPublicJSON() : null;
  }
}
