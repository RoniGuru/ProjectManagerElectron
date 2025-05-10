import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../../db/types';
import { useDispatch } from 'react-redux';
import { selectProject, deleteProject } from '../../state/ProjectSlice';
import { ImCross } from 'react-icons/im';
import { type AppDispatch } from '../../state/store';

export default function SideBarProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

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
      className=" rounded-lg hover:bg-slate-200  cursor-pointer flex justify-between items-center pl-2 pr-2"
      style={{
        backgroundColor: isHovered ? project.color : '',
        borderLeft: isHovered
          ? `4px solid ${project.color}`
          : '4px solid transparent',
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
      {isHovered ? (
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
