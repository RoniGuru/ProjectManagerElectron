// projectsSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {
  type Project,
  type NewProject,
  type ProjectUpdate,
} from '../../db/types';

// ProjectStats is used for tracking project completion statistics
export type ProjectStats = {
  total: number;
  done: number;
  todo: number;
  inProgress: number;
};

// Define the shape of our Redux state slices
export interface ProjectsState {
  items: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  stats: Record<number, ProjectStats>;
}

// Initial state
const initialState: ProjectsState = {
  items: [],
  selectedProject: null,
  loading: false,
  error: null,
  stats: {},
};

// Async thunks for projects
export const fetchProjects = createAsyncThunk('projects/fetchAll', async () => {
  const projects = await window.database.getAllProjects();
  return projects as Project[];
});

export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (id: number) => {
    const project = await window.database.getProject(id);
    if (!project) throw new Error(`Project with id ${id} not found`);
    return project as Project;
  }
);

export const addProject = createAsyncThunk(
  'projects/add',
  async (project: NewProject) => {
    const id = await window.database.addProject(project);
    // Return the full project with id
    return {
      ...project,
      id,
      created_at: project.created_at || new Date().toISOString(),
    } as Project;
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, updates }: { id: number; updates: ProjectUpdate }) => {
    const success = await window.database.updateProject(id, updates);
    if (!success) throw new Error(`Failed to update project ${id}`);
    return { id, updates };
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id: number) => {
    const success = await window.database.deleteProject(id);
    if (!success) throw new Error(`Failed to delete project ${id}`);
    return id;
  }
);

export const completeProject = createAsyncThunk(
  'projects/complete',
  async (id: number) => {
    const success = await window.database.completeProject(id);
    if (!success) throw new Error(`Failed to complete project ${id}`);
    return id;
  }
);

export const fetchProjectStats = createAsyncThunk(
  'projects/fetchStats',
  async (id: number) => {
    const stats = await window.database.getProjectStats(id);
    return { id, stats };
  }
);

// Create the projects slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    selectProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    clearProjectError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })

      // Handle fetchProjectById
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;

        // Also update the project in items array if it exists
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch project';
      })

      // Handle addProject
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); //adds at beginning
        state.selectedProject = action.payload;
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add project';
      })

      // Handle updateProject
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updates } = action.payload;

        const index = state.items.findIndex((p) => p.id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updates };
        }

        // Update selected project if needed
        if (state.selectedProject && state.selectedProject.id === id) {
          state.selectedProject = { ...state.selectedProject, ...updates };
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update project';
      })

      // Handle deleteProject
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.items = state.items.filter((p) => p.id !== id);

        // Clear selected project if it was deleted
        if (state.selectedProject && state.selectedProject.id === id) {
          state.selectedProject = null;
        }

        // Remove stats for the deleted project
        if (state.stats[id]) {
          delete state.stats[id];
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete project';
      })

      // Handle completeProject
      .addCase(completeProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeProject.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;

        // Update in items array
        const index = state.items.findIndex((p) => p.id === id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            completed: true,
            completed_at: new Date().toISOString(),
          };
        }

        // Update selected project if needed
        if (state.selectedProject && state.selectedProject.id === id) {
          state.selectedProject = {
            ...state.selectedProject,
            completed: true,
            completed_at: new Date().toISOString(),
          };
        }
      })
      .addCase(completeProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to complete project';
      })

      // Handle fetchProjectStats
      .addCase(fetchProjectStats.fulfilled, (state, action) => {
        const { id, stats } = action.payload;
        state.stats[id] = stats;
      });
  },
});

// Export actions and reducer
export const { selectProject, clearProjectError } = projectsSlice.actions;
export default projectsSlice.reducer;
