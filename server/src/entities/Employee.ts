import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Department } from './Department'
import { Team } from './Team'
import { EmployeeSkill } from './EmployeeSkill'
import { Vacation } from './Vacation'
import { ProjectAssignment } from './ProjectAssignment'

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
export class Employee {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column()
  position: string

  @Column({ nullable: true })
  departmentId: number

  @ManyToOne(() => Department, (department) => department.employees, { nullable: true })
  @JoinColumn({ name: 'departmentId' })
  department: Department

  @Column({ nullable: true })
  teamId: number

  @ManyToOne(() => Team, (team) => team.members, { nullable: true })
  @JoinColumn({ name: 'teamId' })
  team: Team

  @Column({ nullable: true })
  managerId: number

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'managerId' })
  manager: Employee

  @Column({
    type: 'enum',
    enum: EnglishLevel,
    default: EnglishLevel.B1,
  })
  englishLevel: EnglishLevel

  @Column({ type: 'date' })
  hireDate: Date

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus

  @Column({ nullable: true })
  avatarUrl: string

  @Column({ nullable: true, type: 'text' })
  bio: string

  @OneToMany(() => EmployeeSkill, (employeeSkill) => employeeSkill.employee)
  skills: EmployeeSkill[]

  @OneToMany(() => Vacation, (vacation) => vacation.employee)
  vacations: Vacation[]

  @OneToMany(() => ProjectAssignment, (assignment) => assignment.employee)
  projectAssignments: ProjectAssignment[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Virtual property for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}



