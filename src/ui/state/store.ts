import { configureStore } from '@reduxjs/toolkit';
import ProjectReducer from './ProjectSlice';

export const store = configureStore({
  reducer: {
    Project: ProjectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
