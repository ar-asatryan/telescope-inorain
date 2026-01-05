import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Departments')
@ApiBearerAuth('JWT-auth')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({ status: 200, description: 'List of departments' })
  async findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID with teams and employees' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Department details' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, description: 'Department created successfully' })
  async create(@Body() dto: CreateDepartmentDto) {
    const department = await this.departmentsService.create(dto);
    return { message: 'Department created successfully', data: department };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update department' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Department updated successfully' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDepartmentDto) {
    const department = await this.departmentsService.update(id, dto);
    return { message: 'Department updated successfully', data: department };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete department' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Department deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.departmentsService.remove(id);
    return { message: 'Department deleted successfully' };
  }
}

