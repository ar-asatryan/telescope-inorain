import { IsInt, IsEnum, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VacationType } from '../../../database/entities/vacation.entity';

export class CreateVacationDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'Employee ID is required' })
  employeeId: number;

  @ApiProperty({ enum: VacationType, example: VacationType.VACATION })
  @IsEnum(VacationType, { message: 'Invalid vacation type' })
  type: VacationType;

  @ApiProperty({ example: '2024-07-01' })
  @IsDateString({}, { message: 'Please provide a valid start date' })
  startDate: string;

  @ApiProperty({ example: '2024-07-15' })
  @IsDateString({}, { message: 'Please provide a valid end date' })
  endDate: string;

  @ApiPropertyOptional({ example: 'Annual vacation' })
  @IsOptional()
  @IsString()
  reason?: string;
}

