import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  //inject repository
  //相当于mp里边的mapper，薄片mapper
  constructor(
    @InjectRepository(User) // 确保在构造函数中正确注入 User Repository
    readonly userRepository: Repository<User>,
  ) {}

  //methods,注意repository方法返回的都是Promise
  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async create(user: User) {
    return this.userRepository.save(user);
  }

  async update(user: User) {
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    return this.userRepository.delete(id);
  }
}
