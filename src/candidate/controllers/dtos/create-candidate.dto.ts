import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCandidateDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty({ each: true })
  skills: string[];

  @IsNotEmpty()
  @IsString()
  resume: string;
}
