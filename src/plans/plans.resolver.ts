import { Resolver, Mutation, Args, Query, InputType, Field, Int, Context } from '@nestjs/graphql';
import { PlansService } from './plans.service';
import { StudyPlan } from './study-plan.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

@InputType()
class CreatePlanInput {
  @Field()
  date: string;

  @Field()
  subject: string;

  @Field({ nullable: true })
  content?: string;
}

@Resolver(() => StudyPlan)
export class PlansResolver {
  constructor(private readonly plansService: PlansService) {}

  // 플랜 생성 (JWT에서 userId 추출)
  @Mutation(() => StudyPlan)
  @UseGuards(GqlAuthGuard)
  async createPlan(
    @Args('input') input: CreatePlanInput,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.plansService.createPlan(
      user.userId,
      input.date,
      input.subject,
      input.content,
    );
  }

  // 플랜 수정 (본인만 수정 가능)
  @Mutation(() => StudyPlan)
  @UseGuards(GqlAuthGuard)
  async updatePlan(
    @Args('id', { type: () => Int }) id: number,
    @Args('content') content: string,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.plansService.updatePlan(id, content, user.userId);
  }

  // ✅ 플랜 삭제 (본인만 삭제 가능)
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePlan(
    @Args('id', { type: () => Int }) id: number,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.plansService.deletePlan(id, user.userId);
  }

  // ✅ 특정 날짜의 플랜 조회 (JWT 기반)
  @Query(() => StudyPlan, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async planByDate(
    @Args('date') date: string,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.plansService.findByDate(user.userId, date);
  }

  // ✅ 로그인한 유저의 모든 플랜 조회
  @Query(() => [StudyPlan], { nullable: true })
  @UseGuards(GqlAuthGuard)
  async plansByUser(@Context() context) {
    const user = context.req.user;
    return this.plansService.findByUser(user.userId);
  }

  // ✅ 특정 기간의 플랜 조회
  @Query(() => [StudyPlan], { nullable: true })
  @UseGuards(GqlAuthGuard)
  async plansByRange(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
    @Context() context,
  ) {
    const user = context.req.user;
    return this.plansService.findByRange(user.userId, startDate, endDate);
  }
}
