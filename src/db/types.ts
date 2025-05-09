export type Project = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  completed: boolean;
  completed_at: string;
  color: string;
  icon: string;
};

export type Task = {
  id: number;
  project_id: number;
  name: string;
  description: string;
  status: 'done' | 'todo' | 'inProgress';
};

export type NewProject = Omit<Project, 'id' | 'created_at'> & {
  created_at?: string;
};

// Type for creating a new task (without ID)
export type NewTask = Omit<Task, 'id'>;

// Type for updating a project
export type ProjectUpdate = Partial<Omit<Project, 'id' | 'created_at'>>;

// Type for updating a task
export type TaskUpdate = Partial<Omit<Task, 'id' | 'project_id'>>;
