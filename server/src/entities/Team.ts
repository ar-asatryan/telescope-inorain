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
import { Employee } from './Employee'

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true, type: 'text' })
  description: string

  @Column()
  departmentId: number

  @ManyToOne(() => Department, (department) => department.teams)
  @JoinColumn({ name: 'departmentId' })
  department: Department

  @Column({ nullable: true })
  leadId: number

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'leadId' })
  lead: Employee

  @OneToMany(() => Employee, (employee) => employee.team)
  members: Employee[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}


