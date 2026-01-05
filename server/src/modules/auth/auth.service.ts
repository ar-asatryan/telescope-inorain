import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { User, UserRole } from '../../database/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user
    const user = this.userRepository.create({
      email: dto.email.toLowerCase(),
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role || UserRole.EMPLOYEE,
    });

    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token hash
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<{ user: Partial<User>; tokens: AuthTokens }> {
    // Find user with password
    const user = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'isActive'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token hash
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async logout(userId: number): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  async getCurrentUser(userId: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async refreshTokens(userId: number): Promise<AuthTokens> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
    });

    return user;
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn', '30d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { refreshToken: hashedRefreshToken });
  }

  private sanitizeUser(user: User): Partial<User> {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
    };
  }
}

