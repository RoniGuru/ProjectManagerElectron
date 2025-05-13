import { useDispatch } from 'react-redux';

import { type AppDispatch } from '../state/store';
import { fetchProjects } from '../state/ProjectSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      <button
        onClick={() => navigate('/CreateProject')}
        className="p-4 bg-gray-800 text-white rounded-xl text-2xl font-bold hover:scale-115 duration-150 ease-in cursor-pointer"
      >
        Create a Project
      </button>
    </div>
  );
}
