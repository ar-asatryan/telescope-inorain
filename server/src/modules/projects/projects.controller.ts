import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { AddAssignmentDto } from './dto/add-assignment.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects with pagination' })
  @ApiResponse({ status: 200, description: 'List of projects' })
  async findAll(@Query() query: QueryProjectsDto) {
    return this.projectsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Project details' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Get(':id/team')
  @ApiOperation({ summary: 'Get project team members' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Project team' })
  async getTeam(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.getTeam(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async create(@Body() dto: CreateProjectDto) {
    const project = await this.projectsService.create(dto);
    return { message: 'Project created successfully', data: project };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    const project = await this.projectsService.update(id, dto);
    return { message: 'Project updated successfully', data: project };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete project' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.projectsService.remove(id);
    return { message: 'Project deleted successfully' };
  }

  @Post(':id/assignments')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Add team member to project' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 201, description: 'Team member added' })
  async addAssignment(@Param('id', ParseIntPipe) id: number, @Body() dto: AddAssignmentDto) {
    const assignment = await this.projectsService.addAssignment(id, dto);
    return { message: 'Team member added successfully', data: assignment };
  }

  @Delete(':id/assignments/:assignmentId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Remove team member from project' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiParam({ name: 'assignmentId', type: 'number' })
  @ApiResponse({ status: 200, description: 'Team member removed' })
  async removeAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ) {
    await this.projectsService.removeAssignment(assignmentId);
    return { message: 'Team member removed successfully' };
  }
}

