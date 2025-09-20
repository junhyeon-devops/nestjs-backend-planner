import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('email') email: string) {
    return this.usersService.createUser(email);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: number,
    @Args('email') email: string,
  ) {
    return this.usersService.updateUser(id, email);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  @Query(() => [User])
  async allUsers() {
    return this.usersService.findAll();
  }
}
