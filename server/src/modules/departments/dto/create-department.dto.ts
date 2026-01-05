import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Engineering' })
  @IsString()
  @IsNotEmpty({ message: 'Department name is required' })
  name: string;

  @ApiPropertyOptional({ example: 'Software development team' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1, description: 'Head employee ID' })
  @IsOptional()
  @IsInt()
  headId?: number;
}

