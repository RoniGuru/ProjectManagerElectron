import { useSelector, useDispatch } from 'react-redux';

import { type AppDispatch, type RootState } from '../state/store';
import {
  addProject,
  deleteProject,
  fetchProjects,
} from '../state/ProjectSlice';
import { useEffect } from 'react';

export default function Home() {
  const { items } = useSelector((state: RootState) => state.Project);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  return <div>home</div>;
}
