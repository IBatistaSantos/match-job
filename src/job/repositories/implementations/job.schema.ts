import { Job } from '@/job/entities/job.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({
  collection: 'jobs',
})
export class JobStructure {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [{ type: String }] })
  skills: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  status: string;
}

export const JobSchema = SchemaFactory.createForClass(JobStructure);
