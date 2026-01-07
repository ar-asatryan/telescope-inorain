import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { EmployeeStatus } from '../../../database/entities/employee.entity';

export class QueryEmployeesDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by name, email, or position' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by department ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  departmentId?: number;

  @ApiPropertyOptional({ description: 'Filter by team ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  teamId?: number;

  @ApiPropertyOptional({ enum: EmployeeStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @ApiPropertyOptional({ description: 'Filter by project ID (employees assigned to this project)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  projectId?: number;
}

