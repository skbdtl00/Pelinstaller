# 🏗️ Reverz Bot Hosting - Architecture Documentation

## System Overview

Reverz Bot Hosting is a modern, full-stack web application that provides bot hosting services powered by Pelican Panel infrastructure. The system consists of three main components:

```
┌─────────────────────────────────────────────────────────────┐
│                        Users/Clients                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Landing   │  │   Login/   │  │  Dashboard │            │
│  │    Page    │  │  Register  │  │  (User/    │            │
│  │            │  │            │  │   Admin)   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
                         API Calls (JWT)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │    Auth    │  │   Plans    │  │  Servers   │            │
│  │    API     │  │    API     │  │    API     │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────┐  ┌────────────┐                            │
│  │   Users    │  │   Config   │                            │
│  │    API     │  │    API     │                            │
│  └────────────┘  └────────────┘                            │
└─────────────────────────────────────────────────────────────┘
                 │                          │
                 │                          │
                 ▼                          ▼
        ┌─────────────────┐      ┌──────────────────┐
        │   PostgreSQL    │      │  Pelican Panel   │
        │    Database     │      │      API         │
        └─────────────────┘      └──────────────────┘
                                          │
                                          ▼
                                 ┌──────────────────┐
                                 │ Server Instances │
                                 │ (Docker/Wings)   │
                                 └──────────────────┘
```

## Component Architecture

### 1. Frontend Layer (Next.js + TypeScript)

**Location:** `/reverz-bot-hosting/frontend/`

**Technology Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Client-side state management

**Structure:**
```
frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── register/
│   │   └── page.tsx          # Registration page
│   ├── dashboard/
│   │   └── page.tsx          # User dashboard
│   └── admin/
│       └── page.tsx          # Admin dashboard
├── lib/
│   ├── api.ts                # API client
│   └── auth.ts               # Auth utilities
└── components/               # Reusable components
```

**Key Features:**
- Server-side rendering (SSR) for SEO
- Client-side routing
- JWT authentication
- Thai language interface
- Responsive design

### 2. Backend Layer (Express.js + Node.js)

**Location:** `/reverz-bot-hosting/backend/`

**Technology Stack:**
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT for authentication
- Axios for external API calls

**Structure:**
```
backend/
├── server.js                 # Main entry point
├── config/
│   └── database.js           # Database configuration
├── models/
│   ├── User.js               # User model
│   ├── Plan.js               # Plan model
│   ├── Server.js             # Server model
│   ├── ApiConfig.js          # API config model
│   ├── EggTemplate.js        # Egg template model
│   └── index.js              # Model relationships
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── planController.js     # Plan management
│   ├── serverController.js   # Server management
│   ├── userController.js     # User management
│   └── apiConfigController.js # Config management
├── routes/
│   ├── auth.js               # Auth routes
│   ├── plans.js              # Plan routes
│   ├── servers.js            # Server routes
│   ├── users.js              # User routes
│   └── config.js             # Config routes
├── middleware/
│   └── auth.js               # JWT verification
└── utils/
    └── pelicanClient.js      # Pelican API client
```

**API Architecture:**
- RESTful API design
- JWT-based authentication
- Role-based access control (RBAC)
- Error handling middleware
- Request validation

### 3. Database Layer (PostgreSQL)

**Location:** `/reverz-bot-hosting/database/`

**Schema:**
```sql
users                     # User accounts
  ├── id (PK)
  ├── username
  ├── email
  ├── password_hash
  ├── role (user/support/admin)
  └── status (active/suspended)

plans                     # Hosting plans
  ├── id (PK)
  ├── name
  ├── price
  ├── cpu (vCore)
  ├── ram (MB)
  ├── disk (MB)
  ├── allowed_runtimes[]
  ├── max_servers
  ├── visibility
  └── tags[]

servers                   # Server instances
  ├── id (PK)
  ├── user_id (FK → users)
  ├── plan_id (FK → plans)
  ├── pelican_server_id
  ├── name
  ├── runtime
  ├── egg_id
  ├── egg_name
  ├── status
  └── expires_at

api_config               # System configuration
  ├── id (PK)
  ├── pelican_base_url
  ├── pelican_api_key
  ├── default_node_id
  ├── queue_delay
  └── webhook_url

egg_templates            # Runtime templates
  ├── id (PK)
  ├── runtime_name
  ├── egg_id
  ├── egg_name
  └── description
```

**Relationships:**
- One User → Many Servers
- One Plan → Many Servers
- Many-to-Many: Users ↔ Plans (through subscriptions - future)

### 4. External Integration (Pelican Panel)

**Integration Points:**
- Server creation via Pelican API
- Server deletion
- Server suspension/unsuspension
- Power management (start, stop, restart, kill)
- Resource allocation
- Server status monitoring

**API Client (`pelicanClient.js`):**
```javascript
class PelicanClient {
  - initialize()              # Load config from database
  - createServer()            # Create new server
  - deleteServer()            # Delete server
  - suspendServer()           # Suspend server
  - unsuspendServer()         # Unsuspend server
  - getServer()               # Get server details
  - updateServerResources()   # Update CPU/RAM/Disk
  - sendPowerAction()         # Power management
}
```

## Data Flow

### User Registration Flow
```
1. User submits registration form (Frontend)
2. Frontend → POST /api/auth/register (Backend)
3. Backend validates input
4. Backend hashes password with bcrypt
5. Backend creates user in PostgreSQL
6. Backend generates JWT token
7. Backend returns token + user data
8. Frontend stores token in localStorage
9. Frontend redirects to dashboard
```

### Server Creation Flow
```
1. User selects plan and runtime (Frontend)
2. Frontend → POST /api/servers (Backend)
3. Backend validates user permissions
4. Backend retrieves plan details from PostgreSQL
5. Backend calls Pelican API to create server
6. Pelican creates Docker container with Wings
7. Pelican returns server ID
8. Backend stores server info in PostgreSQL
9. Backend returns server data to frontend
10. Frontend updates UI with new server
```

### Admin User Management Flow
```
1. Admin navigates to users tab (Frontend)
2. Frontend → GET /api/users (Backend)
3. Backend verifies admin role via JWT
4. Backend queries PostgreSQL for all users
5. Backend returns user list with server counts
6. Frontend displays users in table
7. Admin clicks suspend/delete button
8. Frontend → POST /api/users/:id/suspend (Backend)
9. Backend updates user status in PostgreSQL
10. Frontend refreshes user list
```

## Security Architecture

### Authentication
- **JWT Tokens:** 7-day expiration
- **Password Hashing:** bcrypt with salt rounds = 10
- **Token Storage:** localStorage (client-side)
- **Protected Routes:** Middleware checks token validity

### Authorization
**Role-Based Access Control (RBAC):**

| Role    | Permissions                                    |
|---------|------------------------------------------------|
| User    | Own servers, create servers, view plans       |
| Support | View all servers, view all users              |
| Admin   | Full access to all resources                  |

**Middleware Stack:**
```
Request → authenticateToken → requireAdmin/requireSupport → Controller
```

### API Security
- CORS configuration
- Environment variable protection
- SQL injection prevention (Sequelize parameterized queries)
- XSS protection (input sanitization)
- Rate limiting (recommended for production)

## Scalability Considerations

### Horizontal Scaling
- **Frontend:** Deploy multiple Next.js instances behind load balancer
- **Backend:** Deploy multiple Express instances with PM2 cluster mode
- **Database:** PostgreSQL replication (master-slave)

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Database connection pooling (already configured)
- Optimize queries with indexes (already implemented)

### Caching Strategy (Future Enhancement)
- Redis for session storage
- Cache Pelican API responses
- Cache plan data
- Implement CDN for static assets

## Performance Optimizations

### Database
- Indexed columns: `email`, `role`, `user_id`, `status`, `expires_at`
- Connection pooling: Max 5 connections
- Query optimization with Sequelize includes

### Backend
- Async/await for non-blocking operations
- Error handling for all async operations
- Structured logging for debugging

### Frontend
- Next.js automatic code splitting
- Image optimization
- Lazy loading components
- Client-side caching

## Monitoring & Logging

### Backend Logging
```javascript
console.log()   // Development
console.error() // Error tracking
```

### Recommended Production Monitoring
- PM2 monitoring dashboard
- PostgreSQL query performance logs
- Nginx access/error logs
- Application performance monitoring (APM) tools

## Deployment Architecture

### Development Environment
```
localhost:3000 → Frontend (Next.js dev server)
localhost:3001 → Backend (Node.js/Express)
localhost:5432 → PostgreSQL
```

### Production Environment
```
yourdomain.com → Nginx → Next.js (PM2) → Frontend
api.yourdomain.com → Nginx → Express (PM2) → Backend
localhost:5432 → PostgreSQL
```

**Process Management:**
- PM2 for Node.js processes
- Nginx as reverse proxy
- Let's Encrypt for SSL/TLS
- Ubuntu/Debian server

## Future Enhancements

### Planned Features
1. **Billing System**
   - Wallet system
   - Top-up functionality
   - Auto-renew subscriptions
   - Payment gateway integration

2. **Analytics Dashboard**
   - Revenue tracking
   - User growth metrics
   - Server usage statistics
   - Node load monitoring

3. **Automation**
   - Auto-delete expired servers
   - Scheduled backups
   - Usage alerts

4. **Additional Integrations**
   - Discord webhooks
   - Email notifications
   - Bot templates library

## Maintenance & Updates

### Regular Maintenance
- Database backups (daily)
- Log rotation
- Security updates
- Dependency updates

### Update Process
1. Pull latest code
2. Run database migrations (if any)
3. Update dependencies (`npm install`)
4. Build frontend (`npm run build`)
5. Restart services with PM2
6. Test functionality

## Conclusion

Reverz Bot Hosting provides a complete, production-ready bot hosting platform with:
- Modern tech stack (Next.js + Express + PostgreSQL)
- Secure authentication and authorization
- Pelican Panel integration
- Thai language interface
- Role-based access control
- Scalable architecture

The system is designed to be maintainable, extensible, and production-ready for real-world deployment.
