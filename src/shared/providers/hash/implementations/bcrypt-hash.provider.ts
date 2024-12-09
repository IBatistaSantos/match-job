import { hash as hashBcrypt, compare as compareBcrypt } from 'bcrypt';
import { HashProvider } from '../hash.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptHashProvider implements HashProvider {
  async compare(text: string, hash: string): Promise<boolean> {
    return compareBcrypt(text, hash);
  }

  async hash(text: string): Promise<string> {
    return hashBcrypt(text, 10);
  }
}
