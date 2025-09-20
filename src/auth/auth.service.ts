import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

interface OAuthProfile {
  email: string;
  name?: string;
  provider?: string;
  providerId?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // 구글 프로필 기반 사용자 확인/생성
  async validateOAuthLogin(profile: OAuthProfile): Promise<User> {
    const { email, name, provider, providerId } = profile;

    // 1. provider + providerId 조합으로 먼저 찾기
    let user = await this.usersRepo.findOne({
      where: { provider, providerId },
    });

    if (!user) {
      // 2. providerId로는 못 찾은 경우, 이메일로 검색
      user = await this.usersRepo.findOne({ where: { email } });

      if (user) {
        // 2-1. 기존 계정 업데이트
        user.provider = provider ?? 'google';
        user.providerId = providerId!;
        if (name) user.name = name;
      } else {
        // 2-2. 신규 계정 생성
        user = this.usersRepo.create({ email, name, provider, providerId });
      }

      // 저장 (insert or update)
      user = await this.usersRepo.save(user);
      console.log('✅ User saved/updated:', user);
    } else {
      console.log('ℹ️ Existing user found:', user);
    }

    return user;
  }

  // JWT 발급
  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
