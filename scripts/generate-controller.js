#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the controller name and optional subpath from command line arguments
const controllerName = process.argv[2];
const subPath = process.argv[3] || '';

if (!controllerName) {
  console.error('❌ Please provide a controller name');
  console.log('Usage: npm run generate:controller <controller-name> [sub-path]');
  console.log('Example: npm run generate:controller product');
  console.log('Example: npm run generate:controller product admin');
  process.exit(1);
}

// Convert to PascalCase for class name
const className = controllerName.charAt(0).toUpperCase() + controllerName.slice(1) + 'Controller';

// Convert to camelCase for service name
const serviceName = controllerName.charAt(0).toLowerCase() + controllerName.slice(1);

// Generate the controller template
const controllerTemplate = `import { Request, Response } from 'express';
import {autoInjectable } from 'tsyringe';

@autoInjectable()
export class ${className} {
  constructor(
    
  ) {}
  
  async create(req: Request, res: Response) {
    
  }

  async findAll(req: Request, res: Response) {
    
  }

  async findOne(req: Request, res: Response) {
    
  }

  async update(req: Request, res: Response) {
   
  }

  async delete(req: Request, res: Response) {
    
  }
}
`;

// Create the controllers directory (with subPath if provided)
const controllersDir = path.join(__dirname, '..', 'src', 'controllers', subPath);
if (!fs.existsSync(controllersDir)) {
  fs.mkdirSync(controllersDir, { recursive: true });
}

// Write the controller file
const controllerFilePath = path.join(controllersDir, `${serviceName}.controller.ts`);

if (fs.existsSync(controllerFilePath)) {
  console.error(`❌ Controller file ${controllerFilePath} already exists`);
  process.exit(1);
}

fs.writeFileSync(controllerFilePath, controllerTemplate);

console.log(`✅ Controller file created: ${controllerFilePath}`);
console.log(`📝 Class name: ${className}`);
console.log(`🔧 Service name: ${serviceName}Service`);
console.log('');
console.log('📋 Next steps:');
console.log(`   1. Create the interface: src/interfaces/${serviceName}.interface.ts`);
console.log(`   2. Create the service: src/services/${serviceName}.service.ts`);
console.log(`   3. Create DTOs: src/dtos/${serviceName}.dto.ts`);
console.log(`   4. Add to container: src/container/index.ts`);
console.log(`   5. Create and register a route in src/routes/routes.ts if needed`); 