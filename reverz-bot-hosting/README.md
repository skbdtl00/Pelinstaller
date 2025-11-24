# Reverz Bot Hosting

> แพลตฟอร์มโฮสต์บอทที่ทันสมัย มุ่งเน้นความเรียบง่าย การทำงานอัตโนมัติ และการจัดการโครงสร้างพื้นฐานด้วย Pelican Panel

## 🏷 **Service Name**

**Reverz Bot Hosting** - บริการโฮสต์บอทที่ใช้งานง่าย ด้วยพลัง Pelican Panel

## 🧠 **Tech Stack**

* **Backend:** Express.js + PostgreSQL + Sequelize ORM
* **Frontend:** Next.js (Thai Dashboard)
* **Panel Integration:** Pelican Panel API
* **Supported Runtimes:**
  * Node.js (latest LTS + selectable versions)
  * Python (latest stable + selectable versions)
  * More languages supported via egg ID and name configuration
* **System uses egg-based templates** (ID + Name) to create hostable bot servers

---

## 📋 **Features Overview**

### **1. Plan Management (Admin)**

Admins can:
* ✅ Create new hosting plans
* ✅ Edit existing plans
* ✅ Delete plans
* ✅ Set price (monthly)
* ✅ Configure per-plan resources:
  * CPU (vCore)
  * RAM (MB)
  * Disk (MB)
  * Allowed runtime(s)
  * Max servers per plan
* ✅ Toggle plan visibility (public / hidden)
* ✅ Add plan tags (e.g. "Recommended", "Best Value")

### **2. Server Management**

**Admin capabilities:**
* ✅ Create server for any user
* ✅ Delete server (force)
* ✅ Suspend / unsuspend server
* ✅ Send power actions (restart / stop / kill)
* ✅ Integration with Pelican Panel for server lifecycle

**User capabilities:**
* ✅ Create their own servers
* ✅ View server details
* ✅ Delete their servers
* ✅ Send power actions to their servers
* All server management features available through Pelican Panel

### **3. User Management (Admin)**

Admins can:
* ✅ Create / edit / delete users
* ✅ View server count per user
* ✅ Suspend / unsuspend user account
* ✅ Set user roles (User, Support, Admin)
* ✅ Reset password

### **4. API Configuration (Admin)**

Admin can configure:
* ✅ Pelican panel base URL
* ✅ Pelican API key
* ✅ Default eggs (ID + name) for:
  * Node.js
  * Python
  * Custom runtime templates
* ✅ Queue delay & safe provision settings
* ✅ Webhook integration (Discord alerts - planned)

### **5. Billing System**

**Current version:** Topup = null (coming soon)

**Planned features:**
* Wallet system
* Auto-renew subscription
* Bank slip verification (optional)
* Promo codes
* Crypto & credit-card support (optional)

### **6. Dashboard (User)**

Users can:
* ✅ View active servers
* ✅ View plan details
* ✅ Update profile
* 🔜 View usage stats (CPU/RAM/Network live)
* 🔜 Renew plan (when top-up system is implemented)

---

## 🚀 **Getting Started**

### **Prerequisites**

* Node.js 18+ and npm
* PostgreSQL 12+
* Pelican Panel installation with API access

### **Installation**

#### 1. Clone the Repository

```bash
cd /path/to/Pelinstaller
cd reverz-bot-hosting
```

#### 2. Setup Database

```bash
# Create PostgreSQL database
createdb reverz_bot_hosting

# Import schema
psql reverz_bot_hosting < database/schema.sql
```

#### 3. Setup Backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Install dependencies
npm install

# Start development server
npm run dev
```

**Backend Environment Variables:**

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=reverz_bot_hosting
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_change_in_production

PELICAN_BASE_URL=https://panel.example.com
PELICAN_API_KEY=your_pelican_api_key
DEFAULT_NODE_ID=1
```

#### 4. Setup Frontend

```bash
cd frontend

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local
nano .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend Environment Variables:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### 5. Access the Application

* **Frontend:** http://localhost:3000
* **Backend API:** http://localhost:3001
* **API Health Check:** http://localhost:3001/health

### **Default Admin Credentials**

After running the database schema, update the default admin password:

```sql
-- Generate a bcrypt hash for your password
-- Then update the admin user
UPDATE users SET password_hash = '$2a$10$YourBcryptHashHere' WHERE email = 'admin@reverz.local';
```

Or create a new admin user via API after the system is running.

---

## 📁 **Project Structure**

```
reverz-bot-hosting/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # API controllers
│   ├── middleware/       # Authentication middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # Express routes
│   ├── utils/           # Utility functions (Pelican client)
│   ├── .env.example     # Environment template
│   ├── package.json
│   └── server.js        # Main server file
│
├── frontend/
│   ├── app/             # Next.js App Router pages
│   │   ├── admin/       # Admin dashboard (planned)
│   │   ├── dashboard/   # User dashboard (planned)
│   │   ├── login/       # Login page
│   │   └── register/    # Registration page
│   ├── components/      # React components (planned)
│   ├── lib/            # API client & utilities
│   ├── .env.local.example
│   └── package.json
│
└── database/
    └── schema.sql       # PostgreSQL schema
```

---

## 🔌 **API Endpoints**

### Authentication

* `POST /api/auth/login` - User login
* `POST /api/auth/register` - User registration
* `GET /api/auth/me` - Get current user (authenticated)

### Plans

* `GET /api/plans` - Get all plans
* `GET /api/plans/:id` - Get single plan
* `POST /api/plans` - Create plan (admin)
* `PUT /api/plans/:id` - Update plan (admin)
* `DELETE /api/plans/:id` - Delete plan (admin)

### Servers

* `GET /api/servers` - Get all servers
* `GET /api/servers/:id` - Get single server
* `POST /api/servers` - Create server
* `DELETE /api/servers/:id` - Delete server
* `POST /api/servers/:id/power` - Send power action
* `POST /api/servers/:id/suspend` - Suspend server (admin)
* `POST /api/servers/:id/unsuspend` - Unsuspend server (admin)

### Users (Admin Only)

* `GET /api/users` - Get all users
* `GET /api/users/:id` - Get single user
* `POST /api/users` - Create user
* `PUT /api/users/:id` - Update user
* `DELETE /api/users/:id` - Delete user
* `POST /api/users/:id/suspend` - Suspend user
* `POST /api/users/:id/unsuspend` - Unsuspend user

### Configuration (Admin Only)

* `GET /api/config` - Get API configuration
* `PUT /api/config` - Update API configuration
* `GET /api/config/eggs` - Get egg templates
* `POST /api/config/eggs` - Create egg template
* `PUT /api/config/eggs/:id` - Update egg template
* `DELETE /api/config/eggs/:id` - Delete egg template

---

## 💡 **Extra Features (Roadmap)**

* **Bot Uptime Status Page** - Auto-generated public status per bot
* **Server Migration Button** - Move server to another node with one click
* **Global Node Status** - Admin & user view of each node load
* **Auto Backup System** - Plan-based daily or hourly snapshots
* **Script Templates** - Quick-deploy bot frameworks (Discord.js, PyCord, Telegram Bot API, etc.)
* **Task Automation** - Delete immediately when expired
* **Admin Analytics**
  * Revenue per month
  * New users
  * Active servers
  * Node usage heatmap

---

## 🛠 **Development**

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

---

## 🔒 **Security Notes**

* Always change default admin credentials
* Use strong JWT secrets in production
* Enable HTTPS in production
* Secure your Pelican API keys
* Implement rate limiting for API endpoints
* Regular security audits recommended

---

## 📝 **Important Notes**

* Thai dashboard - All UI text is in Thai language
* All server features are managed in Pelican Panel
* Only these features are NOT managed in panel:
  * Top-up system (coming soon)
  * Buy Server (through this platform)
  * Web surface user management
  * Plans edit/delete/create
  * Plan prices edit/delete/create
  * Auto delete server on expiry

---

## 📄 **License**

This project inherits the GPL-3.0 license from the Pelinstaller project.

---

## 🤝 **Support**

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using Next.js, Express.js, and PostgreSQL**
