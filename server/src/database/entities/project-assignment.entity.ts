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
import { Project } from './project.entity';
import { Employee } from './employee.entity';

@Entity('project_assignments')
@Unique(['projectId', 'employeeId'])
@Index(['projectId'])
@Index(['employeeId'])
@Index(['isActive'])
export class ProjectAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.projectAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  role: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ nullable: true, type: 'date' })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

