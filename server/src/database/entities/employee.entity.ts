import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Department } from './department.entity';
import { Team } from './team.entity';
import { EmployeeSkill } from './employee-skill.entity';
import { Vacation } from './vacation.entity';
import { ProjectAssignment } from './project-assignment.entity';
import { User } from './user.entity';

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

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACTOR = 'contractor',
  INTERN = 'intern',
}

export enum WorkLocation {
  REMOTE = 'remote',
  OFFICE = 'office',
  HYBRID = 'hybrid',
}

@Entity('employees')
@Index(['email'], { unique: true })
@Index(['status'])
@Index(['departmentId'])
@Index(['teamId'])
@Index(['employmentType'])
@Index(['workLocation'])
@Index(['deletedAt'])
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  // ================================================
  // PERSONAL INFO
  // ================================================

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  /** Personal email - for contact after they leave */
  @Column({ nullable: true })
  personalEmail: string;

  @Column({ nullable: true })
  phone: string;

  /** Birth date - optional, for HR compliance */
  @Column({ type: 'date', nullable: true })
  birthDate: Date | null;

  // ================================================
  // WORK INFO
  // ================================================

  @Column()
  position: string;

  @Column({
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({
    type: 'enum',
    enum: WorkLocation,
    default: WorkLocation.OFFICE,
  })
  workLocation: WorkLocation;

  /** Timezone for distributed teams - e.g., 'America/New_York' */
  @Column({ default: 'UTC' })
  timezone: string;

  // ================================================
  // ORGANIZATION
  // ================================================

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

  // ================================================
  // HR DATA
  // ================================================

  @Column({
    type: 'enum',
    enum: EnglishLevel,
    default: EnglishLevel.B1,
  })
  englishLevel: EnglishLevel;

  @Column({ type: 'date' })
  hireDate: Date;

  /** Date when employee left the company */
  @Column({ type: 'date', nullable: true })
  terminationDate: Date | null;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus;

  // ================================================
  // PROFILE
  // ================================================

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  // ================================================
  // RELATIONS
  // ================================================

  /** Bidirectional relation to User (authentication account) */
  @OneToOne(() => User, (user) => user.employee, { nullable: true })
  user: User;

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

  // ================================================
  // AUDIT FIELDS
  // ================================================

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /** Soft delete timestamp */
  @DeleteDateColumn()
  deletedAt: Date | null;

  // ================================================
  // VIRTUAL PROPERTIES
  // ================================================

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /** Check if employee is currently active */
  isCurrentlyEmployed(): boolean {
    return this.status === EmployeeStatus.ACTIVE && !this.terminationDate;
  }
}

