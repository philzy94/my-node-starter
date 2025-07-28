import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IAuthService } from '../interfaces/auth.interface';

@injectable()
export class AuthController {
  constructor(@inject('IAuthService') private authService: IAuthService) {}

  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.authService.register(email, password);
      res.status(201).json(user);
    } catch (e) {
      res.status(400).json({ message: (e as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await this.authService!.login(email, password);
      res.status(200).json({ token });
    } catch (e) {
      res.status(401).json({ message: (e as Error).message });
    }
  }
}
