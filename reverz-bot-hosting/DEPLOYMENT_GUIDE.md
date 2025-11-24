# 🚀 Reverz Bot Hosting - Deployment Guide

This guide covers production deployment of the Reverz Bot Hosting platform.

## Prerequisites

Before deploying, ensure you have:
- ✅ Ubuntu 20.04+ or Debian 10+ server
- ✅ Root or sudo access
- ✅ Domain name pointed to your server
- ✅ Pelican Panel already installed and configured
- ✅ Pelican Panel API key with admin access

## Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

## Step 2: Setup PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE reverz_bot_hosting;
CREATE USER reverz_admin WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE reverz_bot_hosting TO reverz_admin;
\q
```

## Step 3: Clone and Setup Application

```bash
# Navigate to web directory
cd /var/www

# Clone repository (or upload your files)
git clone https://github.com/your-repo/Pelinstaller.git
cd Pelinstaller/reverz-bot-hosting

# Setup Backend
cd backend
cp .env.example .env
nano .env  # Edit with your configuration
npm install
npm run build  # If you have a build script

# Setup Frontend
cd ../frontend
cp .env.local.example .env.local
nano .env.local  # Edit with your configuration
npm install
npm run build
```

## Step 4: Configure Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=production

DB_HOST=localhost
DB_PORT=5432
DB_NAME=reverz_bot_hosting
DB_USER=reverz_admin
DB_PASSWORD=your_secure_password_here

JWT_SECRET=your_very_long_random_jwt_secret_here

PELICAN_BASE_URL=https://panel.yourdomain.com
PELICAN_API_KEY=your_pelican_api_key_here
DEFAULT_NODE_ID=1
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## Step 5: Import Database Schema

```bash
cd /var/www/Pelinstaller/reverz-bot-hosting
psql -U reverz_admin -d reverz_bot_hosting < database/schema.sql
```

## Step 6: Create Default Admin User

```bash
# Connect to database
psql -U reverz_admin -d reverz_bot_hosting

# Generate password hash (use Node.js)
# In a separate terminal:
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourAdminPassword', 10));"

# Copy the hash and update the database
UPDATE users SET password_hash = 'your_bcrypt_hash_here' WHERE email = 'admin@reverz.local';
# Or create a new admin
INSERT INTO users (username, email, password_hash, role) VALUES ('admin', 'admin@yourdomain.com', 'your_bcrypt_hash_here', 'admin');
\q
```

## Step 7: Setup PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start backend
cd /var/www/Pelinstaller/reverz-bot-hosting/backend
pm2 start server.js --name reverz-backend

# Start frontend
cd /var/www/Pelinstaller/reverz-bot-hosting/frontend
pm2 start npm --name reverz-frontend -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs
```

## Step 8: Configure Nginx

Create Nginx configuration for backend API:

```bash
sudo nano /etc/nginx/sites-available/reverz-api
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Create Nginx configuration for frontend:

```bash
sudo nano /etc/nginx/sites-available/reverz-frontend
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable sites and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/reverz-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/reverz-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 9: Setup SSL with Let's Encrypt

```bash
# For API domain
sudo certbot --nginx -d api.yourdomain.com

# For main domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Step 10: Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Step 11: Verify Deployment

1. Check backend API:
   ```bash
   curl https://api.yourdomain.com/health
   ```

2. Visit your website:
   ```
   https://yourdomain.com
   ```

3. Login with admin credentials

4. Configure API settings in admin dashboard:
   - Pelican Panel URL
   - API Key
   - Default Node ID
   - Egg templates

## Post-Deployment Tasks

### 1. Monitor Logs

```bash
# View PM2 logs
pm2 logs reverz-backend
pm2 logs reverz-frontend

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Setup Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3. Backup Strategy

Create backup script:

```bash
sudo nano /usr/local/bin/reverz-backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/reverz"
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U reverz_admin reverz_bot_hosting | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup uploaded files (if any)
# tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/uploads

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
chmod +x /usr/local/bin/reverz-backup.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add line:
0 2 * * * /usr/local/bin/reverz-backup.sh >> /var/log/reverz-backup.log 2>&1
```

### 4. Security Hardening

```bash
# Restrict PostgreSQL access
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Ensure only local connections are allowed

# Set proper file permissions
sudo chown -R www-data:www-data /var/www/Pelinstaller/reverz-bot-hosting
sudo chmod -R 755 /var/www/Pelinstaller/reverz-bot-hosting

# Protect environment files
chmod 600 /var/www/Pelinstaller/reverz-bot-hosting/backend/.env
chmod 600 /var/www/Pelinstaller/reverz-bot-hosting/frontend/.env.local
```

### 5. Setup Auto-Update (Optional)

Create update script:

```bash
sudo nano /usr/local/bin/reverz-update.sh
```

```bash
#!/bin/bash
cd /var/www/Pelinstaller/reverz-bot-hosting

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install
pm2 restart reverz-backend

# Update frontend
cd ../frontend
npm install
npm run build
pm2 restart reverz-frontend

echo "Update completed"
```

## Troubleshooting

### Backend not starting
```bash
pm2 logs reverz-backend
# Check for database connection errors
# Verify .env file settings
```

### Frontend not loading
```bash
pm2 logs reverz-frontend
# Check API_URL in .env.local
# Verify backend is running
```

### Database connection issues
```bash
# Test connection
psql -U reverz_admin -d reverz_bot_hosting -h localhost

# Check PostgreSQL status
sudo systemctl status postgresql
```

### Nginx errors
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

## Performance Optimization

### 1. Enable Gzip Compression

Add to Nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### 2. Setup Redis Caching (Optional)

```bash
sudo apt install redis-server
npm install redis ioredis  # In backend directory
```

### 3. Database Optimization

```bash
# Connect to database
psql -U reverz_admin reverz_bot_hosting

# Analyze tables
ANALYZE;

# Vacuum
VACUUM ANALYZE;
```

## Maintenance

### Regular Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js packages
cd /var/www/Pelinstaller/reverz-bot-hosting/backend
npm update

cd /var/www/Pelinstaller/reverz-bot-hosting/frontend
npm update
```

### Monitor Resources
```bash
# Check disk space
df -h

# Check memory
free -h

# Check PM2 status
pm2 status

# Check database size
psql -U reverz_admin -d reverz_bot_hosting -c "SELECT pg_size_pretty(pg_database_size('reverz_bot_hosting'));"
```

## Support

For deployment issues:
1. Check logs first (PM2, Nginx, PostgreSQL)
2. Verify all environment variables
3. Ensure Pelican Panel is accessible
4. Create an issue with deployment logs

---

**Remember to:**
- Keep your JWT secret secure
- Regularly backup your database
- Monitor server resources
- Update dependencies regularly
- Keep SSL certificates renewed
