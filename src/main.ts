// src/main.ts
import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/typeorm.config';
import routes from './routes/routes';
import './container/tsyringe.config';

const app = express();
app.use(express.json());

// Use centralized routes
app.use('/', routes);

AppDataSource.initialize().then(() => {
  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}).catch(() => {
  console.error('Failed to initialize data source:', "ERROR");
});
