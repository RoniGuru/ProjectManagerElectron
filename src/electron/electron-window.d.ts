import { Project, Task } from './types';
import { NewProject, ProjectUpdate, NewTask, TaskUpdate } from '../db';

declare global {
  interface Window {
    database: {
      // Project operations
      getAllProjects: () => Promise<Project[]>;
      getProject: (id: number) => Promise<Project | null>;
      addProject: (project: NewProject) => Promise<number>;
      updateProject: (id: number, updates: ProjectUpdate) => Promise<boolean>;
      deleteProject: (id: number) => Promise<boolean>;
      completeProject: (id: number) => Promise<boolean>;

      // Task operations
      getAllTasks: () => Promise<Task[]>;
      getTasksByProject: (projectId: number) => Promise<Task[]>;
      getTask: (id: number) => Promise<Task | null>;
      addTask: (task: NewTask) => Promise<number>;
      updateTask: (id: number, updates: TaskUpdate) => Promise<boolean>;
      deleteTask: (id: number) => Promise<boolean>;
      updateTaskStatus: (
        id: number,
        status: Task['status']
      ) => Promise<boolean>;

      // Stats operation
      getProjectStats: (projectId: number) => Promise<{
        total: number;
        done: number;
        todo: number;
        inProgress: number;
      }>;
    };
  }
}

// This empty export makes TypeScript treat this file as a module
export {};
