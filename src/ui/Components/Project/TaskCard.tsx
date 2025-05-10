import type { Task } from '../../../db/types';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../state/store';
import { deleteTask } from '../../state/TaskSlice';

export default function TaskCard({
  task,
  handleDragStart,
}: {
  task: Task;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: number) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();

  function handleDeleteTask(taskId: number) {
    dispatch(deleteTask(taskId));
  }

  return (
    <div
      key={task.id}
      className="bg-white p-3 rounded mb-2 shadow cursor-move w-full"
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
    >
      <div className="flex justify-between items-start w-full">
        <h3 className="font-medium break-all pr-2 flex-grow overflow-hidden">
          {task.name}
        </h3>
        <button
          onClick={() => handleDeleteTask(task.id)}
          className="text-red-500 hover:text-red-700 flex-shrink-0 ml-1"
          aria-label="Delete task"
        >
          ×
        </button>
      </div>
      <p className="text-gray-600 text-sm mt-1 break-all whitespace-normal overflow-hidden">
        {task.description}
      </p>
    </div>
  );
}
