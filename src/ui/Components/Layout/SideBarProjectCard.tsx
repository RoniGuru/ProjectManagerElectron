import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../../db/types';
import { useDispatch } from 'react-redux';
import { selectProject } from '../../state/ProjectSlice';

export default function SideBarProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div
      key={project.id}
      className=" rounded-lg hover:bg-slate-200 flex-shrink-0 h-16 cursor-pointer"
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
      <div className="p-2 ">
        <h3 className=" font-semibold text-white mb-2">{project.name}</h3>
      </div>
    </div>
  );
}
