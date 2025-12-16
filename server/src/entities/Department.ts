import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Team } from './Team'
import { Employee } from './Employee'

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ nullable: true, type: 'text' })
  description: string

  @Column({ nullable: true })
  headId: number

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'headId' })
  head: Employee

  @OneToMany(() => Team, (team) => team.department)
  teams: Team[]

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

