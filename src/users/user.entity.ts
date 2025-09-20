import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { StudyPlan } from '../plans/study-plan.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  provider: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  providerId: string;

  @OneToMany(() => StudyPlan, (plan) => plan.user)
  plans: StudyPlan[];
}
