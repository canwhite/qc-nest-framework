import { UserService } from './user.service';
import { Controller, Get, Query } from '@nestjs/common';
import { User } from 'src/entities/User';

@Controller('user')
export class UserController {
  constructor(readonly userService: UserService) {}

  @Get('/createUser')
  createUser(@Query() user: User) {
    return this.userService.create(user);
  }
  @Get('/users')
  findAllUsers() {
    return this.userService.findAll();
  }
}
