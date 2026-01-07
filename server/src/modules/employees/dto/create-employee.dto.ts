import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  IsDateString,
  IsUrl,
  IsTimeZone,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EmployeeStatus,
  EnglishLevel,
  EmploymentType,
  WorkLocation,
} from '../../../database/entities/employee.entity';

export class CreateEmployeeDto {
  // ================================================
  // PERSONAL INFO
  // ================================================

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Work email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiPropertyOptional({ example: 'john.personal@gmail.com', description: 'Personal email for contact after leaving' })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid personal email address' })
  personalEmail?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1990-05-15', description: 'Birth date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid birth date (YYYY-MM-DD)' })
  birthDate?: string;

  // ================================================
  // WORK INFO
  // ================================================

  @ApiProperty({ example: 'Senior Developer', description: 'Job position/title' })
  @IsString()
  @IsNotEmpty({ message: 'Position is required' })
  position: string;

  @ApiPropertyOptional({ enum: EmploymentType, default: EmploymentType.FULL_TIME, description: 'Type of employment' })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({ enum: WorkLocation, default: WorkLocation.OFFICE, description: 'Work location preference' })
  @IsOptional()
  @IsEnum(WorkLocation)
  workLocation?: WorkLocation;

  @ApiPropertyOptional({ example: 'America/New_York', description: 'IANA timezone (e.g., America/New_York, Europe/London)' })
  @IsOptional()
  @IsString()
  timezone?: string;

  // ================================================
  // ORGANIZATION
  // ================================================

  @ApiPropertyOptional({ example: 1, description: 'Department ID' })
  @IsOptional()
  @IsInt()
  departmentId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Team ID' })
  @IsOptional()
  @IsInt()
  teamId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Manager employee ID' })
  @IsOptional()
  @IsInt()
  managerId?: number;

  // ================================================
  // HR DATA
  // ================================================

  @ApiPropertyOptional({ enum: EnglishLevel, default: EnglishLevel.B1, description: 'English proficiency level' })
  @IsOptional()
  @IsEnum(EnglishLevel)
  englishLevel?: EnglishLevel;

  @ApiProperty({ example: '2024-01-15', description: 'Hire date (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'Please provide a valid hire date (YYYY-MM-DD)' })
  hireDate: string;

  @ApiPropertyOptional({ enum: EmployeeStatus, default: EmployeeStatus.ACTIVE, description: 'Employment status' })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  // ================================================
  // PROFILE
  // ================================================

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'Profile avatar URL' })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL' })
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Experienced developer with 10+ years...', description: 'Biography/description' })
  @IsOptional()
  @IsString()
  bio?: string;
}

