#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the middleware name and optional subpath from command line arguments
const middlewareName = process.argv[2];
const subPath = process.argv[3] || '';

if (!middlewareName) {
  console.error('❌ Please provide a middleware name');
  console.log('Usage: npm run generate:middleware <middleware-name> [sub-path]');
  console.log('Example: npm run generate:middleware auth');
  console.log('Example: npm run generate:middleware logger admin');
  process.exit(1);
}

// Convert to camelCase for function name
const functionName = middlewareName.charAt(0).toLowerCase() + middlewareName.slice(1) + 'Middleware';

// Generate the middleware template
const middlewareTemplate = `import { Request, Response, NextFunction } from 'express';

/**
 * ${functionName}
 * Express middleware for ${middlewareName} logic.
 */
export function ${functionName}(req: Request, res: Response, next: NextFunction) {
  // TODO: Implement middleware logic
  next();
}
`;

// Create the middleware directory (with subPath if provided)
const middlewareDir = path.join(__dirname, '..', 'src', 'middleware', subPath);
if (!fs.existsSync(middlewareDir)) {
  fs.mkdirSync(middlewareDir, { recursive: true });
}

// Write the middleware file
const middlewareFilePath = path.join(middlewareDir, `${middlewareName}.middleware.ts`);

if (fs.existsSync(middlewareFilePath)) {
  console.error(`❌ Middleware file ${middlewareFilePath} already exists`);
  process.exit(1);
}

fs.writeFileSync(middlewareFilePath, middlewareTemplate);

console.log(`✅ Middleware file created: ${middlewareFilePath}`);
console.log(`📝 Function name: ${functionName}`);
console.log('');
console.log('📋 Next steps:');
console.log(`   1. Use this middleware in your routes or app as needed.`); 