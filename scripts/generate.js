#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));

// Helper to PascalCase
function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
// Helper to camelCase
function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// --- CONTROLLER ---
if (args.controller) {
  const name = args.controller;
  const subPath = args['controller-path'] || '';
  const className = toPascalCase(name) + 'Controller';
  const serviceName = toCamelCase(name);
  const controllerTemplate = `import { Request, Response } from 'express';\nimport {autoInjectable } from 'tsyringe';\n\n@autoInjectable()\nexport class ${className} {\n  constructor(\n    \n  ) {}\n  \n  async create(req: Request, res: Response) {\n    \n  }\n\n  async findAll(req: Request, res: Response) {\n    \n  }\n\n  async findOne(req: Request, res: Response) {\n    \n  }\n\n  async update(req: Request, res: Response) {\n   \n  }\n\n  async delete(req: Request, res: Response) {\n    \n  }\n}\n`;
  const controllersDir = path.join(__dirname, '..', 'src', 'controllers', subPath);
  if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });
  const controllerFilePath = path.join(controllersDir, `${serviceName}.controller.ts`);
  if (fs.existsSync(controllerFilePath)) {
    console.error(`❌ Controller file ${controllerFilePath} already exists`);
    process.exit(1);
  }
  fs.writeFileSync(controllerFilePath, controllerTemplate);
  console.log(`✅ Controller file created: ${controllerFilePath}`);
}

// --- ENTITY ---
if (args.entity) {
  const name = args.entity;
  const subPath = args['entity-path'] || '';
  const className = toPascalCase(name);
  const entityTemplate = `import { Entity, PrimaryGeneratedColumn } from 'typeorm';\n\n@Entity()\nexport class ${className} {\n  @PrimaryGeneratedColumn()\n  id!: number;\n}\n`;
  const entitiesDir = path.join(__dirname, '..', 'src', 'entities', subPath);
  if (!fs.existsSync(entitiesDir)) fs.mkdirSync(entitiesDir, { recursive: true });
  const entityFilePath = path.join(entitiesDir, `${name}.entity.ts`);
  if (fs.existsSync(entityFilePath)) {
    console.error(`❌ Entity file ${entityFilePath} already exists`);
    process.exit(1);
  }
  fs.writeFileSync(entityFilePath, entityTemplate);
  console.log(`✅ Entity file created: ${entityFilePath}`);
}

// --- INTERFACE ---
if (args.interface) {
  const name = args.interface;
  const subPath = args['interface-path'] || '';
  const interfaceType = toPascalCase(name);
  const interfaceFullName = `I${interfaceType}`;
  const interfaceTemplate = `/**\n * ${interfaceFullName}\n * Add properties for the ${name} interface below.\n */\nexport interface ${interfaceFullName} {\n  // TODO: Define properties\n}\n`;
  const interfacesDir = path.join(__dirname, '..', 'src', 'interfaces', subPath);
  if (!fs.existsSync(interfacesDir)) fs.mkdirSync(interfacesDir, { recursive: true });
  const interfaceFilePath = path.join(interfacesDir, `${name}.interface.ts`);
  if (fs.existsSync(interfaceFilePath)) {
    console.error(`❌ Interface file ${interfaceFilePath} already exists`);
    process.exit(1);
  }
  fs.writeFileSync(interfaceFilePath, interfaceTemplate);
  console.log(`✅ Interface file created: ${interfaceFilePath}`);
}

// --- MIDDLEWARE ---
if (args.middleware) {
  const name = args.middleware;
  const subPath = args['middleware-path'] || '';
  const functionName = toCamelCase(name) + 'Middleware';
  const middlewareTemplate = `import { Request, Response, NextFunction } from 'express';\n\n/**\n * ${functionName}\n * Express middleware for ${name} logic.\n */\nexport function ${functionName}(req: Request, res: Response, next: NextFunction) {\n  // TODO: Implement middleware logic\n  next();\n}\n`;
  const middlewareDir = path.join(__dirname, '..', 'src', 'middleware', subPath);
  if (!fs.existsSync(middlewareDir)) fs.mkdirSync(middlewareDir, { recursive: true });
  const middlewareFilePath = path.join(middlewareDir, `${name}.middleware.ts`);
  if (fs.existsSync(middlewareFilePath)) {
    console.error(`❌ Middleware file ${middlewareFilePath} already exists`);
    process.exit(1);
  }
  fs.writeFileSync(middlewareFilePath, middlewareTemplate);
  console.log(`✅ Middleware file created: ${middlewareFilePath}`);
}

// --- SERVICE ---
if (args.service) {
  const name = args.service;
  const subPath = args['service-path'] || '';
  const className = toPascalCase(name) + 'Service';
  const serviceTemplate = `/**\n * ${className}\n * Service for handling business logic related to ${name}.\n * Add your methods and dependencies here.\n */\nimport { injectable } from 'tsyringe';\n\n/**\n * Injectable service for ${name} operations.\n */\n@injectable()\nexport class ${className} {\n  /**\n   * Add dependencies to the constructor if needed.\n   */\n  constructor() {}\n}\n`;
  const servicesDir = path.join(__dirname, '..', 'src', 'services', subPath);
  if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });
  const serviceFilePath = path.join(servicesDir, `${name}.service.ts`);
  if (fs.existsSync(serviceFilePath)) {
    console.error(`❌ Service file ${serviceFilePath} already exists`);
    process.exit(1);
  }
  fs.writeFileSync(serviceFilePath, serviceTemplate);
  console.log(`✅ Service file created: ${serviceFilePath}`);
}

// --- ROUTE ---
if (args.route) {
  const name = args.route;
  const subPath = args['route-path'] || '';
  const controllerName = toPascalCase(name) + 'Controller';
  const routeTemplate = `import { Router } from 'express';\nimport { container } from 'tsyringe';\nimport { ${controllerName} } from '../controllers/${name}.controller';\n\nconst router = Router();\nconst controller = container.resolve(${controllerName});\n\nrouter.post('/', controller.create.bind(controller));\nrouter.get('/', controller.findAll.bind(controller));\nrouter.get('/:id', controller.findOne.bind(controller));\nrouter.put('/:id', controller.update.bind(controller));\nrouter.delete('/:id', controller.delete.bind(controller));\n\nexport default router;\n`;
  const routesDir = path.join(__dirname, '..', 'src', 'routes', subPath);
  if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });
  const routeFilePath = path.join(routesDir, `${name}.route.ts`);
  if (fs.existsSync(routeFilePath)) {
    console.error(`❌ Route file ${routeFilePath} already exists`);
    process.exit(1);
  }
  fs.writeFileSync(routeFilePath, routeTemplate);
  console.log(`✅ Route file created: ${routeFilePath}`);

  // Register route in routes.ts
  const routesTsPath = path.join(__dirname, '..', 'src', 'routes', 'routes.ts');
  let routesTsContent = fs.readFileSync(routesTsPath, 'utf8');
  const importStatement = `import ${name}Routes from './${name}.route';`;
  if (!routesTsContent.includes(importStatement)) {
    // Add import after last import
    const lastImportIndex = routesTsContent.lastIndexOf('import');
    const lastImportLine = routesTsContent.indexOf('\n', lastImportIndex) + 1;
    routesTsContent = routesTsContent.slice(0, lastImportLine) + importStatement + '\n' + routesTsContent.slice(lastImportLine);
  }
  const routeRegistration = `router.use('/${name}s', ${name}Routes);`;
  if (!routesTsContent.includes(routeRegistration)) {
    // Add before export default
    const exportIndex = routesTsContent.indexOf('export default router;');
    routesTsContent = routesTsContent.slice(0, exportIndex) + routeRegistration + '\n' + routesTsContent.slice(exportIndex);
  }
  fs.writeFileSync(routesTsPath, routesTsContent);
  console.log(`✅ Route registered in routes.ts`);
}

console.log('\n🎉 Generation complete!'); 