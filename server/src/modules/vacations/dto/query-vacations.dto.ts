import { IsOptional, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { VacationType, VacationStatus } from '../../../database/entities/vacation.entity';

export class QueryVacationsDto extends PaginationDto {
  @ApiPropertyOptional({ enum: VacationStatus })
  @IsOptional()
  @IsEnum(VacationStatus)
  status?: VacationStatus;

  @ApiPropertyOptional({ enum: VacationType })
  @IsOptional()
  @IsEnum(VacationType)
  type?: VacationType;

  @ApiPropertyOptional({ description: 'Filter by employee ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  employeeId?: number;
}

