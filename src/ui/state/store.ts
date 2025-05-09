import { configureStore } from '@reduxjs/toolkit';
import ProjectReducer from './ProjectSlice';
import TaskReducer from './TaskSlice';

export const store = configureStore({
  reducer: {
    Project: ProjectReducer,
    Task: TaskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
