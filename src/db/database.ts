import sqlite3 from 'sqlite3';
import path from 'path';
import { app } from 'electron';
import {
  type Project,
  type Task,
  type NewProject,
  type NewTask,
  type ProjectUpdate,
  type TaskUpdate,
} from './types.js';

class Database {
  private db: sqlite3.Database;

  constructor() {
    // Get the user data directory for the app
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'database.sqlite');

    // Create and initialize the database
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        this.init();
      }
    });
  }

  // Initialize the database schema
  private init() {
    this.db.run('PRAGMA foreign_keys = ON');

    // Create projects table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed BOOLEAN DEFAULT 0,
        completed_at TIMESTAMP,
        color TEXT DEFAULT '#4A6FA5',
        icon TEXT DEFAULT 'folder'
      )
    `);

    // Create tasks table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT CHECK(status IN ('done', 'todo', 'inProgress')) DEFAULT 'todo',
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
      )
    `);
  }

  // Project operations
  public getAllProjects(): Promise<Project[]> {
    return new Promise((resolve) => {
      this.db.all(
        'SELECT * FROM projects ORDER BY created_at DESC',
        (err, rows) => {
          if (err) {
            console.error('Error getting all projects:', err);
            resolve([]);
          } else {
            resolve(rows as Project[]);
          }
        }
      );
    });
  }

  public getProjectById(id: number): Promise<Project | null> {
    return new Promise((resolve) => {
      this.db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error(`Error getting project with id ${id}:`, err);
          resolve(null);
        } else {
          resolve((row as Project) || null);
        }
      });
    });
  }

  public addProject(project: NewProject): Promise<number> {
    return new Promise((resolve, reject) => {
      const createdAt = project.created_at || new Date().toISOString();

      this.db.run(
        `INSERT INTO projects 
        (name, description, completed, completed_at, color, icon, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          project.name,
          project.description,
          project.completed ? 1 : 0,
          project.completed_at,
          project.color,
          project.icon,
          createdAt,
        ],
        function (err) {
          if (err) {
            console.error('Error adding project:', err);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  public updateProject(id: number, updates: ProjectUpdate): Promise<boolean> {
    return new Promise((resolve) => {
      // Build the SET part of the SQL query dynamically based on provided updates
      const keys = Object.keys(updates);
      if (keys.length === 0) {
        resolve(false);
        return;
      }

      const updateFields = keys.map((key) => `${key} = ?`).join(', ');
      const values = [
        ...keys.map((key) => updates[key as keyof ProjectUpdate]),
        id,
      ];

      this.db.run(
        `UPDATE projects SET ${updateFields} WHERE id = ?`,
        values,
        function (err) {
          if (err) {
            console.error(`Error updating project ${id}:`, err);
            resolve(false);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  public deleteProject(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.db.run('DELETE FROM projects WHERE id = ?', [id], function (err) {
        if (err) {
          console.error(`Error deleting project ${id}:`, err);
          resolve(false);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  public completeProject(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.db.run(
        `UPDATE projects 
        SET completed = 1, completed_at = CURRENT_TIMESTAMP 
        WHERE id = ?`,
        [id],
        function (err) {
          if (err) {
            console.error(`Error completing project ${id}:`, err);
            resolve(false);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  // Task operations
  public getAllTasks(): Promise<Task[]> {
    return new Promise((resolve) => {
      this.db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
          console.error('Error getting all tasks:', err);
          resolve([]);
        } else {
          resolve(rows as Task[]);
        }
      });
    });
  }

  public getTasksByProjectId(projectId: number): Promise<Task[]> {
    return new Promise((resolve) => {
      this.db.all(
        'SELECT * FROM tasks WHERE project_id = ?',
        [projectId],
        (err, rows) => {
          if (err) {
            console.error(`Error getting tasks for project ${projectId}:`, err);
            resolve([]);
          } else {
            resolve(rows as Task[]);
          }
        }
      );
    });
  }

  public getTaskById(id: number): Promise<Task | null> {
    return new Promise((resolve) => {
      this.db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error(`Error getting task with id ${id}:`, err);
          resolve(null);
        } else {
          resolve((row as Task) || null);
        }
      });
    });
  }

  public addTask(task: NewTask): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO tasks (project_id, name, description, status)
        VALUES (?, ?, ?, ?)`,
        [task.project_id, task.name, task.description, task.status || 'todo'],
        function (err) {
          if (err) {
            console.error('Error adding task:', err);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  public updateTask(id: number, updates: TaskUpdate): Promise<boolean> {
    return new Promise((resolve) => {
      const keys = Object.keys(updates);
      if (keys.length === 0) {
        resolve(false);
        return;
      }

      const updateFields = keys.map((key) => `${key} = ?`).join(', ');
      const values = [
        ...keys.map((key) => updates[key as keyof TaskUpdate]),
        id,
      ];

      this.db.run(
        `UPDATE tasks SET ${updateFields} WHERE id = ?`,
        values,
        function (err) {
          if (err) {
            console.error(`Error updating task ${id}:`, err);
            resolve(false);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  public deleteTask(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) {
          console.error(`Error deleting task ${id}:`, err);
          resolve(false);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  public updateTaskStatus(
    id: number,
    status: Task['status']
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.db.run(
        'UPDATE tasks SET status = ? WHERE id = ?',
        [status, id],
        function (err) {
          if (err) {
            console.error(`Error updating status for task ${id}:`, err);
            resolve(false);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  // Statistics and queries
  public getProjectStats(projectId: number): Promise<{
    total: number;
    done: number;
    todo: number;
    inProgress: number;
  }> {
    return new Promise((resolve) => {
      this.db.get(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done,
          SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo,
          SUM(CASE WHEN status = 'inProgress' THEN 1 ELSE 0 END) as inProgress
        FROM tasks
        WHERE project_id = ?`,
        [projectId],
        (err, row) => {
          if (err) {
            console.error(`Error getting stats for project ${projectId}:`, err);
            resolve({ total: 0, done: 0, todo: 0, inProgress: 0 });
          } else {
            resolve(
              row as {
                total: number;
                done: number;
                todo: number;
                inProgress: number;
              }
            );
          }
        }
      );
    });
  }
}

const database = new Database();

export default database;
