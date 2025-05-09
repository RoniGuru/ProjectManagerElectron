// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');
import type { Project, ProjectUpdate, Task, TaskUpdate } from '../db/types';

// Expose database functions to the renderer process
contextBridge.exposeInMainWorld('database', {
  // Project operations
  getAllProjects: () => ipcRenderer.invoke('get-all-projects'),
  getProject: (id: number) => ipcRenderer.invoke('get-project', id),
  addProject: (project: Project) => ipcRenderer.invoke('add-project', project),
  updateProject: (id: number, updates: ProjectUpdate) =>
    ipcRenderer.invoke('update-project', id, updates),
  deleteProject: (id: number) => ipcRenderer.invoke('delete-project', id),
  completeProject: (id: number) => ipcRenderer.invoke('complete-project', id),

  // Task operations
  getAllTasks: () => ipcRenderer.invoke('get-all-tasks'),
  getTasksByProject: (projectId: number) =>
    ipcRenderer.invoke('get-tasks-by-project', projectId),
  getTask: (id: number) => ipcRenderer.invoke('get-task', id),
  addTask: (task: Task) => ipcRenderer.invoke('add-task', task),
  updateTask: (id: number, updates: TaskUpdate) =>
    ipcRenderer.invoke('update-task', id, updates),
  deleteTask: (id: number) => ipcRenderer.invoke('delete-task', id),
  updateTaskStatus: (id: number, status: 'done' | 'todo' | 'inProgress') =>
    ipcRenderer.invoke('update-task-status', id, status),

  // Stats operation
  getProjectStats: (projectId: number) =>
    ipcRenderer.invoke('get-project-stats', projectId),

  dropTables: () => ipcRenderer.invoke('drop-tables'),
});
