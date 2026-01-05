import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ProjectStatus } from '../../../database/entities/project.entity';

export class QueryProjectsDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ProjectStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}

