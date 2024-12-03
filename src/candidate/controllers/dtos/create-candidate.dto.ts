import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCandidateDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty({ each: true })
  skills: string[];

  @IsNotEmpty()
  @IsString()
  resume: string;
}
