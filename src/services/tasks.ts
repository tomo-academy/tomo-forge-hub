// Task Management Service for TOMO Academy

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  assigneeId?: string;
  reviewer?: string;
  reviewerId?: string;
  dueDate: string;
  completedDate?: string;
  tags: string[];
  progress?: number;
  category: 'video' | 'design' | 'development' | 'content' | 'marketing' | 'other';
  estimatedHours?: number;
  actualHours?: number;
  attachments?: string[];
  comments?: {
    id: string;
    author: string;
    message: string;
    timestamp: Date;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface TaskStats {
  total: number;
  backlog: number;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
  overdue: number;
  completedThisWeek: number;
  completedThisMonth: number;
}

class TaskService {
  // Get all tasks
  async getTasks(): Promise<Task[]> {
    console.log('📋 Using mock task data');
    return this.getMockTasks();
  }

  // Get tasks by status
  async getTasksByStatus(status: Task['status']): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter(task => task.status === status);
  }

  // Create new task
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log('➕ Creating task:', task.title);
    return `task-${Date.now()}`;
  }

  // Update task
  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    console.log('✏️ Updating task:', id, updates);
  }

  // Delete task
  async deleteTask(id: string): Promise<void> {
    console.log('🗑️ Deleting task:', id);
  }

  // Get task statistics
  async getTaskStats(): Promise<TaskStats> {
    const tasks = await this.getTasks();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      total: tasks.length,
      backlog: tasks.filter(t => t.status === 'backlog').length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
      overdue: tasks.filter(t => new Date(t.dueDate) < now && t.status !== 'done').length,
      completedThisWeek: tasks.filter(t => 
        t.status === 'done' && 
        t.completedDate && 
        new Date(t.completedDate) > weekAgo
      ).length,
      completedThisMonth: tasks.filter(t => 
        t.status === 'done' && 
        t.completedDate && 
        new Date(t.completedDate) > monthAgo
      ).length,
    };
  }

  // Initialize default tasks
  async initializeDefaultTasks(): Promise<void> {
    console.log('✅ Tasks initialized with mock data');
  }

  // Mock tasks for fallback
  private getMockTasks(): Task[] {
    const now = new Date().toISOString();
    return [
      {
        id: "task-001",
        title: "Create thumbnail for TypeScript tutorial",
        description: "Design eye-catching thumbnail with code snippets and modern styling",
        assignee: "Raaj Nikitaa",
        assigneeId: "raaj-nikitaa",
        priority: "high",
        status: "todo",
        dueDate: "2025-10-03",
        tags: ["design", "thumbnail", "typescript"],
        category: "design",
        estimatedHours: 2,
        createdAt: now,
        updatedAt: now,
        createdBy: "system"
      },
      {
        id: "task-002",
        title: "Edit React Hooks video",
        description: "Add transitions, color grading, and captions to the React Hooks tutorial",
        assignee: "Nithish",
        assigneeId: "nithish",
        priority: "urgent",
        status: "in_progress",
        dueDate: "2025-10-02",
        tags: ["editing", "react", "tutorial"],
        category: "video",
        progress: 65,
        estimatedHours: 4,
        actualHours: 2.5,
        createdAt: now,
        updatedAt: now,
        createdBy: "system"
      },
      {
        id: "task-003",
        title: "Write script for Next.js deployment video",
        description: "Cover Vercel, Netlify, and custom hosting options",
        assignee: "Ajay Krithick",
        assigneeId: "ajay-krithick",
        priority: "high",
        status: "todo",
        dueDate: "2025-10-04",
        tags: ["script", "nextjs", "deployment"],
        category: "content",
        estimatedHours: 3,
        createdAt: now,
        updatedAt: now,
        createdBy: "system"
      },
      {
        id: "task-004",
        title: "Firebase tutorial thumbnail review",
        description: "Final review and approval before publishing",
        assignee: "Kamesh",
        assigneeId: "kamesh",
        reviewer: "Kanish SJ",
        reviewerId: "kanish-sj",
        priority: "high",
        status: "review",
        dueDate: "2025-10-02",
        tags: ["design", "review", "firebase"],
        category: "design",
        estimatedHours: 1,
        createdAt: now,
        updatedAt: now,
        createdBy: "system"
      },
      {
        id: "task-005",
        title: "Upload CSS Grid tutorial",
        description: "Published successfully with SEO optimization",
        assignee: "Ajay Krithick",
        assigneeId: "ajay-krithick",
        priority: "high",
        status: "done",
        dueDate: "2025-09-28",
        completedDate: "2025-09-28",
        tags: ["upload", "css", "tutorial"],
        category: "video",
        estimatedHours: 1,
        actualHours: 0.5,
        createdAt: now,
        updatedAt: now,
        createdBy: "system"
      },
      {
        id: "task-006",
        title: "Plan December content calendar",
        description: "Schedule videos and coordinate with team for Q4",
        assignee: "Indhumathi",
        assigneeId: "indhumathi",
        priority: "medium",
        status: "todo",
        dueDate: "2025-10-08",
        tags: ["planning", "content", "calendar"],
        category: "marketing",
        estimatedHours: 4,
        createdAt: now,
        updatedAt: now,
        createdBy: "system"
      },
      {
        id: "task-007",
        title: "Research AI video editing tools",
        description: "Explore automation options for video production workflow",
        assignee: "Haridharuson L.J",
        assigneeId: "haridharuson-lj",
        priority: "low",
        status: "backlog",
        dueDate: "2025-10-20",
        tags: ["research", "ai", "automation"],
        category: "other",
        estimatedHours: 6,
        createdAt: now,
        updatedAt: now,
        createdBy: "system"
      },
      {
        id: "task-008",
        title: "Develop analytics dashboard",
        description: "Build real-time channel metrics view with interactive charts",
        assignee: "Dev",
        assigneeId: "dev",
        priority: "high",
        status: "in_progress",
        dueDate: "2025-10-05",
        tags: ["development", "analytics", "dashboard"],
        category: "development",
        progress: 40,
        estimatedHours: 8,
        actualHours: 3,
        createdAt: now,
        updatedAt: now,
        createdBy: "system"
      }
    ];
  }
}

export const taskService = new TaskService();
