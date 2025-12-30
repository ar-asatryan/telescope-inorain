import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Employee } from './employee.entity';

export enum VacationType {
  VACATION = 'vacation',
  SICK_LEAVE = 'sick_leave',
  DAY_OFF = 'day_off',
  REMOTE = 'remote',
}

export enum VacationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('vacations')
@Index(['employeeId'])
@Index(['status'])
@Index(['startDate', 'endDate'])
export class Vacation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.vacations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({
    type: 'enum',
    enum: VacationType,
    default: VacationType.VACATION,
  })
  type: VacationType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: VacationStatus,
    default: VacationStatus.PENDING,
  })
  status: VacationStatus;

  @Column({ nullable: true, type: 'text' })
  reason: string;

  @Column({ nullable: true })
  approvedById: number;

  @ManyToOne(() => Employee, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'approvedById' })
  approvedBy: Employee;

  @Column({ nullable: true, type: 'timestamp' })
  approvedAt: Date;

  @Column({ nullable: true, type: 'text' })
  rejectionReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property: Calculate number of days
  get days(): number {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
}

