#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function writeIfNotExists(filePath, content, label) {
  if (fs.existsSync(filePath)) {
    console.log(`⚠️  ${label} already exists: ${filePath}`);
    return false;
  }
  
  // Ensure the directory exists before writing the file
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ ${label} created: ${filePath}`);
  return true;
}

// 1. User Entity
const userEntity = `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
`;
writeIfNotExists(
  path.join(__dirname, '../src/entities/user.entity.ts'),
  userEntity,
  'User entity'
);

// 2. Auth DTOs
const authDto = `import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
`;
writeIfNotExists(
  path.join(__dirname, '../src/dtos/auth.dto.ts'),
  authDto,
  'Auth DTOs'
);

// 3. Auth Interface
const authInterface = `import { User } from '../entities/user.entity';

export interface IAuthService {
  register(email: string, password: string): Promise<User>;
  login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>;
  logout(userId: number): Promise<void>;
  refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }>;
  validateUser(email: string, password: string): Promise<User | null>;
}
`;
writeIfNotExists(
  path.join(__dirname, '../src/interfaces/auth.interface.ts'),
  authInterface,
  'Auth interface'
);

// 4. Auth Service
const authService = `import { injectable } from 'tsyringe';
import { IAuthService } from '../interfaces/auth.interface';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../config/typeorm.config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userRepo = AppDataSource.getRepository(User);

@injectable()
export class AuthService implements IAuthService {
  async register(email: string, password: string): Promise<User> {
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) throw new Error('Email already in use');
    const hashed = await bcrypt.hash(password, 10);
    const user = userRepo.create({ email, password: hashed });
    return userRepo.save(user);
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await userRepo.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    return this.generateTokens(user);
  }

  async logout(userId: number): Promise<void> {
    // For stateless JWT, logout is handled on client (or by blacklisting tokens)
    return;
  }

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET as jwt.Secret);
      const user = await userRepo.findOne({ where: { id: (payload as any).id } });
      if (!user) throw new Error('User not found');
      return this.generateTokens(user);
    } catch {
      throw new Error('Invalid refresh token');
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await userRepo.findOne({ where: { email } });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  private generateTokens(user: User) {
    const payload = { id: user.id, email: user.email };
    // @ts-expect-error: type definition issue with jsonwebtoken v9
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
    // @ts-expect-error: type definition issue with jsonwebtoken v9
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as jwt.Secret,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
    return { accessToken, refreshToken };
  }
}
`;
writeIfNotExists(
  path.join(__dirname, '../src/services/auth.service.ts'),
  authService,
  'Auth service'
);

// 5. Auth Middleware
const authMiddleware = `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
`;
writeIfNotExists(
  path.join(__dirname, '../src/middleware/auth.middleware.ts'),
  authMiddleware,
  'Auth middleware'
);

// 6. Auth Controller
const authController = `import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

@autoInjectable()
export class AuthController {
  constructor(private authService?: AuthService) {}

  async register(req: Request, res: Response) {
    try {
      const dto: RegisterDto = req.body;
      const user = await this.authService!.register(dto.email, dto.password);
      res.status(201).json({ id: user.id, email: user.email });
    } catch (e) {
      res.status(400).json({ message: (e as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const dto: LoginDto = req.body;
      const tokens = await this.authService!.login(dto.email, dto.password);
      res.status(200).json(tokens);
    } catch (e) {
      res.status(401).json({ message: (e as Error).message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.authService!.refreshToken(refreshToken);
      res.status(200).json(tokens);
    } catch (e) {
      res.status(401).json({ message: (e as Error).message });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      res.status(200).json(user);
    } catch (e) {
      res.status(401).json({ message: (e as Error).message });
    }
  }
}
`;
writeIfNotExists(
  path.join(__dirname, '../src/controllers/auth.controller.ts'),
  authController,
  'Auth controller'
);

// 7. Auth Route
const authRoute = `import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = container.resolve(AuthController);

router.post('/register', controller.register.bind(controller));
router.post('/login', controller.login.bind(controller));
router.post('/refresh', controller.refresh.bind(controller));
router.get('/me', authMiddleware, controller.me.bind(controller));

export default router;
`;
writeIfNotExists(
  path.join(__dirname, '../src/routes/auth.route.ts'),
  authRoute,
  'Auth route'
);

// 8. Register route in routes.ts
const routesTsPath = path.join(__dirname, '../src/routes/routes.ts');
if (fs.existsSync(routesTsPath)) {
  let routesTsContent = fs.readFileSync(routesTsPath, 'utf8');
  const importStatement = `import authRoutes from './auth.route';`;
  if (!routesTsContent.includes(importStatement)) {
    const lastImportIndex = routesTsContent.lastIndexOf('import');
    const lastImportLine = routesTsContent.indexOf('\n', lastImportIndex) + 1;
    routesTsContent = routesTsContent.slice(0, lastImportLine) + importStatement + '\n' + routesTsContent.slice(lastImportLine);
  }
  const routeRegistration = `router.use('/auth', authRoutes);`;
  if (!routesTsContent.includes(routeRegistration)) {
    const exportIndex = routesTsContent.indexOf('export default router;');
    routesTsContent = routesTsContent.slice(0, exportIndex) + routeRegistration + '\n' + routesTsContent.slice(exportIndex);
  }
  fs.writeFileSync(routesTsPath, routesTsContent);
  console.log('✅ Auth route registered in routes.ts');
}

console.log('\n🎉 Authentication scaffold complete!'); 