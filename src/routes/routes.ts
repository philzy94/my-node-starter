// src/routes/routes.ts
import { Router } from 'express';
import userRoutes from './user.route';
import { authRouter } from './auth.route';
import testRoutes from './test.route';
import categoryRoutes from './category.route';
import myProductRoutes from './myProduct.route';

const router = Router();

// Register all routes
router.use('/users', userRoutes);
router.use('/auth', authRouter);
router.use('/tests', testRoutes);
router.use('/categorys', categoryRoutes);

router.use('/myProducts', myProductRoutes);
export default router; 