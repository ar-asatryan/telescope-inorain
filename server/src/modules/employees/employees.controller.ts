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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeesDto } from './dto/query-employees.dto';
import { AddSkillDto } from './dto/add-skill.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Employees')
@ApiBearerAuth('JWT-auth')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all employees with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'List of employees' })
  async findAll(@Query() query: QueryEmployeesDto) {
    return this.employeesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID with full details' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Employee details' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ status: 201, description: 'Employee created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    const employee = await this.employeesService.create(createEmployeeDto);
    return {
      message: 'Employee created successfully',
      data: employee,
    };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update employee' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Employee updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    const employee = await this.employeesService.update(id, updateEmployeeDto);
    return {
      message: 'Employee updated successfully',
      data: employee,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete employee' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Employee deleted successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.employeesService.remove(id);
    return {
      message: 'Employee deleted successfully',
    };
  }

  // Skills endpoints
  @Get(':id/skills')
  @ApiOperation({ summary: 'Get employee skills' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Employee skills' })
  async getSkills(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.getSkills(id);
  }

  @Post(':id/skills')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Add or update employee skill' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 201, description: 'Skill added successfully' })
  async addSkill(
    @Param('id', ParseIntPipe) id: number,
    @Body() addSkillDto: AddSkillDto,
  ) {
    const skill = await this.employeesService.addSkill(id, addSkillDto);
    return {
      message: 'Skill added successfully',
      data: skill,
    };
  }

  @Delete(':id/skills/:skillId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Remove skill from employee' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiParam({ name: 'skillId', type: 'number' })
  @ApiResponse({ status: 200, description: 'Skill removed successfully' })
  async removeSkill(
    @Param('id', ParseIntPipe) id: number,
    @Param('skillId', ParseIntPipe) skillId: number,
  ) {
    await this.employeesService.removeSkill(id, skillId);
    return {
      message: 'Skill removed successfully',
    };
  }

  // Vacations endpoint
  @Get(':id/vacations')
  @ApiOperation({ summary: 'Get employee vacations' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Employee vacations' })
  async getVacations(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.getVacations(id);
  }

  // Current projects endpoint
  @Get(':id/projects')
  @ApiOperation({ summary: 'Get employee current project assignments' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Employee current projects' })
  async getCurrentProjects(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.getCurrentProjects(id);
  }

  // Vacation balance endpoint
  @Get(':id/vacation-balance')
  @ApiOperation({ summary: 'Get employee vacation balance' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Employee vacation balance' })
  async getVacationBalance(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.calculateVacationBalance(id);
  }

  // Team chain endpoint
  @Get(':id/team-chain')
  @ApiOperation({ summary: 'Get employee team chain (reporting hierarchy)' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Employee team chain' })
  async getTeamChain(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.getTeamChain(id);
  }

  // Detailed profile endpoint (all data in one request)
  @Get(':id/profile')
  @ApiOperation({ summary: 'Get comprehensive employee profile with all related data' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Detailed employee profile' })
  async getDetailedProfile(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.getDetailedProfile(id);
  }
}

