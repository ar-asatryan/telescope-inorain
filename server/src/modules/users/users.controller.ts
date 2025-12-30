import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@Roles(UserRole.ADMIN) // All routes require admin role
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: user,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      data: user,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return {
      message: 'User deleted successfully',
    };
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Toggle user active status' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'User status toggled' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    const result = await this.usersService.toggleStatus(id);
    return {
      message: `User ${result.isActive ? 'activated' : 'deactivated'} successfully`,
      data: result,
    };
  }
}

