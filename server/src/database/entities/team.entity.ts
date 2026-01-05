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
import { Employee } from './employee.entity';

@Entity('teams')
@Index(['departmentId'])
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column()
  departmentId: number;

  @ManyToOne(() => Department, (department) => department.teams, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: true })
  leadId: number;

  @ManyToOne(() => Employee, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'leadId' })
  lead: Employee;

  @OneToMany(() => Employee, (employee) => employee.team)
  members: Employee[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

