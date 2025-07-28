// src/interfaces/user.interface.ts
import { CreateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

export interface IUserService {
  create(data: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: number): Promise<User>;
  delete(id: number): Promise<void>;
}
