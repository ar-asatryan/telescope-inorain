import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../database/entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async findAll(departmentId?: number): Promise<Team[]> {
    const queryBuilder = this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.department', 'department')
      .leftJoin('team.lead', 'lead')
      .addSelect(['lead.id', 'lead.firstName', 'lead.lastName'])
      .leftJoin('team.members', 'members')
      .addSelect(['members.id', 'members.firstName', 'members.lastName']);

    if (departmentId) {
      queryBuilder.where('team.departmentId = :departmentId', { departmentId });
    }

    return queryBuilder.orderBy('team.name', 'ASC').getMany();
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.department', 'department')
      .leftJoin('team.lead', 'lead')
      .addSelect(['lead.id', 'lead.firstName', 'lead.lastName', 'lead.email'])
      .leftJoin('team.members', 'members')
      .addSelect(['members.id', 'members.firstName', 'members.lastName', 'members.position'])
      .where('team.id = :id', { id })
      .getOne();

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async getMembers(id: number) {
    const team = await this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.members', 'members')
      .leftJoinAndSelect('members.skills', 'skills')
      .leftJoinAndSelect('skills.skill', 'skill')
      .where('team.id = :id', { id })
      .getOne();

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team.members;
  }

  async create(dto: CreateTeamDto): Promise<Team> {
    const team = this.teamRepository.create(dto);
    return this.teamRepository.save(team);
  }

  async update(id: number, dto: UpdateTeamDto): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    Object.assign(team, dto);
    return this.teamRepository.save(team);
  }

  async remove(id: number): Promise<void> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    if (team.members?.length) {
      throw new BadRequestException('Cannot delete team with members');
    }

    await this.teamRepository.remove(team);
  }
}

