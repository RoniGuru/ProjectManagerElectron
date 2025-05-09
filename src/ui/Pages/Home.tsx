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

  return (
    <div>
      <div className="p-4 bg-blue-500 h-96 w-full "></div>
      <h1 className="text-5xl">Vite + Reacts</h1>
      <div className="flex flex-col">
        {items.map((project) => (
          <div key={project.id}>
            {project.name} {project.id}
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <button
          className="p-4 bg-blue-300 hover:opacity-40"
          onClick={() =>
            dispatch(
              addProject({
                name: 'project',
                description: 'this is a project',
                completed: false,
                completed_at: new Date().toDateString(),
                color: 'red',
                icon: '',
              })
            )
          }
        >
          add Project
        </button>

        <button
          className="p-4 bg-blue-300  hover:opacity-40"
          onClick={() => {
            if (items[0]) {
              dispatch(deleteProject(items[0].id));
            }
          }}
        >
          delete Project
        </button>
        <button
          className="p-4 bg-blue-300  hover:opacity-40"
          onClick={async () =>
            console.log(await window.database.getAllProjects())
          }
        >
          log console
        </button>
      </div>
    </div>
  );
}
