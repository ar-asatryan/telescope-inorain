import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ProjectAssignment } from './project-assignment.entity';

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('projects')
@Index(['status'])
@Index(['priority'])
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
  })
  status: ProjectStatus;

  @Column({
    type: 'enum',
    enum: ProjectPriority,
    default: ProjectPriority.MEDIUM,
  })
  priority: ProjectPriority;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ nullable: true, type: 'date' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress: number;

  @OneToMany(() => ProjectAssignment, (assignment) => assignment.project, {
    cascade: true,
  })
  assignments: ProjectAssignment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

