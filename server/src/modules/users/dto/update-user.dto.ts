import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../database/entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    example: 'John',
    description: 'User first name',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'User last name',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'User role for authorization',
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid role' })
  role?: UserRole;

  @ApiPropertyOptional({
    example: true,
    description: 'User active status',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Link to associated employee record',
  })
  @IsOptional()
  @IsInt()
  employeeId?: number;
}

