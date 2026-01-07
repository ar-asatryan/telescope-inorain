import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from '../../database/entities/employee.entity';
import { EmployeeSkill } from '../../database/entities/employee-skill.entity';
import { Vacation } from '../../database/entities/vacation.entity';
import { ProjectAssignment } from '../../database/entities/project-assignment.entity';
import { Team } from '../../database/entities/team.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      EmployeeSkill,
      Vacation,
      ProjectAssignment,
      Team,
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}

