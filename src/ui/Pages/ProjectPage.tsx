import { useSelector } from 'react-redux';
import type { RootState } from '../state/store';
import Boards from '../Components/Project/Boards';

export default function ProjectPage() {
  const currentProject = useSelector(
    (state: RootState) => state.Project.selectedProject
  );

  return (
    <div className="h-full">
      {currentProject ? (
        <>
          <h1 className="w-full text-center text-3xl font-bold mb-10 text-white">
            {currentProject.name}
          </h1>
          <Boards />
        </>
      ) : null}
    </div>
  );
}
