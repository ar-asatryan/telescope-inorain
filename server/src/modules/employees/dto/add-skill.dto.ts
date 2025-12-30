import { IsInt, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SkillLevel } from '../../../database/entities/employee-skill.entity';

export class AddSkillDto {
  @ApiProperty({ example: 1, description: 'Skill ID' })
  @IsInt({ message: 'Skill ID is required' })
  skillId: number;

  @ApiProperty({ enum: SkillLevel, example: SkillLevel.INTERMEDIATE })
  @IsEnum(SkillLevel, { message: 'Level must be between 1 and 5' })
  level: SkillLevel;

  @ApiProperty({ example: 3.5, minimum: 0 })
  @IsNumber({}, { message: 'Years of experience must be a number' })
  @Min(0, { message: 'Years of experience must be a positive number' })
  @Max(50, { message: 'Years of experience seems too high' })
  yearsOfExperience: number;
}

