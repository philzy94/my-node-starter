// src/routes/test.route.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { TestController } from '../controllers/test.controller';

const router = Router();
const controller = container.resolve(TestController);

router.post('/', controller.create.bind(controller));
router.get('/', controller.findAll.bind(controller));
router.get('/:id', controller.findOne.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
