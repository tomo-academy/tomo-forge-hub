-- TOMO Academy NeonDB Schema
-- Run this in your Neon SQL Editor to create all tables

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  employee_id TEXT UNIQUE NOT NULL,
  join_date DATE NOT NULL,
  avatar_url TEXT,
  location TEXT,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'offline')),
  bio TEXT,
  skills JSONB DEFAULT '[]',
  social_links JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{"videos": 0, "tasks": 0, "rating": 0, "projects": 0}',
  card_color TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_id TEXT UNIQUE,
  youtube_url TEXT,
  thumbnail_url TEXT,
  duration TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]',
  uploaded_by TEXT REFERENCES employees(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('processing', 'published', 'draft', 'scheduled')),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to TEXT REFERENCES employees(id),
  assigned_by TEXT REFERENCES employees(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Revenue Table
CREATE TABLE IF NOT EXISTS revenue (
  id TEXT PRIMARY KEY,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  ad_revenue DECIMAL(10, 2) DEFAULT 0,
  sponsorships DECIMAL(10, 2) DEFAULT 0,
  memberships DECIMAL(10, 2) DEFAULT 0,
  merchandise DECIMAL(10, 2) DEFAULT 0,
  courses DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(month, year)
);

-- Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES employees(id),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'task', 'team', 'system')),
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  subscribers INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  watch_time INTEGER DEFAULT 0,
  engagement DECIMAL(5, 2) DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  videos_published INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  team_productivity DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('document', 'template', 'guide', 'tool', 'asset')),
  category TEXT,
  url TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  tags JSONB DEFAULT '[]',
  uploaded_by TEXT REFERENCES employees(id),
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_availability ON employees(availability);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_uploaded_by ON videos(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_year_month ON revenue(year DESC, month);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
