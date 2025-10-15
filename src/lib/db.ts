// Neon Serverless Postgres Database Configuration
import { neon } from '@neondatabase/serverless';
import { employees as mockEmployees } from '@/data/employees';

// Get database URL from environment
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL not found. Using mock data fallback.');
}

// Create SQL client
export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// Database schema types
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  employee_id: string;
  join_date: string;
  avatar_url?: string;
  location?: string;
  availability: 'available' | 'busy' | 'offline';
  bio?: string;
  skills?: string[];
  social_links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
    website?: string;
  };
  stats: {
    videos: number;
    tasks: number;
    rating: number;
    projects: number;
  };
  card_color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  youtube_id?: string;
  youtube_url?: string;
  thumbnail_url?: string;
  duration?: string;
  category?: string;
  tags?: string[];
  uploaded_by: string;
  status: 'processing' | 'published' | 'draft' | 'scheduled';
  views?: number;
  likes?: number;
  comments?: number;
  uploaded_at: string;
  published_at?: string;
}

// Database operations
export const db = {
  // Employee operations
  employees: {
    async getAll(): Promise<Employee[]> {
      if (!sql) {
        console.log('📦 Using mock employee data');
        return mockEmployees.map(emp => ({
          ...emp,
          employee_id: emp.employeeId,
          join_date: emp.joinDate,
          avatar_url: emp.avatar,
          social_links: emp.social,
          card_color: emp.cardColor
        }));
      }
      try {
        const result = await sql`SELECT * FROM employees ORDER BY name`;
        return result as Employee[];
      } catch (error) {
        console.error('Error fetching employees:', error);
        console.log('📦 Falling back to mock employee data');
        return mockEmployees.map(emp => ({
          ...emp,
          employee_id: emp.employeeId,
          join_date: emp.joinDate,
          avatar_url: emp.avatar,
          social_links: emp.social,
          card_color: emp.cardColor
        }));
      }
    },

    async getById(id: string): Promise<Employee | null> {
      if (!sql) {
        const emp = mockEmployees.find(e => e.id === id);
        if (!emp) return null;
        return {
          ...emp,
          employee_id: emp.employeeId,
          join_date: emp.joinDate,
          avatar_url: emp.avatar,
          social_links: emp.social,
          card_color: emp.cardColor
        };
      }
      try {
        const result = await sql`SELECT * FROM employees WHERE id = ${id}`;
        return result[0] as Employee || null;
      } catch (error) {
        console.error('Error fetching employee:', error);
        const emp = mockEmployees.find(e => e.id === id);
        if (!emp) return null;
        return {
          ...emp,
          employee_id: emp.employeeId,
          join_date: emp.joinDate,
          avatar_url: emp.avatar,
          social_links: emp.social,
          card_color: emp.cardColor
        };
      }
    },

    async create(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee | null> {
      if (!sql) {
        // Fallback: create employee in memory (for demo purposes)
        console.log('📝 Creating employee in memory (no database connection)');
        const newEmployee = {
          id: `emp-${Date.now()}`,
          ...employee,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return newEmployee as Employee;
      }
      try {
        const result = await sql`
          INSERT INTO employees (
            id, name, role, department, email, phone, employee_id, join_date,
            avatar_url, location, availability, bio, skills, social_links, stats, card_color
          ) VALUES (
            ${`emp-${Date.now()}`}, ${employee.name}, ${employee.role}, ${employee.department}, ${employee.email},
            ${employee.phone}, ${employee.employee_id}, ${employee.join_date},
            ${employee.avatar_url}, ${employee.location}, ${employee.availability},
            ${employee.bio}, ${JSON.stringify(employee.skills)}, ${JSON.stringify(employee.social_links)},
            ${JSON.stringify(employee.stats)}, ${employee.card_color}
          )
          RETURNING *
        `;
        return result[0] as Employee;
      } catch (error) {
        console.error('Error creating employee:', error);
        // Fallback on error
        const newEmployee = {
          id: `emp-${Date.now()}`,
          ...employee,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return newEmployee as Employee;
      }
    },

    async update(id: string, updates: Partial<any>): Promise<Employee | null> {
      if (!sql) {
        console.log('📝 Updating employee in memory (no database connection)');
        return null;
      }
      try {
        // Map avatar to avatar_url if present (handle both field names)
        const avatarUrl = updates.avatar_url || updates.avatar;
        const skills = Array.isArray(updates.skills) ? updates.skills : [];
        const socialLinks = updates.social || updates.social_links || {};
        
        console.log('💾 Updating employee:', id);
        console.log('💾 Avatar URL to save:', avatarUrl);
        console.log('💾 Avatar URL length:', avatarUrl?.length || 0);
        
        // Only update avatar_url if a new value is provided
        const avatarUpdateClause = avatarUrl 
          ? sql`avatar_url = ${avatarUrl}`
          : sql`avatar_url = avatar_url`;
        
        const result = await sql`
          UPDATE employees
          SET
            name = COALESCE(${updates.name}, name),
            role = COALESCE(${updates.role}, role),
            department = COALESCE(${updates.department}, department),
            email = COALESCE(${updates.email}, email),
            phone = COALESCE(${updates.phone}, phone),
            ${avatarUpdateClause},
            location = COALESCE(${updates.location}, location),
            availability = COALESCE(${updates.availability}, availability),
            bio = COALESCE(${updates.bio}, bio),
            skills = COALESCE(${JSON.stringify(skills)}::jsonb, skills),
            social_links = COALESCE(${JSON.stringify(socialLinks)}::jsonb, social_links),
            stats = COALESCE(${JSON.stringify(updates.stats)}::jsonb, stats),
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
        
        if (result && result.length > 0) {
          console.log('✅ Employee updated successfully');
          console.log('✅ New avatar_url:', result[0].avatar_url);
          return result[0] as Employee;
        } else {
          console.warn('⚠️ No employee found with id:', id);
          return null;
        }
      } catch (error) {
        console.error('❌ Error updating employee:', error);
        console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
        return null;
      }
    },

    async updateAvatar(id: string, avatarUrl: string): Promise<boolean> {
      if (!sql) return false;
      try {
        await sql`UPDATE employees SET avatar_url = ${avatarUrl}, updated_at = NOW() WHERE id = ${id}`;
        return true;
      } catch (error) {
        console.error('Error updating avatar:', error);
        return false;
      }
    },

    async delete(id: string): Promise<boolean> {
      if (!sql) return false;
      try {
        await sql`DELETE FROM employees WHERE id = ${id}`;
        return true;
      } catch (error) {
        console.error('Error deleting employee:', error);
        return false;
      }
    }
  },

  // Video operations
  videos: {
    async getAll(): Promise<Video[]> {
      if (!sql) return [];
      try {
        const result = await sql`SELECT * FROM videos ORDER BY uploaded_at DESC`;
        return result as Video[];
      } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
      }
    },

    async getById(id: string): Promise<Video | null> {
      if (!sql) return null;
      try {
        const result = await sql`SELECT * FROM videos WHERE id = ${id}`;
        return result[0] as Video || null;
      } catch (error) {
        console.error('Error fetching video:', error);
        return null;
      }
    },

    async create(video: Omit<Video, 'id'>): Promise<Video | null> {
      if (!sql) return null;
      try {
        const result = await sql`
          INSERT INTO videos (
            title, description, youtube_id, youtube_url, thumbnail_url,
            duration, category, tags, uploaded_by, status, views, likes, comments,
            uploaded_at, published_at
          ) VALUES (
            ${video.title}, ${video.description}, ${video.youtube_id}, ${video.youtube_url},
            ${video.thumbnail_url}, ${video.duration}, ${video.category}, ${JSON.stringify(video.tags)},
            ${video.uploaded_by}, ${video.status}, ${video.views}, ${video.likes}, ${video.comments},
            ${video.uploaded_at}, ${video.published_at}
          )
          RETURNING *
        `;
        return result[0] as Video;
      } catch (error) {
        console.error('Error creating video:', error);
        return null;
      }
    },

    async update(id: string, updates: Partial<Video>): Promise<Video | null> {
      if (!sql) return null;
      try {
        const result = await sql`
          UPDATE videos
          SET
            title = COALESCE(${updates.title}, title),
            description = COALESCE(${updates.description}, description),
            youtube_id = COALESCE(${updates.youtube_id}, youtube_id),
            status = COALESCE(${updates.status}, status),
            views = COALESCE(${updates.views}, views),
            likes = COALESCE(${updates.likes}, likes),
            comments = COALESCE(${updates.comments}, comments)
          WHERE id = ${id}
          RETURNING *
        `;
        return result[0] as Video || null;
      } catch (error) {
        console.error('Error updating video:', error);
        return null;
      }
    }
  }
};

// Initialize database tables
export async function initializeDatabase() {
  if (!sql) {
    console.warn('Skipping database initialization - no connection');
    return;
  }

  try {
    // Create employees table
    await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        employee_id VARCHAR(50) UNIQUE NOT NULL,
        join_date DATE NOT NULL,
        avatar_url TEXT,
        location VARCHAR(255),
        availability VARCHAR(20) DEFAULT 'available',
        bio TEXT,
        skills JSONB,
        social_links JSONB,
        stats JSONB,
        card_color VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create videos table
    await sql`
      CREATE TABLE IF NOT EXISTS videos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(500) NOT NULL,
        description TEXT,
        youtube_id VARCHAR(100),
        youtube_url TEXT,
        thumbnail_url TEXT,
        duration VARCHAR(20),
        category VARCHAR(100),
        tags JSONB,
        uploaded_by VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'processing',
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        uploaded_at TIMESTAMP DEFAULT NOW(),
        published_at TIMESTAMP
      )
    `;

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
