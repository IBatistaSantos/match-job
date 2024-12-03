import { Injectable } from '@nestjs/common';
import { CandidateRepository } from '../../candidate.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CandidateDocument } from './candidate.schema';
import { Model, Types } from 'mongoose';
import { Candidate } from '@/candidate/entities/candidate';

@Injectable()
export class MongoCandidateRepository implements CandidateRepository {
  constructor(
    @InjectModel(CandidateDocument.name)
    private candidateModel: Model<CandidateDocument>,
  ) {}
  async findByEmail(email: string): Promise<Candidate | undefined> {
    const response = await this.candidateModel.findOne({
      email,
    });

    if (!response) {
      return undefined;
    }

    const object = response.toJSON();

    return new Candidate({
      id: object._id.toString(),
      createdAt: object.createdAt,
      status: object.status,
      updatedAt: object.updatedAt,
      name: object.name,
      email: object.email,
      skills: object.skills,
      resume: object.resume,
    });
  }

  async save(candidate: Candidate): Promise<void> {
    const candidateJSON = candidate.toJSON();
    const { id, ...rest } = candidateJSON;
    await this.candidateModel.create({
      _id: new Types.ObjectId(id),
      ...rest,
    });
  }
}
