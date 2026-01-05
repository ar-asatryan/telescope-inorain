import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Department } from './department.entity';
import { Team } from './team.entity';
import { EmployeeSkill } from './employee-skill.entity';
import { Vacation } from './vacation.entity';
import { ProjectAssignment } from './project-assignment.entity';

export enum EmployeeStatus {
  ACTIVE = 'active',
  VACATION = 'vacation',
  INACTIVE = 'inactive',
}

export enum EnglishLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

@Entity('employees')
@Index(['email'], { unique: true })
@Index(['status'])
@Index(['departmentId'])
@Index(['teamId'])
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  position: string;

  @Column({ nullable: true })
  departmentId: number;

  @ManyToOne(() => Department, (department) => department.employees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: true })
  teamId: number;

  @ManyToOne(() => Team, (team) => team.members, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column({ nullable: true })
  managerId: number;

  @ManyToOne(() => Employee, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'managerId' })
  manager: Employee;

  @Column({
    type: 'enum',
    enum: EnglishLevel,
    default: EnglishLevel.B1,
  })
  englishLevel: EnglishLevel;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @OneToMany(() => EmployeeSkill, (employeeSkill) => employeeSkill.employee, {
    cascade: true,
  })
  skills: EmployeeSkill[];

  @OneToMany(() => Vacation, (vacation) => vacation.employee, {
    cascade: true,
  })
  vacations: Vacation[];

  @OneToMany(() => ProjectAssignment, (assignment) => assignment.employee, {
    cascade: true,
  })
  projectAssignments: ProjectAssignment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

