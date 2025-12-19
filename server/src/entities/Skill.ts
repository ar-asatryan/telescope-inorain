import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { EmployeeSkill } from './EmployeeSkill'

export enum SkillCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DEVOPS = 'devops',
  DESIGN = 'design',
  MANAGEMENT = 'management',
  OTHER = 'other',
}

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({
    type: 'enum',
    enum: SkillCategory,
    default: SkillCategory.OTHER,
  })
  category: SkillCategory

  @Column({ nullable: true, type: 'text' })
  description: string

  @OneToMany(() => EmployeeSkill, (employeeSkill) => employeeSkill.skill)
  employeeSkills: EmployeeSkill[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}


