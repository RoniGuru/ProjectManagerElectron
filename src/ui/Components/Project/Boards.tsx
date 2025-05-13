import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../state/store';
import { FaPlus } from 'react-icons/fa';
import CreateTaskForm from './CreateTaskForm';
import { fetchTasksByProject, updateTaskStatus } from '../../state/TaskSlice';
import TaskCard from './TaskCard';

export default function Boards() {
  const { selectedProject } = useSelector((state: RootState) => state.Project);
  const taskState = useSelector((state: RootState) => state.Task);

  const [creatingTask, setCreatingTask] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    fetchTasks();
  }, [selectedProject]);

  async function fetchTasks() {
    if (selectedProject) {
      await dispatch(fetchTasksByProject(selectedProject.id));
    }
  }

  const todoTasks = taskState.tasks.filter((task) => task.status === 'todo');
  const inProgressTasks = taskState.tasks.filter(
    (task) => task.status === 'inProgress'
  );
  const doneTasks = taskState.tasks.filter((task) => task.status === 'done');

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

    dispatch(updateTaskStatus({ id: Number(taskId), status }));
  }

  // Allow dropping
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return (
    <div className="flex gap-4 overflow-auto flex-1 h-2/3">
      {/* To Do Column */}
      <div
        className="bg-gray-200 rounded-md w-1/3 flex flex-col"
        onDrop={(e) => handleDrop(e, 'todo')}
        onDragOver={handleDragOver}
      >
        <div className=" p-3 rounded-t-md flex justify-between">
          <h2 className="font-semibold text-gray-700">
            To Do ({todoTasks.length})
          </h2>
          <FaPlus
            size={30}
            className="hover:opacity-45 cursor-pointer text-gray-700"
            onClick={() => setCreatingTask(!creatingTask)}
          />
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          {creatingTask && selectedProject ? (
            <CreateTaskForm
              id={selectedProject.id}
              setCreatingTask={setCreatingTask}
            />
          ) : null}
          {todoTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              handleDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>

      {/* In Progress Column */}
      <div
        className="bg-gray-200 rounded-md w-1/3 flex flex-col"
        onDrop={(e) => handleDrop(e, 'inProgress')}
        onDragOver={handleDragOver}
      >
        <div className=" p-3 rounded-t-md">
          <h2 className="font-semibold text-gray-700">
            In Progress ({inProgressTasks.length})
          </h2>
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          {inProgressTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              handleDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>

      {/* Done Column */}
      <div
        className="bg-gray-200 rounded-md w-1/3 flex flex-col"
        onDrop={(e) => handleDrop(e, 'done')}
        onDragOver={handleDragOver}
      >
        <div className=" p-3 rounded-t-md">
          <h2 className="font-semibold text-gray-700">
            Done ({doneTasks.length})
          </h2>
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          {doneTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              handleDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
