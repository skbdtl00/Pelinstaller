-- Reverz Bot Hosting Database Schema
-- PostgreSQL Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- user, support, admin
    status VARCHAR(50) DEFAULT 'active', -- active, suspended
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    cpu INTEGER NOT NULL, -- vCore
    ram INTEGER NOT NULL, -- MB
    disk INTEGER NOT NULL, -- MB
    allowed_runtimes TEXT[], -- Array of runtime names
    max_servers INTEGER DEFAULT 1,
    visibility VARCHAR(50) DEFAULT 'public', -- public, hidden
    tags TEXT[], -- Array of tags like "Recommended", "Best Value"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Servers Table
CREATE TABLE IF NOT EXISTS servers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES plans(id),
    pelican_server_id INTEGER, -- ID from Pelican Panel
    name VARCHAR(255) NOT NULL,
    runtime VARCHAR(50) NOT NULL, -- nodejs, python, etc
    egg_id INTEGER NOT NULL,
    egg_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, deleted
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API Configuration Table
CREATE TABLE IF NOT EXISTS api_config (
    id SERIAL PRIMARY KEY,
    pelican_base_url VARCHAR(255) NOT NULL,
    pelican_api_key TEXT NOT NULL,
    default_node_id INTEGER,
    queue_delay INTEGER DEFAULT 5000, -- milliseconds
    webhook_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Egg Templates Table
CREATE TABLE IF NOT EXISTS egg_templates (
    id SERIAL PRIMARY KEY,
    runtime_name VARCHAR(50) UNIQUE NOT NULL, -- nodejs, python, etc
    egg_id INTEGER NOT NULL,
    egg_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES plans(id),
    server_id INTEGER REFERENCES servers(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active', -- active, expired, cancelled
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    auto_renew BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50), -- server, plan, user, etc
    entity_id INTEGER,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_servers_user_id ON servers(user_id);
CREATE INDEX idx_servers_status ON servers(status);
CREATE INDEX idx_servers_expires_at ON servers(expires_at);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Insert default admin user (password: admin123 - should be changed)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@reverz.local', '$2a$10$YourHashHere', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default API configuration (placeholder)
INSERT INTO api_config (pelican_base_url, pelican_api_key) 
VALUES ('https://panel.example.com', 'your-api-key-here')
ON CONFLICT DO NOTHING;

-- Insert default egg templates
INSERT INTO egg_templates (runtime_name, egg_id, egg_name, description) VALUES
('nodejs', 1, 'Node.js', 'Node.js LTS runtime for Discord bots and applications'),
('python', 2, 'Python', 'Python stable runtime for bot development')
ON CONFLICT (runtime_name) DO NOTHING;
