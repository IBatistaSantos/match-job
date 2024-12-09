import { IsEmail, IsString } from 'class-validator';

export class AuthCandidateDTO {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
