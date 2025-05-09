import { useEffect, useState } from 'react';
import type { Task } from '../../../db/types';
import { useSelector } from 'react-redux';
import type { RootState } from '../../state/store';
import { FaPlus } from 'react-icons/fa';

export default function Boards() {
  const { selectedProject } = useSelector((state: RootState) => state.Project);

  useEffect(() => {
    fetchTasks();
  }, [selectedProject]);

  async function fetchTasks() {
    if (selectedProject) {
      setTasks(await window.database.getTasksByProject(selectedProject.id));
    }
  }

  const [tasks, setTasks] = useState<Task[]>([]);

  const todoTasks = tasks.filter((task) => task.status === 'todo');
  const inProgressTasks = tasks.filter((task) => task.status === 'inProgress');
  const doneTasks = tasks.filter((task) => task.status === 'done');

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: number
  ) => {
    e.dataTransfer.setData('taskId', String(taskId));
  };

  // Handle dropping a task in a column
  function handleDrop(
    e: React.DragEvent<HTMLDivElement>,
    status: 'done' | 'todo' | 'inProgress'
  ) {
    const taskId = e.dataTransfer.getData('taskId');

    setTasks(
      tasks.map((task) =>
        task.id === Number(taskId) ? { ...task, status } : task
      )
    );
  }

  // Allow dropping
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDeleteTask(taskId: number) {
    setTasks(tasks.filter((task) => task.id !== taskId));
  }

  return (
    <div className="flex gap-4 overflow-auto flex-1 h-2/3">
      {/* To Do Column */}
      <div
        className="bg-gray-200 rounded-md w-1/3 flex flex-col"
        onDrop={(e) => handleDrop(e, 'todo')}
        onDragOver={handleDragOver}
      >
        <div className="bg-gray-300 p-3 rounded-t-md flex justify-between">
          <h2 className="font-semibold text-gray-700">
            To Do ({todoTasks.length})
          </h2>
          <FaPlus
            size={30}
            className="hover:opacity-45 cursor-pointer text-gray-700"
            onClick={() => console.log('click')}
          />
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          {todoTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-3 rounded mb-2 shadow cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{task.name}</h3>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* In Progress Column */}
      <div
        className="bg-gray-200 rounded-md w-1/3 flex flex-col"
        onDrop={(e) => handleDrop(e, 'inProgress')}
        onDragOver={handleDragOver}
      >
        <div className="bg-gray-300 p-3 rounded-t-md">
          <h2 className="font-semibold text-gray-700">
            In Progress ({inProgressTasks.length})
          </h2>
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          {inProgressTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-3 rounded mb-2 shadow cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{task.name}</h3>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Done Column */}
      <div
        className="bg-gray-200 rounded-md w-1/3 flex flex-col"
        onDrop={(e) => handleDrop(e, 'done')}
        onDragOver={handleDragOver}
      >
        <div className="bg-gray-300 p-3 rounded-t-md">
          <h2 className="font-semibold text-gray-700">
            Done ({doneTasks.length})
          </h2>
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          {doneTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-3 rounded mb-2 shadow cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{task.name}</h3>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
