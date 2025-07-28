import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MyProduct {
  @PrimaryGeneratedColumn()
  id!: number;
}
