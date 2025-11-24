# 🤖 Reverz Bot Hosting Platform

This repository now includes **Reverz Bot Hosting**, a modern bot-hosting platform integrated with Pelican Panel!

## 📍 Location

The Reverz Bot Hosting platform is located in:
```
/reverz-bot-hosting/
```

## 🎯 What is Reverz Bot Hosting?

Reverz Bot Hosting is a complete web application that provides:
- 🎮 Easy bot hosting management (Node.js, Python, and more)
- 🔧 Pelican Panel integration for server lifecycle management
- 💰 Plan-based subscription system (billing coming soon)
- 👥 Multi-user support with role-based access (User, Support, Admin)
- 🌐 Thai language interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Pelican Panel with API access

### Installation

1. **Navigate to the platform directory:**
   ```bash
   cd reverz-bot-hosting
   ```

2. **Set up the database:**
   ```bash
   # Create database
   createdb reverz_bot_hosting
   
   # Import schema
   psql reverz_bot_hosting < database/schema.sql
   ```

3. **Configure and start backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your settings
   npm install
   npm run dev
   ```

4. **Configure and start frontend:**
   ```bash
   cd frontend
   cp .env.local.example .env.local
   # Edit .env.local with your settings
   npm install
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📚 Documentation

Detailed documentation is available in:
```
/reverz-bot-hosting/README.md
```

## 🌟 Key Features

### Admin Features
- ✅ Plan management (create, edit, delete)
- ✅ User management (create, suspend, delete)
- ✅ Server management (view, suspend, delete)
- ✅ API configuration (Pelican Panel integration)
- ✅ Egg templates management

### User Features
- ✅ Server creation and management
- ✅ Power controls (start, stop, restart)
- ✅ View available plans
- ✅ Profile management
- 🔜 Billing and top-up (coming soon)

## 🔗 Integration with Pelinstaller

While this repository primarily contains the Pelican Panel installer scripts, the Reverz Bot Hosting platform:
- Uses Pelican Panel as its backend infrastructure
- Requires a working Pelican Panel installation
- Manages servers through Pelican Panel API
- All server features are handled by Pelican Panel

**Important:** Install Pelican Panel first using the installer scripts in this repo, then set up Reverz Bot Hosting.

## 🛠 Tech Stack

- **Frontend:** Next.js 14 with TypeScript
- **Backend:** Express.js with Sequelize ORM
- **Database:** PostgreSQL
- **Integration:** Pelican Panel API
- **UI:** Tailwind CSS

## 📖 API Documentation

The platform provides REST API endpoints for:
- Authentication (`/api/auth/*`)
- Plans management (`/api/plans/*`)
- Server management (`/api/servers/*`)
- User management (`/api/users/*` - Admin)
- Configuration (`/api/config/*` - Admin)

Full API documentation available in the platform's README.

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- API key security for Pelican integration

## 🤝 Support

For issues specific to Reverz Bot Hosting, please create an issue with the `[Reverz]` tag.

For Pelican Panel installation issues, use the standard issue reporting process.

## 📝 License

GPL-3.0 (inherited from Pelinstaller)

---

**Note:** This is a separate application from the Pelican Panel installer. It's a web platform that uses Pelican Panel as its infrastructure provider.
