#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the service name and optional subpath from command line arguments
const serviceName = process.argv[2];
const subPath = process.argv[3] || '';

if (!serviceName) {
  console.error('❌ Please provide a service name');
  console.log('Usage: npm run generate:service <service-name> [sub-path]');
  console.log('Example: npm run generate:service product');
  console.log('Example: npm run generate:service product admin');
  process.exit(1);
}

// Convert to PascalCase for class name
const className = serviceName.charAt(0).toUpperCase() + serviceName.slice(1) + 'Service';

// Generate the service template with comments
const serviceTemplate = `/**
 * ${className}
 * Service for handling business logic related to ${serviceName}.
 * Add your methods and dependencies here.
 */
import { injectable } from 'tsyringe';

/**
 * Injectable service for ${serviceName} operations.
 */
@injectable()
export class ${className} {
  /**
   * Add dependencies to the constructor if needed.
   */
  constructor() {}
}
`;

// Create the services directory (with subPath if provided)
const servicesDir = path.join(__dirname, '..', 'src', 'services', subPath);
if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

// Write the service file
const serviceFilePath = path.join(servicesDir, `${serviceName}.service.ts`);

if (fs.existsSync(serviceFilePath)) {
  console.error(`❌ Service file ${serviceFilePath} already exists`);
  process.exit(1);
}

fs.writeFileSync(serviceFilePath, serviceTemplate);

console.log(`✅ Service file created: ${serviceFilePath}`);
console.log(`📝 Class name: ${className}`);
console.log('');
console.log('📋 Next steps:');
console.log(`   1. Create the interface: src/interfaces/${serviceName}.interface.ts`);
console.log(`   2. Register the service in src/container/index.ts`); 