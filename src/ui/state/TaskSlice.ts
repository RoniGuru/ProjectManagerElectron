import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { type NewTask, type Task, type TaskUpdate } from '../../db/types';

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchByProject',
  async (id: number) => {
    const tasks = await window.database.getTasksByProject(id);
    return tasks as Task[];
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, updates }: { id: number; updates: TaskUpdate }) => {
    const success = await window.database.updateTask(id, updates);
    if (!success) throw new Error(`Failed to update task ${id}`);
    return { id, updates };
  }
);

export const addTask = createAsyncThunk('tasks/add', async (task: NewTask) => {
  const id = await window.database.addTask(task);

  return {
    ...task,
    id,
  } as Task;
});

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: number) => {
    const success = await window.database.deleteTask(id);
    if (!success) throw new Error(`Failed to delete task ${id}`);
    return id;
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({
    id,
    status,
  }: {
    id: number;
    status: 'done' | 'todo' | 'inProgress';
  }) => {
    const success = await window.database.updateTaskStatus(id, status);
    if (!success) throw new Error(`Failed to update status for task ${id}`);
    return { id, status };
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchTasksByProject
    builder
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTasksByProject.fulfilled,
        (state, action: PayloadAction<Task[]>) => {
          state.loading = false;
          state.tasks = action.payload;
        }
      )
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      });

    // Handle updateTask
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateTask.fulfilled,
        (state, action: PayloadAction<{ id: number; updates: TaskUpdate }>) => {
          state.loading = false;
          const { id, updates } = action.payload;
          const taskIndex = state.tasks.findIndex((task) => task.id === id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
          }
        }
      )
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task';
      });

    // Handle addTask
    builder
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add task';
      });

    // Handle deleteTask
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete task';
      });

    // Handle updateTaskStatus
    builder
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateTaskStatus.fulfilled,
        (
          state,
          action: PayloadAction<{
            id: number;
            status: 'done' | 'todo' | 'inProgress';
          }>
        ) => {
          state.loading = false;
          const { id, status } = action.payload;
          const taskIndex = state.tasks.findIndex((task) => task.id === id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex] = { ...state.tasks[taskIndex], status };
          }
        }
      )
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task status';
      });
  },
});

export const tasksReducer = tasksSlice.reducer;
export default tasksReducer;
