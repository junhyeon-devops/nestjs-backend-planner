import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async createUser(email: string) {
    const user = this.usersRepo.create({ email });
    return this.usersRepo.save(user);
  }

  async updateUser(id: number, email: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if(!user) {
        throw new Error('유저를 찾을 수 없습니다.');
    }
    user.email = email;
    return this.usersRepo.save(user);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.usersRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findAll() {
    return this.usersRepo.find();
  }
}
