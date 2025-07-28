// src/main.ts
import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/typeorm.config';
import userRoutes from './routes/user.route';
import { authRouter } from './routes/auth.route';
import './container/tsyringe.config';

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/auth', authRouter);

AppDataSource.initialize().then(() => {
  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}).catch((error) => {
  console.error('Failed to initialize data source:', error);
});
