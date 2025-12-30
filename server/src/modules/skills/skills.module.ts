import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { Skill } from '../../database/entities/skill.entity';
import { EmployeeSkill } from '../../database/entities/employee-skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, EmployeeSkill])],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}

