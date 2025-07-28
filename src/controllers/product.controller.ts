import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { IProductService } from '../interfaces/product.interface';

@injectable()
export class ProductController {
  constructor(
    @inject('IProductService') private productService: IProductService
  ) {}
  
  async create(req: Request, res: Response) {
    try {
      // TODO: Add DTO validation when DTO is created
      // const dto = plainToInstance(CreateProductDto, req.body);
      // await validateOrReject(dto);
      const product = await this.productService.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const products = await this.productService.findAll();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const product = await this.productService.findOne(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  async update(req: Request, res: Response) {
    try {
      // TODO: Add DTO validation when DTO is created
      // const dto = plainToInstance(UpdateProductDto, req.body);
      // await validateOrReject(dto);
      const product = await this.productService.update(Number(req.params.id), req.body);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await this.productService.delete(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
}
