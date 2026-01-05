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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Skills')
@ApiBearerAuth('JWT-auth')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({ status: 200, description: 'List of skills' })
  async findAll() {
    return this.skillsService.findAll();
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Get skills grouped by category' })
  @ApiResponse({ status: 200, description: 'Skills by category' })
  async findByCategory() {
    return this.skillsService.findByCategory();
  }

  @Get('matrix')
  @ApiOperation({ summary: 'Get skill matrix with employee counts' })
  @ApiResponse({ status: 200, description: 'Skill matrix' })
  async getMatrix() {
    return this.skillsService.getMatrix();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Skill details' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  async create(@Body() dto: CreateSkillDto) {
    const skill = await this.skillsService.create(dto);
    return { message: 'Skill created successfully', data: skill };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update skill' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Skill updated successfully' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSkillDto) {
    const skill = await this.skillsService.update(id, dto);
    return { message: 'Skill updated successfully', data: skill };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete skill' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Skill deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.skillsService.remove(id);
    return { message: 'Skill deleted successfully' };
  }
}

