# 🔭 Telescope

> **People Management Platform for inoRain**

A comprehensive web application for managing employee information, vacations, time-off requests, technical skills, English proficiency levels, project assignments, and team structures.

**URL:** [telescope.inorain.com](https://telescope.inorain.com)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [Deployment](#-deployment)

---

## ✨ Features

### 👥 People Management
- Employee profiles with personal and professional information
- Contact details and emergency contacts
- Employment history and status tracking
- Profile photos and document uploads

### 🏖️ Vacation & Time-Off
- Vacation request submission and approval workflow
- Day-off tracking (sick leave, personal days, holidays)
- Calendar view of team availability
- Vacation balance and accrual tracking
- Manager approval system

### 💻 Technical Skills
- Skill inventory per employee
- Proficiency levels (Beginner → Expert)
- Skill categories (Frontend, Backend, DevOps, etc.)
- Team skill matrix visualization
- Skill gap analysis

### 🌍 English Proficiency
- English level tracking (A1 → C2 / CEFR scale)
- Assessment history
- Training recommendations

### 📊 Project Status
- Project assignments per employee
- Role and responsibility tracking
- Project timeline and milestones
- Workload distribution view

### 👨‍👩‍👧‍👦 Team Structure
- Organizational hierarchy visualization
- Department management
- Team leads and reporting structure
- Cross-functional team support

### 🛡️ Admin Panel
- User management (create, edit, delete users)
- Role-based access control
- System configuration
- Audit logs and activity monitoring

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL 15 |
| **ORM** | TypeORM |
| **Authentication** | JWT, bcrypt |
| **API** | RESTful API |
| **Containerization** | Docker, Docker Compose |

---

## 📁 Project Structure

```
telescope/
├── README.md
├── docker-compose.yml          # PostgreSQL & services
│
├── client/                     # React Frontend (Main App)
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── layout/        # Header, sidebar, footer
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service functions
│   │   ├── store/             # State management (Zustand)
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Helper functions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts         # Port: 3001
│   └── tailwind.config.js
│   │
│   └── admin/                  # React Admin Panel
│       ├── public/
│       ├── src/
│       │   ├── components/    # Admin UI components
│       │   │   ├── layout/    # AdminLayout, Header, Sidebar
│       │   │   └── ProtectedRoute.tsx
│       │   ├── pages/         # Dashboard, Login, Users
│       │   ├── services/      # API service functions
│       │   ├── store/         # Auth state (Zustand)
│       │   └── types/
│       ├── index.html
│       ├── package.json
│       ├── vite.config.ts     # Port: 3002
│       └── tailwind.config.js
│
└── server/                     # Node.js Backend
    ├── src/
    │   ├── config/            # Database & app configuration
    │   ├── entities/          # TypeORM entities
    │   ├── controllers/       # Request handlers
    │   ├── services/          # Business logic
    │   ├── routes/            # API routes
    │   ├── middlewares/       # Auth, validation, error handling
    │   ├── utils/             # Helper functions
    │   ├── app.ts             # Express app setup
    │   └── index.ts           # Entry point (Port: 9999)
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose (for PostgreSQL database)
- npm

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/inorain/telescope.git
   cd telescope
   ```

2. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d postgres
   ```
   
   This starts PostgreSQL on port `5432` with these default credentials:
   | Setting | Value |
   |---------|-------|
   | Host | localhost |
   | Port | 5432 |
   | Username | telescope |
   | Password | telescope_password |
   | Database | telescope |

   *(Optional)* Start pgAdmin for database management UI:
   ```bash
   docker-compose up -d pgadmin
   ```
   Access pgAdmin at http://localhost:5050 (login: `admin@inorain.com` / `admin123`)

3. **Setup the backend server**
   ```bash
   cd server
   npm install
   ```
   
   Create a `.env` file in the `server/` directory:
   ```env
   NODE_ENV=development
   PORT=9999
   API_PREFIX=/api
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=telescope
   DB_PASSWORD=telescope_password
   DB_DATABASE=telescope
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3001,http://localhost:3002
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

5. **Setup and start the main frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```

6. **Setup and start the admin panel** (in a new terminal)
   ```bash
   cd client/admin
   npm install
   npm run dev
   ```

7. **(Optional) Seed the database with sample data**
   ```bash
   cd server
   npm run seed
   ```

### Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| Main Frontend | http://localhost:3001 | Employee-facing application |
| Admin Panel | http://localhost:3002 | Administrative dashboard |
| Backend API | http://localhost:9999/api | REST API endpoints |
| pgAdmin | http://localhost:5050 | Database management UI |

---

## 🗄️ Database Schema

### Core Entities

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Employee    │────<│   Vacation      │     │     Skill       │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │     │ id              │
│ firstName       │     │ employeeId (FK) │     │ name            │
│ lastName        │     │ type            │     │ category        │
│ email           │     │ startDate       │     │ description     │
│ phone           │     │ endDate         │     └────────┬────────┘
│ position        │     │ status          │              │
│ departmentId    │     │ approvedBy      │              │
│ teamId          │     └─────────────────┘     ┌────────┴────────┐
│ managerId       │                             │ EmployeeSkill   │
│ englishLevel    │                             ├─────────────────┤
│ hireDate        │                             │ employeeId (FK) │
│ status          │                             │ skillId (FK)    │
└────────┬────────┘                             │ level           │
         │                                      │ yearsExp        │
         │         ┌─────────────────┐          └─────────────────┘
         │         │   Department    │
         └────────>├─────────────────┤
                   │ id              │
                   │ name            │
                   │ description     │
                   │ headId (FK)     │
                   └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│     Project     │────<│ProjectAssignment│
├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │
│ name            │     │ projectId (FK)  │
│ description     │     │ employeeId (FK) │
│ status          │     │ role            │
│ startDate       │     │ startDate       │
│ endDate         │     │ endDate         │
└─────────────────┘     └─────────────────┘

┌─────────────────┐
│      Team       │
├─────────────────┤
│ id              │
│ name            │
│ departmentId    │
│ leadId (FK)     │
│ description     │
└─────────────────┘
```

### English Level Scale (CEFR)

| Level | Description |
|-------|-------------|
| A1 | Beginner |
| A2 | Elementary |
| B1 | Intermediate |
| B2 | Upper Intermediate |
| C1 | Advanced |
| C2 | Proficient |

### Skill Proficiency Levels

| Level | Description |
|-------|-------------|
| 1 | Beginner |
| 2 | Elementary |
| 3 | Intermediate |
| 4 | Advanced |
| 5 | Expert |

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees |
| GET | `/api/employees/:id` | Get employee by ID |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/employees/:id/skills` | Get employee skills |
| GET | `/api/employees/:id/vacations` | Get employee vacations |

### Vacations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vacations` | List all vacations |
| POST | `/api/vacations` | Request vacation |
| PUT | `/api/vacations/:id` | Update vacation |
| PUT | `/api/vacations/:id/approve` | Approve vacation |
| PUT | `/api/vacations/:id/reject` | Reject vacation |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | List all skills |
| POST | `/api/skills` | Create skill |
| GET | `/api/skills/matrix` | Get team skill matrix |

### Departments & Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | List departments |
| GET | `/api/teams` | List teams |
| GET | `/api/teams/:id/members` | Get team members |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects |
| GET | `/api/projects/:id` | Get project details |
| GET | `/api/projects/:id/team` | Get project team |

### Users (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

---

## ⚙️ Environment Variables

### Server (.env)

```env
# Application
NODE_ENV=development
PORT=9999
API_PREFIX=/api

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=telescope
DB_PASSWORD=telescope_password
DB_DATABASE=telescope

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# CORS (comma-separated for multiple origins)
CORS_ORIGIN=http://localhost:3001,http://localhost:3002
```

### Client (.env) - Optional

The clients use Vite's proxy feature, so no `.env` file is required for local development. If needed:

```env
VITE_API_URL=http://localhost:9999/api
```

---

## 💻 Development

### Available Scripts

#### Server (`server/`)
```bash
npm run dev          # Start development server with hot reload (port 9999)
npm run build        # Build for production
npm run start        # Start production server
npm run migration:generate  # Generate new migration
npm run migration:run       # Run pending migrations
npm run migration:revert    # Revert last migration
npm run seed         # Seed database with sample data
npm run test         # Run tests
npm run lint         # Run ESLint
```

#### Main Client (`client/`)
```bash
npm run dev          # Start Vite dev server (port 3001)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
```

#### Admin Panel (`client/admin/`)
```bash
npm run dev          # Start Vite dev server (port 3002)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Style

- ESLint + Prettier for code formatting
- Conventional Commits for commit messages
- Feature branch workflow

---

## 🚢 Deployment

### Production Build

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Build the server**
   ```bash
   cd server
   npm run build
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment Requirements

- Node.js 18 LTS
- PostgreSQL 15
- Nginx (reverse proxy)
- SSL certificate for telescope.inorain.com

---

## 📝 License

Copyright © 2024 inoRain. All rights reserved.

---

## 👥 Contributors

- inoRain Development Team

---

<p align="center">
  Made with ❤️ by inoRain
</p>
