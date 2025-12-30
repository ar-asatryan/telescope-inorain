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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Teams')
@ApiBearerAuth('JWT-auth')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiQuery({ name: 'departmentId', required: false, type: 'number' })
  @ApiResponse({ status: 200, description: 'List of teams' })
  async findAll(@Query('departmentId') departmentId?: number) {
    return this.teamsService.findAll(departmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team by ID with members' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Team details' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get team members with skills' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Team members' })
  async getMembers(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.getMembers(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'Team created successfully' })
  async create(@Body() dto: CreateTeamDto) {
    const team = await this.teamsService.create(dto);
    return { message: 'Team created successfully', data: team };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update team' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Team updated successfully' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTeamDto) {
    const team = await this.teamsService.update(id, dto);
    return { message: 'Team updated successfully', data: team };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete team' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Team deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.teamsService.remove(id);
    return { message: 'Team deleted successfully' };
  }
}

