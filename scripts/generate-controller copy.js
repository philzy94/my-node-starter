#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the controller name from command line arguments
const controllerName = process.argv[2];

if (!controllerName) {
  console.error('❌ Please provide a controller name');
  console.log('Usage: npm run generate:controller <controller-name>');
  console.log('Example: npm run generate:controller product');
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

// Generate the route template
const routeTemplate = `// src/routes/${serviceName}.route.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { ${className} } from '../controllers/${serviceName}.controller';

const router = Router();
const controller = container.resolve(${className});

router.post('/', controller.create.bind(controller));
router.get('/', controller.findAll.bind(controller));
router.get('/:id', controller.findOne.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
`;

// Create the controllers directory if it doesn't exist
const controllersDir = path.join(__dirname, '..', 'src', 'controllers');
if (!fs.existsSync(controllersDir)) {
  fs.mkdirSync(controllersDir, { recursive: true });
}

// Create the routes directory if it doesn't exist
const routesDir = path.join(__dirname, '..', 'src', 'routes');
if (!fs.existsSync(routesDir)) {
  fs.mkdirSync(routesDir, { recursive: true });
}

// Write the controller file
const controllerFilePath = path.join(controllersDir, `${serviceName}.controller.ts`);

if (fs.existsSync(controllerFilePath)) {
  console.error(`❌ Controller file ${controllerFilePath} already exists`);
  process.exit(1);
}

fs.writeFileSync(controllerFilePath, controllerTemplate);

// Write the route file
const routeFilePath = path.join(routesDir, `${serviceName}.route.ts`);

if (fs.existsSync(routeFilePath)) {
  console.error(`❌ Route file ${routeFilePath} already exists`);
  process.exit(1);
}

fs.writeFileSync(routeFilePath, routeTemplate);

// Update routes.ts to include the new route
const routesTsPath = path.join(__dirname, '..', 'src', 'routes', 'routes.ts');
let routesTsContent = fs.readFileSync(routesTsPath, 'utf8');

// Add import statement
const importStatement = `import ${serviceName}Routes from './${serviceName}.route';`;
const lastImportIndex = routesTsContent.lastIndexOf('import');
const lastImportLine = routesTsContent.substring(lastImportIndex, routesTsContent.indexOf('\n', lastImportIndex) + 1);
const newRoutesTsContent = routesTsContent.replace(lastImportLine, lastImportLine + importStatement + '\n');

// Add route registration
const routeRegistration = `router.use('/${serviceName}s', ${serviceName}Routes);`;
const lastRouteIndex = newRoutesTsContent.lastIndexOf('router.use(');
const lastRouteLine = newRoutesTsContent.substring(lastRouteIndex, newRoutesTsContent.indexOf('\n', lastRouteIndex) + 1);
const finalRoutesTsContent = newRoutesTsContent.replace(lastRouteLine, lastRouteLine + routeRegistration + '\n');

fs.writeFileSync(routesTsPath, finalRoutesTsContent);

console.log(`✅ Controller file created: ${controllerFilePath}`);
console.log(`✅ Route file created: ${routeFilePath}`);
console.log(`✅ Routes registered in routes.ts`);
console.log(`📝 Class name: ${className}`);
console.log(`🔧 Service name: ${serviceName}Service`);
console.log('');
console.log('📋 Next steps:');
console.log(`   1. Create the interface: src/interfaces/${serviceName}.interface.ts`);
console.log(`   2. Create the service: src/services/${serviceName}.service.ts`);
console.log(`   3. Create DTOs: src/dtos/${serviceName}.dto.ts`);
console.log(`   4. Add to container: src/container/index.ts`); 