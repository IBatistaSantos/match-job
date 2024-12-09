import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CandidateDocument,
  CandidateSchema,
} from './repositories/implementations/mongo/candidate.schema';
import { CreateCandidateService } from './services/create-candidate.service';
import { MongoCandidateRepository } from './repositories/implementations/mongo/mongo-candidate.repository';
import { OpenAIEmbed } from '../shared/providers/embed/implementations/openai-embed.provider';
import { PineconeProvider } from '../shared/providers/vectorial-database/implementations/pinecone.provider';
import { CandidateController } from './controllers/candidate.controller';
import { BcryptHashProvider } from '@/shared/providers/hash/implementations/bcrypt-hash.provider';
import { AuthCandidateService } from './services/auth-candidate.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ProfileCandidateService } from './services/profile-candidate.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CandidateDocument.name,
        schema: CandidateSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [CandidateController],
  providers: [
    CreateCandidateService,
    AuthCandidateService,
    ProfileCandidateService,
    JwtService,
    JwtStrategy,
    {
      provide: 'CandidateRepository',
      useClass: MongoCandidateRepository,
    },
    {
      provide: 'EmbeddingProvider',
      useClass: OpenAIEmbed,
    },
    {
      provide: 'VectorialDatabase',
      useClass: PineconeProvider,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptHashProvider,
    },
  ],
})
export class CandidateModule {}
