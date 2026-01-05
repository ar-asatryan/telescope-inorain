import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Employee } from './employee.entity';
import { Skill } from './skill.entity';

export enum SkillLevel {
  BEGINNER = 1,
  ELEMENTARY = 2,
  INTERMEDIATE = 3,
  ADVANCED = 4,
  EXPERT = 5,
}

@Entity('employee_skills')
@Unique(['employeeId', 'skillId'])
@Index(['employeeId'])
@Index(['skillId'])
export class EmployeeSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.skills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  skillId: number;

  @ManyToOne(() => Skill, (skill) => skill.employeeSkills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skillId' })
  skill: Skill;

  @Column({
    type: 'enum',
    enum: SkillLevel,
    default: SkillLevel.BEGINNER,
  })
  level: SkillLevel;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  yearsOfExperience: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

