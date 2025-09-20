import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansResolver } from './plans.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyPlan } from './study-plan.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyPlan, User])],
  providers: [PlansService, PlansResolver]
})
export class PlansModule {}
