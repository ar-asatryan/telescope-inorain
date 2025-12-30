import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RejectVacationDto {
  @ApiPropertyOptional({ example: 'Team is understaffed during this period' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

