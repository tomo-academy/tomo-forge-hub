// Task Management Service
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  reviewer?: string;
  dueDate?: string;
  completedDate?: string;
  tags: string[];
  progress?: number;
  estimatedHours?: number;
  actualHours?: number;
  attachments?: string[];
  comments?: TaskComment[];
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isInternal?: boolean;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasksInProgress: number;
  averageCompletionTime: number;
  productivityScore: number;
  teamEfficiency: {
    [memberId: string]: {
      tasksCompleted: number;
      averageTime: number;
      onTimeDelivery: number;
    };
  };
}

class TaskService {
  private readonly STORAGE_KEY = 'tomo_academy_tasks';
  private readonly STATS_STORAGE_KEY = 'tomo_academy_task_stats';
  private tasks: Task[] = [];
  private subscribers: Set<() => void> = new Set();

  constructor() {
    this.loadTasks();
  }

  // Load tasks from localStorage
  private loadTasks(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.tasks = JSON.parse(stored);
      } else {
        // Initialize with sample data
        this.tasks = this.getSampleTasks();
        this.saveTasks();
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.tasks = this.getSampleTasks();
    }
  }

  // Save tasks to localStorage
  private saveTasks(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
      this.notifySubscribers();
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  // Subscribe to task updates
  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers of changes
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback());
  }

  // Get all tasks
  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  // Get tasks by status
  getTasksByStatus(status: Task['status']): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  // Get tasks by assignee
  getTasksByAssignee(assignee: string): Task[] {
    return this.tasks.filter(task => task.assignee === assignee);
  }

  // Get task by ID
  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  // Create new task
  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...taskData,
      id: `TASK-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.push(newTask);
    this.saveTasks();
    return newTask;
  }

  // Update existing task
  updateTask(id: string, updates: Partial<Task>): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return null;

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveTasks();
    return this.tasks[taskIndex];
  }

  // Move task to different status
  moveTask(id: string, newStatus: Task['status']): Task | null {
    const updates: Partial<Task> = { status: newStatus };
    
    if (newStatus === 'done' && !this.getTaskById(id)?.completedDate) {
      updates.completedDate = new Date().toISOString();
      updates.progress = 100;
    }

    return this.updateTask(id, updates);
  }

  // Delete task
  deleteTask(id: string): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return false;

    this.tasks.splice(taskIndex, 1);
    this.saveTasks();
    return true;
  }

  // Add comment to task
  addComment(taskId: string, comment: Omit<TaskComment, 'id' | 'timestamp'>): boolean {
    const task = this.getTaskById(taskId);
    if (!task) return false;

    const newComment: TaskComment = {
      ...comment,
      id: `COMMENT-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    if (!task.comments) task.comments = [];
    task.comments.push(newComment);

    return this.updateTask(taskId, { comments: task.comments }) !== null;
  }

  // Get task statistics
  getTaskStats(): TaskStats {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(task => task.status === 'done').length;
    const overdueTasks = this.tasks.filter(task => {
      if (!task.dueDate || task.status === 'done') return false;
      return new Date(task.dueDate) < new Date();
    }).length;
    const tasksInProgress = this.tasks.filter(task => task.status === 'in_progress').length;

    // Calculate average completion time
    const completedTasksWithTimes = this.tasks.filter(task => 
      task.status === 'done' && task.completedDate && task.createdAt
    );
    
    const averageCompletionTime = completedTasksWithTimes.length > 0
      ? completedTasksWithTimes.reduce((sum, task) => {
          const created = new Date(task.createdAt).getTime();
          const completed = new Date(task.completedDate!).getTime();
          return sum + (completed - created);
        }, 0) / completedTasksWithTimes.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0;

    // Calculate productivity score (0-100)
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const onTimeRate = totalTasks > 0 ? ((totalTasks - overdueTasks) / totalTasks) * 100 : 100;
    const productivityScore = Math.round((completionRate + onTimeRate) / 2);

    // Calculate team efficiency
    const teamEfficiency: TaskStats['teamEfficiency'] = {};
    const assignees = [...new Set(this.tasks.map(task => task.assignee))];
    
    assignees.forEach(assignee => {
      const memberTasks = this.getTasksByAssignee(assignee);
      const memberCompleted = memberTasks.filter(task => task.status === 'done').length;
      const memberOverdue = memberTasks.filter(task => {
        if (!task.dueDate || task.status === 'done') return false;
        return new Date(task.dueDate) < new Date();
      }).length;
      
      const memberCompletedWithTimes = memberTasks.filter(task => 
        task.status === 'done' && task.completedDate && task.createdAt
      );
      
      const memberAverageTime = memberCompletedWithTimes.length > 0
        ? memberCompletedWithTimes.reduce((sum, task) => {
            const created = new Date(task.createdAt).getTime();
            const completed = new Date(task.completedDate!).getTime();
            return sum + (completed - created);
          }, 0) / memberCompletedWithTimes.length / (1000 * 60 * 60 * 24)
        : 0;

      const onTimeDelivery = memberTasks.length > 0 
        ? ((memberTasks.length - memberOverdue) / memberTasks.length) * 100 
        : 100;

      teamEfficiency[assignee] = {
        tasksCompleted: memberCompleted,
        averageTime: memberAverageTime,
        onTimeDelivery: onTimeDelivery,
      };
    });

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      tasksInProgress,
      averageCompletionTime,
      productivityScore,
      teamEfficiency,
    };
  }

  // Search tasks
  searchTasks(query: string): Task[] {
    const lowerQuery = query.toLowerCase();
    return this.tasks.filter(task =>
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery) ||
      task.assignee.toLowerCase().includes(lowerQuery) ||
      task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Filter tasks
  filterTasks(filters: {
    status?: Task['status'][];
    priority?: Task['priority'][];
    assignee?: string[];
    tags?: string[];
    dueDateRange?: { start: string; end: string };
  }): Task[] {
    return this.tasks.filter(task => {
      if (filters.status && !filters.status.includes(task.status)) return false;
      if (filters.priority && !filters.priority.includes(task.priority)) return false;
      if (filters.assignee && !filters.assignee.includes(task.assignee)) return false;
      if (filters.tags && !filters.tags.some(tag => task.tags.includes(tag))) return false;
      
      if (filters.dueDateRange && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const startDate = new Date(filters.dueDateRange.start);
        const endDate = new Date(filters.dueDateRange.end);
        if (dueDate < startDate || dueDate > endDate) return false;
      }
      
      return true;
    });
  }

  // Get sample tasks for initial setup
  private getSampleTasks(): Task[] {
    const now = new Date().toISOString();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    return [
      {
        id: "TASK-001",
        title: "Create Firebase Tutorial Series",
        description: "Develop a comprehensive tutorial series covering Firebase authentication, Firestore, and cloud functions",
        status: "in_progress",
        priority: "high",
        assignee: "Kanish SJ",
        dueDate: tomorrow,
        tags: ["video", "firebase", "tutorial"],
        progress: 75,
        estimatedHours: 20,
        actualHours: 15,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now,
      },
      {
        id: "TASK-002",
        title: "Design thumbnail for React Hooks video",
        description: "Create an engaging thumbnail design for the React Hooks deep dive video",
        status: "review",
        priority: "medium",
        assignee: "Raaj Nikitaa",
        reviewer: "Kamesh",
        dueDate: tomorrow,
        tags: ["design", "thumbnail", "react"],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now,
      },
      {
        id: "TASK-003",
        title: "Edit TypeScript beginners tutorial",
        description: "Complete video editing including color grading, transitions, and captions",
        status: "done",
        priority: "high",
        assignee: "Nithish",
        completedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        tags: ["editing", "typescript", "tutorial"],
        progress: 100,
        estimatedHours: 8,
        actualHours: 7,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "TASK-004",
        title: "Plan Q1 2025 content calendar",
        description: "Research trending topics and plan video content for the first quarter of 2025",
        status: "todo",
        priority: "medium",
        assignee: "Indhumathi",
        dueDate: nextWeek,
        tags: ["planning", "content", "strategy"],
        estimatedHours: 12,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now,
      },
      {
        id: "TASK-005",
        title: "Optimize video SEO",
        description: "Research and implement SEO best practices for recent video uploads",
        status: "backlog",
        priority: "low",
        assignee: "Aditya Chaurasiya",
        tags: ["seo", "optimization", "marketing"],
        estimatedHours: 6,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
}

// Export singleton instance
export const taskService = new TaskService();
export default taskService;