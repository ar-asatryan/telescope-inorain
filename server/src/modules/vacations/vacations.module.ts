import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationsController } from './vacations.controller';
import { VacationsService } from './vacations.service';
import { Vacation } from '../../database/entities/vacation.entity';
import { Employee } from '../../database/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacation, Employee])],
  controllers: [VacationsController],
  providers: [VacationsService],
  exports: [VacationsService],
})
export class VacationsModule {}

