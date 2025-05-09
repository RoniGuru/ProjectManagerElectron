import database from './database.js';
import { ipcMain } from 'electron';

// Set up IPC handlers for the database operations
export function setupDatabaseHandlers() {
  // Project operations
  ipcMain.handle('get-all-projects', async () => {
    return database.getAllProjects();
  });

  ipcMain.handle('get-project', async (_, id: number) => {
    return database.getProjectById(id);
  });

  ipcMain.handle('add-project', async (_, project) => {
    return database.addProject(project);
  });

  ipcMain.handle('update-project', async (_, id: number, updates) => {
    return database.updateProject(id, updates);
  });

  ipcMain.handle('delete-project', async (_, id: number) => {
    return database.deleteProject(id);
  });

  ipcMain.handle('complete-project', async (_, id: number) => {
    return database.completeProject(id);
  });

  // Task operations
  ipcMain.handle('get-all-tasks', async () => {
    return database.getAllTasks();
  });

  ipcMain.handle('get-tasks-by-project', async (_, projectId: number) => {
    return database.getTasksByProjectId(projectId);
  });

  ipcMain.handle('get-task', async (_, id: number) => {
    return database.getTaskById(id);
  });

  ipcMain.handle('add-task', async (_, task) => {
    return database.addTask(task);
  });

  ipcMain.handle('update-task', async (_, id: number, updates) => {
    return database.updateTask(id, updates);
  });

  ipcMain.handle('delete-task', async (_, id: number) => {
    return database.deleteTask(id);
  });

  ipcMain.handle('update-task-status', async (_, id: number, status) => {
    return database.updateTaskStatus(id, status);
  });

  // Stats operation
  ipcMain.handle('get-project-stats', async (_, projectId: number) => {
    return database.getProjectStats(projectId);
  });
}
