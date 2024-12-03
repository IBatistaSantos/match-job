import { BaseEntity, BaseProps } from '@/core/entity/base.entity';

interface CandidateProps extends BaseProps {
  name: string;
  email: string;
  skills: string[];
  resume: string;
}

export class Candidate extends BaseEntity {
  private _name: string;
  private _email: string;
  private _skills: string[];
  private _resume: string;

  constructor(props: CandidateProps) {
    super(props);
    this._name = props.name;
    this._email = props.email;
    this._skills = props.skills;
    this._resume = props.resume;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get skills(): string[] {
    return this._skills;
  }

  get resume(): string {
    return this._resume;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      email: this.email,
      skills: this.skills,
      resume: this.resume,
    };
  }
}
