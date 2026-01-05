import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from '../../database/entities/project.entity';
import { ProjectAssignment } from '../../database/entities/project-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectAssignment])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}

