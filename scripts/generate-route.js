#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the route name and optional subpath from command line arguments
const routeName = process.argv[2];
const subPath = process.argv[3] || '';

if (!routeName) {
  console.error('❌ Please provide a route name');
  console.log('Usage: npm run generate:route <route-name> [sub-path]');
  console.log('Example: npm run generate:route product');
  console.log('Example: npm run generate:route product admin');
  process.exit(1);
}

// Convert to camelCase for variable names
const routeVariable = routeName.charAt(0).toLowerCase() + routeName.slice(1);

// Convert to PascalCase for controller name
function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const controllerName = toPascalCase(routeName) + 'Controller';

// Check if controller exists and if it is in a subdirectory
let controllerSubPath = '';
let controllerPath = path.join(__dirname, '..', 'src', 'controllers', `${routeVariable}.controller.ts`);
if (!fs.existsSync(controllerPath) && subPath) {
  controllerSubPath = `/${subPath}`;
  controllerPath = path.join(__dirname, '..', 'src', 'controllers', subPath, `${routeVariable}.controller.ts`);
}
const controllerExists = fs.existsSync(controllerPath);

// Generate the route template
let routeTemplate;
if (controllerExists) {
  // Full CRUD routes if controller exists
  routeTemplate = `// src/routes/${routeVariable}.route.ts\nimport { Router } from 'express';\nimport { container } from 'tsyringe';\nimport { ${controllerName} } from '../controllers${controllerSubPath}/${routeVariable}.controller';\n\nconst router = Router();\nconst controller = container.resolve(${controllerName});\n\nrouter.post('/', controller.create.bind(controller));\nrouter.get('/', controller.findAll.bind(controller));\nrouter.get('/:id', controller.findOne.bind(controller));\nrouter.put('/:id', controller.update.bind(controller));\nrouter.delete('/:id', controller.delete.bind(controller));\n\nexport default router;\n`;
} else {
  // Basic route template if no controller exists
  routeTemplate = `// src/routes/${routeVariable}.route.ts\nimport { Router } from 'express';\n\nconst router = Router();\n\n// TODO: Add controller and implement routes\n// Example routes:\n// router.post('/', (req, res) => {});\n// router.get('/', (req, res) => {});\n// router.get('/:id', (req, res) => {});\n// router.put('/:id', (req, res) => {});\n// router.delete('/:id', (req, res) => {});\n\nexport default router;\n`;
}

// Create the routes directory if it doesn't exist
const routesDir = path.join(__dirname, '..', 'src', 'routes', subPath);
if (!fs.existsSync(routesDir)) {
  fs.mkdirSync(routesDir, { recursive: true });
}

// Write the route file
const routeFilePath = path.join(routesDir, `${routeVariable}.route.ts`);

if (fs.existsSync(routeFilePath)) {
  console.error(`❌ Route file ${routeFilePath} already exists`);
  process.exit(1);
}

fs.writeFileSync(routeFilePath, routeTemplate);

// Update routes.ts to include the new route
const routesTsPath = path.join(__dirname, '..', 'src', 'routes', 'routes.ts');
let routesTsContent = fs.readFileSync(routesTsPath, 'utf8');

// Add import statement
const importStatement = `import ${routeVariable}Routes from './${routeVariable}.route';`;
if (!routesTsContent.includes(importStatement)) {
  const lastImportIndex = routesTsContent.lastIndexOf('import');
  const lastImportLine = routesTsContent.indexOf('\n', lastImportIndex) + 1;
  routesTsContent = routesTsContent.slice(0, lastImportLine) + importStatement + '\n' + routesTsContent.slice(lastImportLine);
}

// Add route registration
const routeRegistration = `router.use('/${routeVariable}s', ${routeVariable}Routes);`;
if (!routesTsContent.includes(routeRegistration)) {
  const exportIndex = routesTsContent.indexOf('export default router;');
  routesTsContent = routesTsContent.slice(0, exportIndex) + routeRegistration + '\n' + routesTsContent.slice(exportIndex);
}

fs.writeFileSync(routesTsPath, routesTsContent);

console.log(`✅ Route file created: ${routeFilePath}`);
console.log(`✅ Routes registered in routes.ts`);

if (controllerExists) {
  console.log(`🔗 Controller found: ${controllerName}`);
  console.log(`📝 Full CRUD endpoints created for existing controller`);
} else {
  console.log(`⚠️  No controller found: ${controllerName}`);
  console.log(`📝 Basic route template created - add controller implementation`);
}

console.log(`🌐 Route will be available at: /${routeVariable}s`);
console.log('');
console.log('📋 Next steps:');
if (!controllerExists) {
  console.log(`   1. Create controller: src/controllers${controllerSubPath}/${routeVariable}.controller.ts`);
  console.log(`   2. Implement route handlers in the route file`);
}
console.log(`   3. Add to container: src/container/index.ts`); 