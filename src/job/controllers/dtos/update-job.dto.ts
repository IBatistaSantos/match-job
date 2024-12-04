import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateJobDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills: string[];
}
