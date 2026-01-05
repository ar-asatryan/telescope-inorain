import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus, ProjectPriority } from '../../../database/entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({ example: 'Platform Redesign' })
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  name: string;

  @ApiPropertyOptional({ example: 'Complete redesign of the main platform UI' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ProjectStatus, default: ProjectStatus.PLANNING })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ enum: ProjectPriority, default: ProjectPriority.MEDIUM })
  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString({}, { message: 'Please provide a valid start date' })
  startDate: string;

  @ApiPropertyOptional({ example: '2024-06-30' })
  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid end date' })
  endDate?: string;

  @ApiPropertyOptional({ example: 0, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;
}

