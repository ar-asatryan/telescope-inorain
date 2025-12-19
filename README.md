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
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/            # Images, fonts, static files
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/        # Buttons, inputs, modals
│   │   │   ├── layout/        # Header, sidebar, footer
│   │   │   └── features/      # Feature-specific components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service functions
│   │   ├── store/             # State management
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Helper functions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
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
    │   ├── types/             # TypeScript interfaces
    │   ├── app.ts             # Express app setup
    │   └── index.ts           # Entry point
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+ (or Docker)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/inorain/telescope.git
   cd telescope
   ```

2. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d postgres
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run database migrations**
   ```bash
   npm run migration:run
   ```

5. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

6. **Start development servers**

   In one terminal (backend):
   ```bash
   cd server
   npm run dev
   ```

   In another terminal (frontend):
   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:1001
   - Backend API: http://localhost:9999/api

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

---

## ⚙️ Environment Variables

### Server (.env)

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=/api

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=telescope
DB_PASSWORD=your_secure_password
DB_DATABASE=telescope

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Client (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 💻 Development

### Available Scripts

#### Server
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run migration:generate  # Generate new migration
npm run migration:run       # Run pending migrations
npm run migration:revert    # Revert last migration
npm run seed         # Seed database with sample data
npm run test         # Run tests
npm run lint         # Run ESLint
```

#### Client
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
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
