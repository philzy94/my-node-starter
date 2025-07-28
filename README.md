# 🚀 Node.js Auth CRUD Starter Kit

A powerful Node.js backend starter kit with comprehensive CLI generators for rapid development. Built with Express, TypeScript, TypeORM, and tsyringe dependency injection.

## ✨ Features

- 🔐 **JWT Authentication** (Login, Register, Refresh Tokens)
- 🗄️ **TypeORM Integration** with PostgreSQL
- 🏗️ **CLI Generators** for rapid scaffolding
- 🔧 **Dependency Injection** with tsyringe
- ✅ **Data Validation** with class-validator
- 📚 **Swagger Documentation**
- 🐳 **Docker Support**
- 📝 **Winston Logger**

## 🛠️ Tech Stack

- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL + TypeORM
- **DI Container**: tsyringe
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger
- **Containerization**: Docker
- **Logging**: Winston

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repo_url>
cd nodejs-auth-crud-starter
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=your_database

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3000
```

### 3. Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker-compose up -d

# Run migrations
npm run migration:run
```

### 4. Start Development Server

```bash
npm run dev
```

---

## 🎯 CLI Generators

This project includes a comprehensive set of CLI commands for rapid scaffolding of various components. All generators support optional subdirectory paths for better organization.

### 📋 Available Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `generate:controller` | Generate controller files | `npm run generate:controller <name> [sub-path]` |
| `generate:route` | Generate route files | `npm run generate:route <name> [sub-path]` |
| `generate:service` | Generate service files | `npm run generate:service <name> [sub-path]` |
| `generate:entity` | Generate TypeORM entity files | `npm run generate:entity <name> [sub-path]` |
| `generate:middleware` | Generate middleware files | `npm run generate:middleware <name> [sub-path]` |
| `generate:interface` | Generate TypeScript interface files | `npm run generate:interface <name> [sub-path]` |
| `generate:dto` | Generate DTO files | `npm run generate:dto <name> [sub-path]` |
| `generate:auth` | Generate complete authentication scaffold | `npm run generate:auth` |
| `generate` | Flexible generator for multiple components | `npm run generate -- --<type> <name> [--<type>-path path]` |
| `generate:all` | Generate all components with same name | `npm run generate:all -- <name> [--<type>-path path]` |
| `generate:some` | Generate selected components with same name | `npm run generate:some -- <name> [--controller] [--service] ...` |

---

## 📝 Individual Generators

### 1. Controller Generator

Generates Express controllers with CRUD method templates.

```bash
npm run generate:controller <name> [sub-path]
```

**Examples:**
```bash
# Basic controller
npm run generate:controller user

# Controller in subdirectory
npm run generate:controller admin admin
npm run generate:controller product catalog
```

**Generated File:** `src/controllers/[sub-path]/<name>.controller.ts`

**Template Includes:**
- Express Request/Response types
- CRUD methods (create, findAll, findOne, update, delete)
- tsyringe autoInjectable decorator
- JSDoc comments

### 2. Route Generator

Generates Express routes with full CRUD endpoints if a corresponding controller exists.

```bash
npm run generate:route <name> [sub-path]
```

**Examples:**
```bash
# Basic route
npm run generate:route user

# Route in subdirectory
npm run generate:route admin admin
npm run generate:route product catalog
```

**Generated File:** `src/routes/[sub-path]/<name>.route.ts`

**Features:**
- ✅ Automatically registers in `src/routes/routes.ts`
- ✅ Full CRUD endpoints if controller exists
- ✅ Basic template if no controller found
- ✅ Correct import paths for subdirectories

### 3. Service Generator

Generates service classes with dependency injection setup.

```bash
npm run generate:service <name> [sub-path]
```

**Examples:**
```bash
# Basic service
npm run generate:service user

# Service in subdirectory
npm run generate:service admin admin
npm run generate:service product catalog
```

**Generated File:** `src/services/[sub-path]/<name>.service.ts`

**Template Includes:**
- tsyringe injectable decorator
- Empty constructor
- JSDoc comments
- TypeScript class structure

### 4. Entity Generator

Generates TypeORM entity classes with basic structure.

```bash
npm run generate:entity <name> [sub-path]
```

**Examples:**
```bash
# Basic entity
npm run generate:entity user

# Entity in subdirectory
npm run generate:entity admin admin
npm run generate:entity product catalog
```

**Generated File:** `src/entities/[sub-path]/<name>.entity.ts`

**Template Includes:**
- TypeORM Entity decorator
- PrimaryGeneratedColumn for id
- Basic TypeORM imports

### 5. Middleware Generator

Generates Express middleware functions.

```bash
npm run generate:middleware <name> [sub-path]
```

**Examples:**
```bash
# Basic middleware
npm run generate:middleware auth

# Middleware in subdirectory
npm run generate:middleware admin admin
npm run generate:middleware validation common
```

**Generated File:** `src/middleware/[sub-path]/<name>.middleware.ts`

**Template Includes:**
- Express Request, Response, NextFunction types
- Standard middleware signature
- JSDoc comments

### 6. Interface Generator

Generates TypeScript interface definitions.

```bash
npm run generate:interface <name> [sub-path]
```

**Examples:**
```bash
# Basic interface
npm run generate:interface user

# Interface in subdirectory
npm run generate:interface admin admin
npm run generate:interface product catalog
```

**Generated File:** `src/interfaces/[sub-path]/<name>.interface.ts`

**Template Includes:**
- I-prefixed interface name
- JSDoc comments
- TypeScript interface structure

### 7. DTO Generator

Generates Data Transfer Objects with validation decorators.

```bash
npm run generate:dto <name> [sub-path]
```

**Examples:**
```bash
# Basic DTO
npm run generate:dto user

# DTO in subdirectory
npm run generate:dto admin admin
npm run generate:dto product catalog
```

**Generated File:** `src/dtos/[sub-path]/<name>.dto.ts`

**Template Includes:**
- class-validator imports
- class-transformer imports
- Comprehensive validation examples
- JSDoc comments

---

## 🔧 Combined Generators

### 1. Flexible Generator (`generate`)

Generate any combination of components with individual names and paths.

```bash
npm run generate -- --<type> <name> [--<type>-path path]
```

**Available Flags:**
- `--controller <name>` - Generate controller
- `--service <name>` - Generate service
- `--entity <name>` - Generate entity
- `--interface <name>` - Generate interface
- `--middleware <name>` - Generate middleware
- `--dto <name>` - Generate DTO
- `--route <name>` - Generate route
- `--<type>-path <path>` - Subdirectory for specific type

**Examples:**
```bash
# Generate multiple components with different names
npm run generate -- --controller user --service userService --entity user

# Generate with custom paths
npm run generate -- --controller admin admin --service admin admin --route admin admin

# Generate DTOs with validation
npm run generate -- --dto user --dto product --controller user --service user

# Complex example
npm run generate -- \
  --controller user \
  --controller-path admin \
  --service user \
  --service-path admin \
  --entity user \
  --entity-path admin \
  --dto user \
  --dto-path admin \
  --route user \
  --route-path admin
```

### 2. Generate All (`generate:all`)

Generate all component types using a single name.

```bash
npm run generate:all -- <name> [--<type>-path path]
```

**Available Path Flags:**
- `--controller-path <path>`
- `--service-path <path>`
- `--entity-path <path>`
- `--interface-path <path>`
- `--middleware-path <path>`
- `--dto-path <path>`
- `--route-path <path>`

**Examples:**
```bash
# Generate all components with same name
npm run generate:all -- user

# Generate all with custom paths
npm run generate:all -- user --controller-path admin --service-path admin

# Generate in specific subdirectories
npm run generate:all -- product --controller-path catalog --service-path catalog --entity-path catalog
```

### 3. Generate Selected (`generate:some`)

Generate specific components using a single name and flags.

```bash
npm run generate:some -- <name> [--controller] [--service] [--entity] [--interface] [--middleware] [--dto] [--route] [--<type>-path path]
```

**Available Flags:**
- `--controller` - Generate controller
- `--service` - Generate service
- `--entity` - Generate entity
- `--interface` - Generate interface
- `--middleware` - Generate middleware
- `--dto` - Generate DTO
- `--route` - Generate route
- `--<type>-path <path>` - Subdirectory for specific type

**Examples:**
```bash
# Generate only controller and service
npm run generate:some -- user --controller --service

# Generate with custom paths
npm run generate:some -- user --controller --controller-path admin --service --service-path admin

# Generate full CRUD stack
npm run generate:some -- product --controller --service --entity --dto --route

# Generate in organized structure
npm run generate:some -- admin \
  --controller --controller-path admin \
  --service --service-path admin \
  --entity --entity-path admin \
  --dto --dto-path admin \
  --route --route-path admin
```

---

## 🔐 Authentication Scaffold

Generate a complete authentication system with one command.

```bash
npm run generate:auth
```

**What Gets Generated:**
- ✅ User entity with email/password fields
- ✅ Auth DTOs (RegisterDto, LoginDto)
- ✅ IAuthService interface
- ✅ AuthService with bcrypt and JWT
- ✅ AuthMiddleware for JWT verification
- ✅ AuthController with register/login/refresh endpoints
- ✅ Auth route with all endpoints
- ✅ Automatic route registration

**Features:**
- 🔐 Email/password authentication
- 🔄 Access and refresh tokens
- 🔒 Password hashing with bcrypt
- 🛡️ JWT verification middleware
- 📝 Comprehensive validation
- 🎯 Only creates files if they don't exist

**Required Environment Variables:**
```env
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## 📁 Generated File Structure

```
src/
├── controllers/
│   ├── user.controller.ts
│   └── admin/
│       └── admin.controller.ts
├── services/
│   ├── user.service.ts
│   └── admin/
│       └── admin.service.ts
├── entities/
│   ├── user.entity.ts
│   └── admin/
│       └── admin.entity.ts
├── interfaces/
│   ├── user.interface.ts
│   └── admin/
│       └── admin.interface.ts
├── middleware/
│   ├── auth.middleware.ts
│   └── admin/
│       └── admin.middleware.ts
├── dtos/
│   ├── user.dto.ts
│   └── admin/
│       └── admin.dto.ts
├── routes/
│   ├── routes.ts (centralized)
│   ├── user.route.ts
│   └── admin/
│       └── admin.route.ts
└── main.ts
```

---

## 🎯 Best Practices

### 1. **Naming Conventions**
- Use kebab-case for file names: `user-profile.controller.ts`
- Use PascalCase for class names: `UserProfileController`
- Use camelCase for variables and methods: `userProfileService`

### 2. **Directory Organization**
- Group related components in subdirectories
- Use consistent naming across all generators
- Keep main components in root directories

### 3. **Generator Workflow**
```bash
# 1. Generate entity first
npm run generate:entity user

# 2. Generate DTOs for validation
npm run generate:dto user

# 3. Generate service for business logic
npm run generate:service user

# 4. Generate controller for HTTP handling
npm run generate:controller user

# 5. Generate route for endpoints
npm run generate:route user
```

### 4. **Quick Start for New Feature**
```bash
# Generate complete CRUD stack
npm run generate:some -- product --controller --service --entity --dto --route

# Or use the flexible generator
npm run generate -- --controller product --service product --entity product --dto product --route product
```

---

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run migration:generate  # Generate migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration

# CLI Generators
npm run generate:controller <name> [sub-path]
npm run generate:route <name> [sub-path]
npm run generate:service <name> [sub-path]
npm run generate:entity <name> [sub-path]
npm run generate:middleware <name> [sub-path]
npm run generate:interface <name> [sub-path]
npm run generate:dto <name> [sub-path]
npm run generate:auth
npm run generate -- [options]
npm run generate:all -- <name> [options]
npm run generate:some -- <name> [options]

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include your Node.js version and OS

---

**Happy Coding! 🎉** 