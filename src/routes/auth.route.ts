import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const controller = container.resolve(AuthController);

router.post('/register', controller.register.bind(controller));
router.post('/login', controller.login.bind(controller));

export { router as authRouter };
