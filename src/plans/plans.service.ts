import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { StudyPlan } from './study-plan.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(StudyPlan)
    private readonly plansRepo: Repository<StudyPlan>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // 플랜 생성
  async createPlan(userId: number, date: string, subject: string, content?: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with id=${userId} not found`);
    }

    const plan = this.plansRepo.create({
      date,
      subject,
      content,
      userId: user.id,
    });
    return this.plansRepo.save(plan);
  }

  // 플랜 수정
  async updatePlan(id: number, content: string, userId: number) {
    const plan = await this.plansRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });

    if (!plan) {
      throw new Error('수정할 권한이 없거나 계획이 존재하지 않습니다.');
    }

    plan.content = content;
    return this.plansRepo.save(plan);
  }

  // 플랜 삭제
  async deletePlan(id: number, userId: number): Promise<boolean> {
    const result: DeleteResult = await this.plansRepo.delete({
      id,
      user: { id: userId },
    });
    return (result.affected ?? 0) > 0;
  }

  // 특정 날짜의 플랜 조회
  async findByDate(userId: number, date: string) {
    return this.plansRepo.findOne({
      where: { user: { id: userId }, date },
      relations: ['user'],
    });
  }

  // 유저별 모든 플랜 조회
  async findByUser(userId: number) {
    return this.plansRepo.find({
      where: { user: { id: userId } },
      order: { date: 'ASC' },
      relations: ['user'],
    });
  }

  // 기간별 플랜 조회
  async findByRange(userId: number, startDate: string, endDate: string) {
    return this.plansRepo
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('plan.date BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .orderBy('plan.date', 'ASC')
      .getMany();
  }
}
