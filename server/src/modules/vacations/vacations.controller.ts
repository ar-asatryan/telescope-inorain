import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { VacationsService } from './vacations.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { QueryVacationsDto } from './dto/query-vacations.dto';
import { RejectVacationDto } from './dto/reject-vacation.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, User } from '../../database/entities/user.entity';

@ApiTags('Vacations')
@ApiBearerAuth('JWT-auth')
@Controller('vacations')
export class VacationsController {
  constructor(private readonly vacationsService: VacationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vacation requests with pagination' })
  @ApiResponse({ status: 200, description: 'List of vacations' })
  async findAll(@Query() query: QueryVacationsDto) {
    return this.vacationsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vacation by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Vacation details' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vacationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vacation request' })
  @ApiResponse({ status: 201, description: 'Vacation request created' })
  async create(@Body() dto: CreateVacationDto) {
    const vacation = await this.vacationsService.create(dto);
    return { message: 'Vacation request created successfully', data: vacation };
  }

  @Put(':id/approve')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Approve vacation request' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Vacation approved' })
  async approve(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    const vacation = await this.vacationsService.approve(id, user.id);
    return { message: 'Vacation request approved', data: vacation };
  }

  @Put(':id/reject')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Reject vacation request' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Vacation rejected' })
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() dto: RejectVacationDto,
  ) {
    const vacation = await this.vacationsService.reject(id, user.id, dto.rejectionReason);
    return { message: 'Vacation request rejected', data: vacation };
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel vacation request' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Vacation cancelled' })
  async cancel(@Param('id', ParseIntPipe) id: number) {
    const vacation = await this.vacationsService.cancel(id);
    return { message: 'Vacation request cancelled', data: vacation };
  }
}

