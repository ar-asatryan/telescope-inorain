import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm'
import { Employee } from './Employee'
import { Skill } from './Skill'

export enum SkillLevel {
  BEGINNER = 1,
  ELEMENTARY = 2,
  INTERMEDIATE = 3,
  ADVANCED = 4,
  EXPERT = 5,
}

@Entity('employee_skills')
@Unique(['employeeId', 'skillId'])
export class EmployeeSkill {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  employeeId: number

  @ManyToOne(() => Employee, (employee) => employee.skills)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee

  @Column()
  skillId: number

  @ManyToOne(() => Skill, (skill) => skill.employeeSkills)
  @JoinColumn({ name: 'skillId' })
  skill: Skill

  @Column({
    type: 'enum',
    enum: SkillLevel,
    default: SkillLevel.BEGINNER,
  })
  level: SkillLevel

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  yearsOfExperience: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}



