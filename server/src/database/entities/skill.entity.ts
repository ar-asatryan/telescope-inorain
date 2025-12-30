import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { EmployeeSkill } from './employee-skill.entity';

export enum SkillCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DEVOPS = 'devops',
  DESIGN = 'design',
  MANAGEMENT = 'management',
  OTHER = 'other',
}

@Entity('skills')
@Index(['name'], { unique: true })
@Index(['category'])
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: SkillCategory,
    default: SkillCategory.OTHER,
  })
  category: SkillCategory;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @OneToMany(() => EmployeeSkill, (employeeSkill) => employeeSkill.skill)
  employeeSkills: EmployeeSkill[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

