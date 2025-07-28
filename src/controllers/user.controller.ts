// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CreateUserDto } from '../dtos/user.dto';
import { IUserService } from '../interfaces/user.interface';

@injectable()
export class UserController {
  constructor(
    @inject('IUserService') private userService: IUserService
  ) {}
  
  async create(req: Request, res: Response) {
    try {
      const dto = plainToInstance(CreateUserDto, req.body);
      await validateOrReject(dto);
      const user = await this.userService!.create(dto);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

  async findAll(req: Request, res: Response) {
    const users = await this.userService!.findAll();
    res.json(users);
  }

  async findOne(req: Request, res: Response) {
    try {
      const user = await this.userService!.findOne(Number(req.params.id));
      res.json(user);
    } catch {
      res.status(404).json({ message: 'User not found' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.userService!.delete(Number(req.params.id));
      res.status(204).send();
    } catch {
      res.status(404).json({ message: 'User not found' });
    }
  }
}
