import { Types } from 'mongoose';

export class ObjectId {
  private _value: string;

  constructor(value?: string) {
    this._value = value || new Types.ObjectId().toHexString();
  }

  get value(): string {
    return this._value;
  }
}
