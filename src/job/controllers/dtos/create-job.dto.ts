import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';
export class CreateJobDTO {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  skills: string[];
}
