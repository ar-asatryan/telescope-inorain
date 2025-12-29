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
import { Project } from './Project'
import { Employee } from './Employee'

@Entity('project_assignments')
@Unique(['projectId', 'employeeId'])
export class ProjectAssignment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  projectId: number

  @ManyToOne(() => Project, (project) => project.assignments)
  @JoinColumn({ name: 'projectId' })
  project: Project

  @Column()
  employeeId: number

  @ManyToOne(() => Employee, (employee) => employee.projectAssignments)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee

  @Column()
  role: string

  @Column({ type: 'date' })
  startDate: Date

  @Column({ nullable: true, type: 'date' })
  endDate: Date

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}



