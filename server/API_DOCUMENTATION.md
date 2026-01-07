# Telescope API Documentation

> **People Management Platform - Backend API Reference**

**Base URL:** `http://localhost:9999/api`  
**Swagger UI:** `http://localhost:9999/docs`  
**API Version:** 1

---

## Table of Contents

- [Authentication](#authentication)
- [Endpoints Overview](#endpoints-overview)
- [Auth API](#auth-api)
- [Users API](#users-api)
- [Employees API](#employees-api)
- [Departments API](#departments-api)
- [Teams API](#teams-api)
- [Projects API](#projects-api)
- [Skills API](#skills-api)
- [Vacations API](#vacations-api)
- [Health API](#health-api)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Common Notes](#common-notes)

---

## Authentication

All protected endpoints require a JWT Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

### User Roles & Permissions

| Role       | Description                                      |
|------------|--------------------------------------------------|
| `admin`    | Full access to all resources                     |
| `manager`  | CRUD on employees, projects, teams; approve vacations |
| `employee` | Read access; create vacation requests            |

### Public Endpoints (No Auth Required)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`
- `GET /api/health/ready`

---

## Endpoints Overview

| Module      | Endpoints | Auth Required |
|-------------|-----------|---------------|
| Auth        | 5         | Partial       |
| Users       | 6         | Yes (Admin)   |
| Employees   | 10        | Yes           |
| Departments | 5         | Yes           |
| Teams       | 6         | Yes           |
| Projects    | 8         | Yes           |
| Skills      | 7         | Yes           |
| Vacations   | 6         | Yes           |
| Health      | 2         | No            |

---

## Auth API

### Register User
```http
POST /api/auth/register
```
**Public:** ✅

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "employee"  // Optional: admin | manager | employee
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": { "id": 1, "email": "john.doe@example.com", ... },
  "accessToken": "eyJhbGci..."
}
```

---

### Login
```http
POST /api/auth/login
```
**Public:** ✅

**Request Body:**
```json
{
  "email": "admin@inorain.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": { "id": 1, "email": "admin@inorain.com", ... },
  "accessToken": "eyJhbGci..."
}
```

---

### Logout
```http
POST /api/auth/logout
```
**Auth:** 🔒 Required

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Get Current User
```http
GET /api/auth/me
```
**Auth:** 🔒 Required

**Response (200):**
```json
{
  "id": 1,
  "email": "admin@inorain.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin",
  "isActive": true
}
```

---

### Refresh Token
```http
POST /api/auth/refresh
```
**Auth:** 🔒 Required

**Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGci..."
}
```

---

## Users API

> ⚠️ **All endpoints require `admin` role**

### List Users
```http
GET /api/users?page=1&limit=10&search=john&role=employee
```

**Query Parameters:**
| Param    | Type   | Default | Description               |
|----------|--------|---------|---------------------------|
| page     | number | 1       | Page number               |
| limit    | number | 10      | Items per page            |
| search   | string | -       | Search by name/email      |
| role     | string | -       | Filter by role            |
| isActive | bool   | -       | Filter by active status   |

**Response (200):**
```json
{
  "data": [...],
  "meta": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
```

---

### Get User
```http
GET /api/users/:id
```

---

### Create User
```http
POST /api/users
```
**Request Body:** Same as Register DTO

---

### Update User
```http
PUT /api/users/:id
```
**Request Body:** Partial User fields

---

### Delete User
```http
DELETE /api/users/:id
```

---

### Toggle User Status
```http
PATCH /api/users/:id/toggle-status
```

**Response (200):**
```json
{
  "message": "User activated successfully",
  "data": { "id": 1, "isActive": true }
}
```

---

## Employees API

### List Employees
```http
GET /api/employees?page=1&limit=10&departmentId=1&status=active
```

**Query Parameters:**
| Param        | Type   | Description                        |
|--------------|--------|------------------------------------|
| page         | number | Page number                        |
| limit        | number | Items per page                     |
| search       | string | Search by name/email/position      |
| departmentId | number | Filter by department               |
| teamId       | number | Filter by team                     |
| status       | string | Filter: active, vacation, inactive |
| englishLevel | string | Filter: A1, A2, B1, B2, C1, C2     |

---

### Get Employee
```http
GET /api/employees/:id
```
Returns full employee details with department, team, skills, and manager info.

---

### Create Employee
```http
POST /api/employees
```
**Roles:** `admin`, `manager`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",           // Optional
  "position": "Senior Developer",
  "departmentId": 1,                // Optional
  "teamId": 1,                      // Optional
  "managerId": 2,                   // Optional
  "englishLevel": "B2",             // Optional, default: B1
  "hireDate": "2024-01-15",
  "status": "active",               // Optional, default: active
  "avatarUrl": "https://...",       // Optional
  "bio": "Experienced developer..." // Optional
}
```

---

### Update Employee
```http
PUT /api/employees/:id
```
**Roles:** `admin`, `manager`

---

### Delete Employee
```http
DELETE /api/employees/:id
```
**Roles:** `admin`

---

### Get Employee Skills
```http
GET /api/employees/:id/skills
```

**Response (200):**
```json
[
  {
    "id": 1,
    "skillId": 5,
    "skill": { "id": 5, "name": "React", "category": "frontend" },
    "level": 4,
    "yearsOfExperience": 3.5
  }
]
```

---

### Add Skill to Employee
```http
POST /api/employees/:id/skills
```
**Roles:** `admin`, `manager`

**Request Body:**
```json
{
  "skillId": 1,
  "level": 3,                // 1-5 (BEGINNER to EXPERT)
  "yearsOfExperience": 2.5
}
```

---

### Remove Skill from Employee
```http
DELETE /api/employees/:id/skills/:skillId
```
**Roles:** `admin`, `manager`

---

### Get Employee Vacations
```http
GET /api/employees/:id/vacations
```

---

## Departments API

### List Departments
```http
GET /api/departments
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Engineering",
    "description": "Software development team",
    "_count": { "employees": 15, "teams": 4 }
  }
]
```

---

### Get Department
```http
GET /api/departments/:id
```
Returns department with teams and employees.

---

### Create Department
```http
POST /api/departments
```
**Roles:** `admin`

**Request Body:**
```json
{
  "name": "Marketing",
  "description": "Marketing and communications team"
}
```

---

### Update Department
```http
PUT /api/departments/:id
```
**Roles:** `admin`

---

### Delete Department
```http
DELETE /api/departments/:id
```
**Roles:** `admin`

---

## Teams API

### List Teams
```http
GET /api/teams?departmentId=1
```

**Query Parameters:**
| Param        | Type   | Description            |
|--------------|--------|------------------------|
| departmentId | number | Filter by department   |

---

### Get Team
```http
GET /api/teams/:id
```

---

### Get Team Members
```http
GET /api/teams/:id/members
```
Returns team members with their skills.

---

### Create Team
```http
POST /api/teams
```
**Roles:** `admin`, `manager`

**Request Body:**
```json
{
  "name": "Frontend Team",
  "departmentId": 1,
  "description": "React and Vue developers"
}
```

---

### Update Team
```http
PUT /api/teams/:id
```
**Roles:** `admin`, `manager`

---

### Delete Team
```http
DELETE /api/teams/:id
```
**Roles:** `admin`

---

## Projects API

### List Projects
```http
GET /api/projects?page=1&status=active&priority=high
```

**Query Parameters:**
| Param    | Type   | Description                               |
|----------|--------|-------------------------------------------|
| page     | number | Page number                               |
| limit    | number | Items per page                            |
| search   | string | Search by name                            |
| status   | string | planning, active, on_hold, completed, cancelled |
| priority | string | low, medium, high                         |

---

### Get Project
```http
GET /api/projects/:id
```

---

### Get Project Team
```http
GET /api/projects/:id/team
```
Returns all team members assigned to the project.

---

### Create Project
```http
POST /api/projects
```
**Roles:** `admin`, `manager`

**Request Body:**
```json
{
  "name": "Platform Redesign",
  "description": "Complete redesign of the main platform UI",
  "status": "planning",       // Optional
  "priority": "high",         // Optional
  "startDate": "2024-01-15",
  "endDate": "2024-06-30",    // Optional
  "progress": 0               // Optional, 0-100
}
```

---

### Update Project
```http
PUT /api/projects/:id
```
**Roles:** `admin`, `manager`

---

### Delete Project
```http
DELETE /api/projects/:id
```
**Roles:** `admin`

---

### Add Team Member to Project
```http
POST /api/projects/:id/assignments
```
**Roles:** `admin`, `manager`

**Request Body:**
```json
{
  "employeeId": 1,
  "role": "Lead Developer",
  "startDate": "2024-01-15",
  "endDate": "2024-06-30"   // Optional
}
```

---

### Remove Team Member from Project
```http
DELETE /api/projects/:id/assignments/:assignmentId
```
**Roles:** `admin`, `manager`

---

## Skills API

### List Skills
```http
GET /api/skills
```

---

### Get Skills by Category
```http
GET /api/skills/by-category
```

**Response (200):**
```json
{
  "frontend": [{ "id": 1, "name": "React" }, ...],
  "backend": [{ "id": 6, "name": "Node.js" }, ...],
  "devops": [...],
  "design": [...]
}
```

---

### Get Skills Matrix
```http
GET /api/skills/matrix
```
Returns skills with employee counts per skill level.

---

### Get Skill
```http
GET /api/skills/:id
```

---

### Create Skill
```http
POST /api/skills
```
**Roles:** `admin`, `manager`

**Request Body:**
```json
{
  "name": "GraphQL",
  "category": "backend",   // frontend, backend, devops, design, management, other
  "description": "API query language"
}
```

---

### Update Skill
```http
PUT /api/skills/:id
```
**Roles:** `admin`

---

### Delete Skill
```http
DELETE /api/skills/:id
```
**Roles:** `admin`

---

## Vacations API

### List Vacations
```http
GET /api/vacations?page=1&employeeId=1&status=pending
```

**Query Parameters:**
| Param      | Type   | Description                          |
|------------|--------|--------------------------------------|
| page       | number | Page number                          |
| limit      | number | Items per page                       |
| employeeId | number | Filter by employee                   |
| status     | string | pending, approved, rejected, cancelled |
| type       | string | vacation, sick_leave, day_off, remote |
| startDate  | string | Filter from date                     |
| endDate    | string | Filter to date                       |

---

### Get Vacation
```http
GET /api/vacations/:id
```

---

### Create Vacation Request
```http
POST /api/vacations
```

**Request Body:**
```json
{
  "employeeId": 1,
  "type": "vacation",        // vacation, sick_leave, day_off, remote
  "startDate": "2024-07-01",
  "endDate": "2024-07-15",
  "reason": "Annual vacation" // Optional
}
```

---

### Approve Vacation
```http
PUT /api/vacations/:id/approve
```
**Roles:** `admin`, `manager`

---

### Reject Vacation
```http
PUT /api/vacations/:id/reject
```
**Roles:** `admin`, `manager`

**Request Body:**
```json
{
  "rejectionReason": "Team deadline conflict"
}
```

---

### Cancel Vacation
```http
PUT /api/vacations/:id/cancel
```

---

## Health API

### Health Check
```http
GET /api/health
```
**Public:** ✅

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5
}
```

---

### Readiness Check
```http
GET /api/health/ready
```
**Public:** ✅

**Response (200):**
```json
{
  "status": "ready",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Data Models

### Enums Reference

#### UserRole
```
admin | manager | employee
```

#### EmployeeStatus
```
active | vacation | inactive
```

#### EnglishLevel
```
A1 | A2 | B1 | B2 | C1 | C2
```

#### SkillCategory
```
frontend | backend | devops | design | management | other
```

#### SkillLevel
```
1 = BEGINNER
2 = ELEMENTARY
3 = INTERMEDIATE
4 = ADVANCED
5 = EXPERT
```

#### ProjectStatus
```
planning | active | on_hold | completed | cancelled
```

#### ProjectPriority
```
low | medium | high
```

#### VacationType
```
vacation | sick_leave | day_off | remote
```

#### VacationStatus
```
pending | approved | rejected | cancelled
```

---

## Error Handling

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    { "field": "email", "message": "Please provide a valid email address" }
  ]
}
```

### Common HTTP Status Codes

| Code | Description                          |
|------|--------------------------------------|
| 200  | Success                              |
| 201  | Created                              |
| 400  | Bad Request (validation failed)      |
| 401  | Unauthorized (invalid/missing token) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not Found                            |
| 409  | Conflict (e.g., email already exists)|
| 429  | Too Many Requests (rate limited)     |
| 500  | Internal Server Error                |

---

## Common Notes

### Date Format
All dates should be in `YYYY-MM-DD` format (ISO 8601).

### Pagination Response
All paginated endpoints return:
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Default Credentials (Development)
```
Email: admin@inorain.com
Password: admin123
Role: admin
```

### Rate Limiting
The API is protected by rate limiting. Excessive requests will receive `429 Too Many Requests`.

### CORS
CORS is enabled for development. Configure allowed origins for production.

---

## Quick Start

### 1. Get Access Token
```bash
curl -X POST http://localhost:9999/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@inorain.com","password":"admin123"}'
```

### 2. Use Token in Requests
```bash
curl http://localhost:9999/api/employees \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Create Employee
```bash
curl -X POST http://localhost:9999/api/employees \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "position": "Developer",
    "hireDate": "2024-01-15"
  }'
```

---

*Generated for Telescope API v2.0.0*

