import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill, SkillCategory } from '../../database/entities/skill.entity';
import { EmployeeSkill } from '../../database/entities/employee-skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(EmployeeSkill)
    private readonly employeeSkillRepository: Repository<EmployeeSkill>,
  ) {}

  async findAll(): Promise<Skill[]> {
    return this.skillRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findByCategory(): Promise<Record<SkillCategory, Skill[]>> {
    const skills = await this.skillRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    });

    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<SkillCategory, Skill[]>);
  }

  /**
   * Get skill matrix with employee counts and average levels
   * Optimized aggregation query
   */
  async getMatrix() {
    return this.employeeSkillRepository
      .createQueryBuilder('es')
      .leftJoin('es.skill', 'skill')
      .select('skill.id', 'skillId')
      .addSelect('skill.name', 'name')
      .addSelect('skill.category', 'category')
      .addSelect('COUNT(es.employeeId)::int', 'count')
      .addSelect('ROUND(AVG(es.level)::numeric, 2)', 'avgLevel')
      .groupBy('skill.id')
      .addGroupBy('skill.name')
      .addGroupBy('skill.category')
      .orderBy('skill.category', 'ASC')
      .addOrderBy('count', 'DESC')
      .getRawMany();
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.skillRepository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    return skill;
  }

  async create(dto: CreateSkillDto): Promise<Skill> {
    const existing = await this.skillRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Skill with this name already exists');
    }

    const skill = this.skillRepository.create(dto);
    return this.skillRepository.save(skill);
  }

  async update(id: number, dto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.skillRepository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    if (dto.name && dto.name !== skill.name) {
      const existing = await this.skillRepository.findOne({ where: { name: dto.name } });
      if (existing) {
        throw new ConflictException('Skill with this name already exists');
      }
    }

    Object.assign(skill, dto);
    return this.skillRepository.save(skill);
  }

  async remove(id: number): Promise<void> {
    const skill = await this.skillRepository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    await this.skillRepository.remove(skill);
  }
}

