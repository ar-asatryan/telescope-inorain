import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { UserRole } from '../../../database/entities/user.entity';

export class QueryUsersDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search by name or email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'Filter by role',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

