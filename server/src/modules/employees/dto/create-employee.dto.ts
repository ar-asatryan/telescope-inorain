import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  IsDateString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeStatus, EnglishLevel } from '../../../database/entities/employee.entity';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Senior Developer' })
  @IsString()
  @IsNotEmpty({ message: 'Position is required' })
  position: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  departmentId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  teamId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  managerId?: number;

  @ApiPropertyOptional({ enum: EnglishLevel, default: EnglishLevel.B1 })
  @IsOptional()
  @IsEnum(EnglishLevel)
  englishLevel?: EnglishLevel;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString({}, { message: 'Please provide a valid hire date (YYYY-MM-DD)' })
  hireDate: string;

  @ApiPropertyOptional({ enum: EmployeeStatus, default: EmployeeStatus.ACTIVE })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL' })
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Experienced developer...' })
  @IsOptional()
  @IsString()
  bio?: string;
}

