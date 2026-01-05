import { IsInt, IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddAssignmentDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'Employee ID is required' })
  employeeId: number;

  @ApiProperty({ example: 'Lead Developer' })
  @IsString()
  @IsNotEmpty({ message: 'Role is required' })
  role: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString({}, { message: 'Please provide a valid start date' })
  startDate: string;

  @ApiPropertyOptional({ example: '2024-06-30' })
  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid end date' })
  endDate?: string;
}

