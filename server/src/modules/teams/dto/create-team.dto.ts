import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'Platform' })
  @IsString()
  @IsNotEmpty({ message: 'Team name is required' })
  name: string;

  @ApiPropertyOptional({ example: 'Core platform development' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'Department ID is required' })
  departmentId: number;

  @ApiPropertyOptional({ example: 1, description: 'Lead employee ID' })
  @IsOptional()
  @IsInt()
  leadId?: number;
}

