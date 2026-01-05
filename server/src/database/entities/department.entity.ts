import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Team } from './team.entity';
import { Employee } from './employee.entity';

@Entity('departments')
@Index(['name'], { unique: true })
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  headId: number;

  @ManyToOne(() => Employee, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'headId' })
  head: Employee;

  @OneToMany(() => Team, (team) => team.department, {
    cascade: true,
  })
  teams: Team[];

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

