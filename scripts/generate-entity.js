#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the entity name and optional subpath from command line arguments
const entityName = process.argv[2];
const subPath = process.argv[3] || '';

if (!entityName) {
  console.error('❌ Please provide an entity name');
  console.log('Usage: npm run generate:entity <entity-name> [sub-path]');
  console.log('Example: npm run generate:entity product');
  console.log('Example: npm run generate:entity product admin');
  process.exit(1);
}

// Convert to PascalCase for class name
const className = entityName.charAt(0).toUpperCase() + entityName.slice(1);

// Generate the entity template
const entityTemplate = `import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ${className} {
  @PrimaryGeneratedColumn()
  id!: number;
}
`;

// Create the entities directory (with subPath if provided)
const entitiesDir = path.join(__dirname, '..', 'src', 'entities', subPath);
if (!fs.existsSync(entitiesDir)) {
  fs.mkdirSync(entitiesDir, { recursive: true });
}

// Write the entity file
const entityFilePath = path.join(entitiesDir, `${entityName}.entity.ts`);

if (fs.existsSync(entityFilePath)) {
  console.error(`❌ Entity file ${entityFilePath} already exists`);
  process.exit(1);
}

fs.writeFileSync(entityFilePath, entityTemplate);

console.log(`✅ Entity file created: ${entityFilePath}`);
console.log(`📝 Class name: ${className}`);
console.log('');
console.log('📋 Next steps:');
console.log(`   1. Add more fields and relations as needed.`);
console.log(`   2. Register the entity in your TypeORM config if required.`); 