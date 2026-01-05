import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillCategory } from '../../../database/entities/skill.entity';

export class CreateSkillDto {
  @ApiProperty({ example: 'React' })
  @IsString()
  @IsNotEmpty({ message: 'Skill name is required' })
  name: string;

  @ApiProperty({ enum: SkillCategory, example: SkillCategory.FRONTEND })
  @IsEnum(SkillCategory, { message: 'Invalid category' })
  category: SkillCategory;

  @ApiPropertyOptional({ example: 'JavaScript library for building UIs' })
  @IsOptional()
  @IsString()
  description?: string;
}

