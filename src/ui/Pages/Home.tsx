import { useDispatch } from 'react-redux';

import { type AppDispatch } from '../state/store';
import { fetchProjects } from '../state/ProjectSlice';
import { useEffect } from 'react';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  return <div>home</div>;
}
