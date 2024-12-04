import { BaseEntity, BaseProps } from '@/core/entity/base.entity';

export interface JobProps extends BaseProps {
  title: string;
  description: string;
  skills: string[];
}

export class Job extends BaseEntity {
  private _title: string;
  private _description: string;
  private _skills: string[];

  constructor(props: JobProps) {
    super(props);
    this._title = props.title;
    this._description = props.description;
    this._skills = props.skills;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get skills(): string[] {
    return this._skills;
  }

  update(data: Partial<JobProps>) {
    if (data.title) {
      this._title = data.title;
    }

    if (data.description) {
      this._description = data.description;
    }

    if (data.skills) {
      this._skills = data.skills;
    }

    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this._title,
      description: this._description,
      skills: this._skills,
    };
  }
}
