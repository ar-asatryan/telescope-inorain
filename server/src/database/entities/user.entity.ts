import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Employee } from './employee.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['role'])
@Index(['deletedAt'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  // ================================================
  // SECURITY FIELDS
  // ================================================

  /** Last successful login timestamp */
  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  /** Password change timestamp - used to invalidate old tokens */
  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt: Date | null;

  /** Count of consecutive failed login attempts */
  @Column({ type: 'integer', default: 0 })
  failedLoginAttempts: number;

  /** Account locked until this timestamp */
  @Column({ type: 'timestamp', nullable: true })
  lockedUntil: Date | null;

  /** Email verification timestamp - null means not verified */
  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date | null;

  // ================================================
  // SESSION
  // ================================================

  @Column({ nullable: true, type: 'varchar' })
  refreshToken: string | null;

  // ================================================
  // EMPLOYEE RELATION (One-to-One)
  // ================================================

  @Column({ nullable: true })
  employeeId: number | null;

  @OneToOne(() => Employee, (employee) => employee.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

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
  // HOOKS
  // ================================================

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2')) {
      this.password = await bcrypt.hash(this.password, 12);
      this.passwordChangedAt = new Date();
    }
  }

  // ================================================
  // METHODS
  // ================================================

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  /** Check if user account is currently locked */
  isLocked(): boolean {
    if (!this.lockedUntil) return false;
    return new Date() < this.lockedUntil;
  }

  /** Check if email is verified */
  isEmailVerified(): boolean {
    return this.emailVerifiedAt !== null;
  }

  /** Check if password was changed after a given timestamp (for token invalidation) */
  changedPasswordAfter(timestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
      return timestamp < changedTimestamp;
    }
    return false;
  }

  // Virtual property
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

