import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../../db/types';
import { useDispatch } from 'react-redux';
import { selectProject, deleteProject } from '../../state/ProjectSlice';
import { ImCross } from 'react-icons/im';
import type { AppDispatch, RootState } from '../../state/store';
import { useSelector } from 'react-redux';

export default function SideBarProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const selectedProject = useSelector(
    (state: RootState) => state.Project.selectedProject
  );

  function handleProjectDelete() {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${project.name}?`
    );

    if (isConfirmed) {
      dispatch(deleteProject(project.id));
      navigate('/');
    }
  }

  return (
    <div
      key={project.id}
      className=" rounded-lg h-16 cursor-pointer flex justify-between items-center pl-2 pr-2 duration-300 ease-in"
      style={{
        backgroundColor:
          isHovered || (selectedProject && selectedProject.id === project.id)
            ? project.color
            : '',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        dispatch(selectProject(project.id));
        navigate(`/Project`);
      }}
    >
      <div className="p-2 w-4/5">
        <h3 className=" font-semibold text-white mb-2">{project.name}</h3>
      </div>
      {isHovered || (selectedProject && selectedProject.id === project.id) ? (
        <ImCross
          size={24}
          onClick={(e) => {
            e.stopPropagation();
            handleProjectDelete();
          }}
          className="hover:text-black"
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}
