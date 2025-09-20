import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../users/user.entity';

@ObjectType()
@Entity('study_plans')
export class StudyPlan {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  date: string;

  @Field()
  @Column()
  subject: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  content?: string;

  @ManyToOne(() => User, (user) => user.plans, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;
}
