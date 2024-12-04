import { ObjectId } from './objectId';

interface Props {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}

export type BaseProps = Partial<Props>;

export class BaseEntity {
  private _id: string;
  private _createdAt: Date;
  protected _updatedAt: Date;
  private _status: string;

  constructor(props?: BaseProps) {
    this._id = new ObjectId(props?.id).value;
    this._createdAt = props?.createdAt || new Date();
    this._updatedAt = props?.updatedAt || new Date();
    this._status = props?.status || 'ACTIVE';
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get status(): string {
    return this._status;
  }

  delete(): void {
    this._status = 'INACTIVE';
  }

  toJSON(): Props {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      status: this.status,
    };
  }
}
