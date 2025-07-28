// src/services/user.service.ts
import { injectable } from 'tsyringe';
import { IUserService } from '../interfaces/user.interface';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/user.dto';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/typeorm.config';

@injectable()
export class UserService implements IUserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async create(data: CreateUserDto): Promise<User> {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({ ...data, password: hashed });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new Error('User not found');
    return user;
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
