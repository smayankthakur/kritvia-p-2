/**
 * Autonomous Agent Scheduler
 * 
 * Schedules and manages automated agent tasks.
 */

export interface ScheduledTask {
  id: string;
  agentId: string;
  name: string;
  description: string;
  schedule: TaskSchedule;
  task: TaskDefinition;
  status: 'active' | 'paused' | 'completed' | 'failed';
  lastRun?: Date;
  nextRun?: Date;
  runCount: number;
  failureCount: number;
}

export interface TaskSchedule {
  type: 'interval' | 'cron' | 'once' | 'daily' | 'weekly' | 'monthly';
  interval?: number; // milliseconds
  cron?: string;
  time?: string; // HH:MM
  dayOfWeek?: number; // 0-6
  dayOfMonth?: number; // 1-31
  timezone?: string;
}

export interface TaskDefinition {
  type: string;
  params: Record<string, unknown>;
}

export interface AgentTaskResult {
  taskId: string;
  success: boolean;
  output?: unknown;
  error?: string;
  duration: number;
  timestamp: Date;
}

type TaskCallback = (task: ScheduledTask) => Promise<AgentTaskResult>;

class AgentScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private taskCallbacks: Map<string, TaskCallback> = new Map();
  private isRunning = false;

  /**
   * Schedule a new task
   */
  async scheduleTask(
    agentId: string,
    name: string,
    description: string,
    schedule: TaskSchedule,
    task: TaskDefinition,
    callback?: TaskCallback
  ): Promise<ScheduledTask> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
    const scheduledTask: ScheduledTask = {
      id: taskId,
      agentId,
      name,
      description,
      schedule,
      task,
      status: 'active',
      runCount: 0,
      failureCount: 0,
    };
    
    this.tasks.set(taskId, scheduledTask);
    
    if (callback) {
      this.taskCallbacks.set(taskId, callback);
    }
    
    // Calculate next run time
    scheduledTask.nextRun = this.calculateNextRun(schedule);
    
    // Start the scheduler if not already running
    if (!this.isRunning) {
      this.start();
    } else {
      this.scheduleTimer(scheduledTask);
    }
    
    console.log(`[Scheduler] Task scheduled: ${name} (${taskId})`);
    console.log(`[Scheduler] Next run: ${scheduledTask.nextRun}`);
    
    return scheduledTask;
  }

  /**
   * Calculate next run time
   */
  private calculateNextRun(schedule: TaskSchedule): Date {
    const now = new Date();
    
    switch (schedule.type) {
      case 'once':
        return now; // Should have a specific date
      
      case 'interval':
        return new Date(now.getTime() + (schedule.interval || 3600000));
      
      case 'daily':
        return this.getNextDailyTime(schedule.time || '00:00', schedule.timezone);
      
      case 'weekly':
        return this.getNextWeeklyTime(
          schedule.dayOfWeek || 0,
          schedule.time || '00:00',
          schedule.timezone
        );
      
      case 'monthly':
        return this.getNextMonthlyTime(
          schedule.dayOfMonth || 1,
          schedule.time || '00:00',
          schedule.timezone
        );
      
      case 'cron':
        // Simple cron parser (for demo)
        return this.parseCronNextRun(schedule.cron || '* * * * *');
      
      default:
        return new Date(now.getTime() + 3600000);
    }
  }

  private getNextDailyTime(time: string, timezone?: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const next = new Date();
    next.setHours(hours, minutes, 0, 0);
    
    if (next <= new Date()) {
      next.setDate(next.getDate() + 1);
    }
    
    return next;
  }

  private getNextWeeklyTime(dayOfWeek: number, time: string, timezone?: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const next = new Date();
    next.setHours(hours, minutes, 0, 0);
    
    const currentDay = next.getDay();
    const daysUntil = (dayOfWeek - currentDay + 7) % 7;
    
    if (daysUntil === 0 && next <= new Date()) {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + daysUntil);
    }
    
    return next;
  }

  private getNextMonthlyTime(dayOfMonth: number, time: string, timezone?: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const next = new Date();
    next.setDate(dayOfMonth);
    next.setHours(hours, minutes, 0, 0);
    
    if (next <= new Date()) {
      next.setMonth(next.getMonth() + 1);
    }
    
    return next;
  }

  private parseCronNextRun(cron: string): Date {
    // Simple cron implementation - returns time based on pattern
    // This is a simplified version for demo
    const now = new Date();
    return new Date(now.getTime() + 3600000);
  }

  /**
   * Schedule a timer for a task
   */
  private scheduleTimer(task: ScheduledTask): void {
    if (!task.nextRun || task.status !== 'active') return;
    
    const delay = task.nextRun.getTime() - Date.now();
    if (delay <= 0) {
      this.runTask(task);
      return;
    }
    
    const timer = setTimeout(() => {
      this.runTask(task);
    }, delay);
    
    this.timers.set(task.id, timer);
  }

  /**
   * Run a scheduled task
   */
  private async runTask(task: ScheduledTask): Promise<void> {
    if (task.status !== 'active') return;
    
    console.log(`[Scheduler] Running task: ${task.name} (${task.id})`);
    
    const callback = this.taskCallbacks.get(task.id);
    const startTime = Date.now();
    
    try {
      if (callback) {
        const result = await callback(task);
        
        if (result.success) {
          task.runCount++;
          console.log(`[Scheduler] Task completed: ${task.name}`);
        } else {
          task.failureCount++;
          console.error(`[Scheduler] Task failed: ${task.name}`, result.error);
        }
      } else {
        // Default task execution
        task.runCount++;
        console.log(`[Scheduler] Task executed: ${task.name}`);
      }
      
      task.lastRun = new Date();
    } catch (error) {
      task.failureCount++;
      console.error(`[Scheduler] Task error: ${task.name}`, error);
    }
    
    // Schedule next run
    if (task.schedule.type !== 'once') {
      task.nextRun = this.calculateNextRun(task.schedule);
      this.scheduleTimer(task);
    } else {
      task.status = 'completed';
    }
  }

  /**
   * Start the scheduler
   */
  start(): void {
    this.isRunning = true;
    console.log('[Scheduler] Started');
    
    // Schedule all active tasks
    for (const task of Array.from(this.tasks.values())) {
      if (task.status === 'active') {
        this.scheduleTimer(task);
      }
    }
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    this.isRunning = false;
    
    // Clear all timers
    for (const timer of Array.from(this.timers.values())) {
      clearTimeout(timer);
    }
    this.timers.clear();
    
    console.log('[Scheduler] Stopped');
  }

  /**
   * Pause a task
   */
  pauseTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    
    task.status = 'paused';
    
    // Clear timer
    const timer = this.timers.get(taskId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(taskId);
    }
    
    console.log(`[Scheduler] Task paused: ${task.name}`);
    return true;
  }

  /**
   * Resume a task
   */
  resumeTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    
    task.status = 'active';
    task.nextRun = this.calculateNextRun(task.schedule);
    this.scheduleTimer(task);
    
    console.log(`[Scheduler] Task resumed: ${task.name}`);
    return true;
  }

  /**
   * Cancel a task
   */
  cancelTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    
    // Clear timer
    const timer = this.timers.get(taskId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(taskId);
    }
    
    // Remove callbacks
    this.taskCallbacks.delete(taskId);
    this.tasks.delete(taskId);
    
    console.log(`[Scheduler] Task cancelled: ${task.name}`);
    return true;
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): ScheduledTask | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get tasks by agent
   */
  getTasksByAgent(agentId: string): ScheduledTask[] {
    return Array.from(this.tasks.values()).filter(t => t.agentId === agentId);
  }

  /**
   * Get scheduler status
   */
  getStatus(): { running: boolean; taskCount: number; activeTasks: number } {
    return {
      running: this.isRunning,
      taskCount: this.tasks.size,
      activeTasks: Array.from(this.tasks.values()).filter(t => t.status === 'active').length,
    };
  }
}

// Export singleton
export const agentScheduler = new AgentScheduler();

/**
 * Predefined task templates
 */
export const TaskTemplates = {
  // Daily tasks
  DAILY_REPORT: 'daily_report',
  DAILY_LEAD_REVIEW: 'daily_lead_review',
  DAILY_PIPELINE_SYNC: 'daily_pipeline_sync',
  
  // Weekly tasks  
  WEEKLY_ANALYTICS: 'weekly_analytics',
  WEEKLY_PERFORMANCE_REVIEW: 'weekly_performance_review',
  WEEKLY_FOLLOW_UP: 'weekly_follow_up',
  
  // Interval tasks
  REAL_TIME_SYNC: 'real_time_sync',
  DATA_REFRESH: 'data_refresh',
};

export default {
  agentScheduler,
  TaskTemplates,
};
