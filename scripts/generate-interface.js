#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the interface name and optional subpath from command line arguments
const interfaceName = process.argv[2];
const subPath = process.argv[3] || '';

if (!interfaceName) {
  console.error('❌ Please provide an interface name');
  console.log('Usage: npm run generate:interface <interface-name> [sub-path]');
  console.log('Example: npm run generate:interface user');
  console.log('Example: npm run generate:interface user admin');
  process.exit(1);
}

// Convert to PascalCase for interface name
const interfaceType =
  interfaceName.charAt(0).toUpperCase() + interfaceName.slice(1);
const interfaceFullName = `I${interfaceType}`;

// Generate the interface template
const interfaceTemplate = `/**
 * ${interfaceFullName}
 * Add properties for the ${interfaceName} interface below.
 */
export interface ${interfaceFullName} {
  // TODO: Define properties
}
`;

// Create the interfaces directory (with subPath if provided)
const interfacesDir = path.join(__dirname, '..', 'src', 'interfaces', subPath);
if (!fs.existsSync(interfacesDir)) {
  fs.mkdirSync(interfacesDir, { recursive: true });
}

// Write the interface file
const interfaceFilePath = path.join(interfacesDir, `${interfaceName}.interface.ts`);

if (fs.existsSync(interfaceFilePath)) {
  console.error(`❌ Interface file ${interfaceFilePath} already exists`);
  process.exit(1);
}

fs.writeFileSync(interfaceFilePath, interfaceTemplate);

console.log(`✅ Interface file created: ${interfaceFilePath}`);
console.log(`📝 Interface name: ${interfaceFullName}`);
console.log('');
console.log('📋 Next steps:');
console.log(`   1. Add properties to the interface as needed.`); 