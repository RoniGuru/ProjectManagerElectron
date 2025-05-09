import { useState } from 'react';
import type { Project } from '../../db/types';
import { useNavigate } from 'react-router-dom';
import { type AppDispatch } from '../state/store';
import { addProject } from '../state/ProjectSlice';
import { useDispatch } from 'react-redux';

export const ProjectColors = [
  '#4285F4',
  '#EA4335',
  '#FBBC05',
  '#34A853',
  '#8E24AA',
  '#FF6D00',
  '#00ACC1',
  '#F50057',
  '#FF9E80',
  '#607D8B',
];

export default function CreateProjectForm() {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [currentColor, setCurrentColor] = useState<string>(ProjectColors[0]);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  /**
   * Make sure inputs are correct and returns true if they are
   */
  function validateInputs(): boolean {
    return true;
  }

  // creates the function
  async function handleCreateProject() {
    if (!validateInputs()) {
      return;
    }
    const createdProject: Project = {
      name,
      description,
      created_at: new Date().toISOString(),
      completed: false,
      id: 0,
      color: currentColor,
      icon: '',
      completed_at: '',
    };

    await dispatch(addProject(createdProject));

    navigate('/');
  }

  return (
    <div className="h-1/2 w-1/2 flex flex-col justify-center items-center gap-2 bg-gray-300">
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2"
      />
      <input
        type="text"
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2"
      />
      {/** Color picker */}
      <div className="w-full flex items-center flex-col justify-center ">
        <label className="font-medium text-gray-700 block">Project Color</label>
        <div className="flex flex-wrap     w-full gap-2 p-4 justify-center">
          {ProjectColors.map((color) => (
            <div
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => setCurrentColor(color)}
              className={`
          h-12 w-1/6 rounded-md cursor-pointer transition-all duration-200
          hover:scale-110 hover:shadow-md
          ${
            currentColor === color
              ? 'ring-2 ring-offset-2 ring-gray-700 shadow-lg scale-105'
              : 'opacity-90'
          }
        `}
            ></div>
          ))}
        </div>
      </div>
      <button
        onClick={handleCreateProject}
        className="p-4 bg-slate-500 font-bold rounded-xl"
      >
        submit
      </button>
    </div>
  );
}
