import { container } from 'tsyringe';

import { IUserService } from '../interfaces/user.interface';
import { IAuthService } from '../interfaces/auth.interface';

import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

// Register services using interfaces as tokens
container.register<IUserService>('IUserService', { useClass: UserService });
container.register<IAuthService>('IAuthService', { useClass: AuthService });
