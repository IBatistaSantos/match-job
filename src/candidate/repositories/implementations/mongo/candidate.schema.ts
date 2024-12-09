import { Candidate } from '@/candidate/entities/candidate';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Candidate>;

@Schema({
  collection: 'candidates',
})
export class CandidateDocument {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: String }] })
  skills: string[];

  @Prop()
  resume: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  status: string;
}

export const CandidateSchema = SchemaFactory.createForClass(CandidateDocument);
