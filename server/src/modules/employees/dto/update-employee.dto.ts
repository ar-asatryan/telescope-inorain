import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @ApiPropertyOptional({
    example: '2025-01-15',
    description: 'Termination date when employee left the company (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid termination date (YYYY-MM-DD)' })
  terminationDate?: string;
}

