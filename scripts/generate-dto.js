#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the DTO name and optional subpath from command line arguments
const dtoName = process.argv[2];
const subPath = process.argv[3] || '';

if (!dtoName) {
  console.error('❌ Please provide a DTO name');
  console.log('Usage: npm run generate:dto <dto-name> [sub-path]');
  console.log('Example: npm run generate:dto user');
  console.log('Example: npm run generate:dto user admin');
  process.exit(1);
}

// Convert to PascalCase for class name
const className = dtoName.charAt(0).toUpperCase() + dtoName.slice(1);

// Generate the DTO template
const dtoTemplate = `import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean, IsDateString, MinLength, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * ${className}Dto
 * Data Transfer Object for ${dtoName} operations.
 */
export class ${className}Dto {
  // TODO: Add properties with validation decorators
  // Example:
  // @IsString()
  // @MinLength(2)
  // @MaxLength(50)
  // name!: string;
  
  // @IsEmail()
  // email!: string;
  
  // @IsOptional()
  // @IsString()
  // description?: string;
  
  // @IsNumber()
  // age!: number;
  
  // @IsBoolean()
  // isActive!: boolean;
  
  // @IsDateString()
  // birthDate!: string;
  
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => String)
  // tags!: string[];
}
`;

// Create the dtos directory (with subPath if provided)
const dtosDir = path.join(__dirname, '..', 'src', 'dtos', subPath);
if (!fs.existsSync(dtosDir)) {
  fs.mkdirSync(dtosDir, { recursive: true });
}

// Write the DTO file
const dtoFilePath = path.join(dtosDir, `${dtoName}.dto.ts`);

if (fs.existsSync(dtoFilePath)) {
  console.error(`❌ DTO file ${dtoFilePath} already exists`);
  process.exit(1);
}

fs.writeFileSync(dtoFilePath, dtoTemplate);

console.log(`✅ DTO file created: ${dtoFilePath}`);
console.log(`📝 Class name: ${className}Dto`);
console.log('');
console.log('📋 Next steps:');
console.log(`   1. Add properties with validation decorators as needed.`);
console.log(`   2. Import and use in your controllers/services.`); 