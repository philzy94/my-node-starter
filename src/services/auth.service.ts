import { injectable } from 'tsyringe';
import { IAuthService } from '../interfaces/auth.interface';
import { User } from '../entities/user.entity';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { AppDataSource } from '../config/typeorm.config';

@injectable()
export class AuthService implements IAuthService {
  private userRepo = AppDataSource.getRepository(User);

  async register(email: string, password: string): Promise<User> {
    const existing = await this.userRepo.findOneBy({ email });
    if (existing) throw new Error('User already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashed });
    return await this.userRepo.save(user);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    return generateToken(user.id);
  }
}
