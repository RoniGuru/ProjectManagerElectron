import type { Task } from '../../../db/types';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../state/store';
import { deleteTask, updateTask } from '../../state/TaskSlice';
import { useState } from 'react';
import { SiTicktick } from 'react-icons/si';
import { FaXmark } from 'react-icons/fa6';
import TextareaAutosize from 'react-textarea-autosize';
import { IoTrashBin } from 'react-icons/io5';
import { FiEdit } from 'react-icons/fi';

export default function TaskCard({
  task,
  handleDragStart,
}: {
  task: Task;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: number) => void;
}) {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [name, setName] = useState<string>(task.name);

  const dispatch = useDispatch<AppDispatch>();

  function handleDeleteTask() {
    dispatch(deleteTask(task.id));
  }

  function handleEdit(value: boolean) {
    if (value) {
      dispatch(updateTask({ id: task.id, updates: { name } }));
    } else {
      setName(task.name);
    }
    setIsEditing(false);
  }

  return (
    <div
      key={task.id}
      className="bg-white p-3 rounded mb-2 shadow cursor-move w-full hover:opacity-70 ease-in duration-150 flex"
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/**text */}
      <div className="flex gap-2 w-4/5">
        {isEditing ? (
          <TextareaAutosize
            value={name}
            onChange={(e) => setName(e.target.value)}
            minRows={1}
            maxRows={10}
            className="p-1 w-full"
          />
        ) : (
          <h3 className="font-medium break-all p-1 flex-grow overflow-hidden w-full">
            {task.name}
          </h3>
        )}
      </div>
      {/**buttons */}
      <div className="flex justify-end items-center w-1/5 gap-6 pr-2 ">
        {isEditing ? (
          <div className="flex h-full items-end justify-around w-3/4 ">
            <SiTicktick
              className="text-blue-500 hover:text-blue-800 cursor-pointer"
              size={18}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(true);
              }}
            />
            <FaXmark
              size={18}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(false);
              }}
              className="text-red-500 hover:text-red-800 cursor-pointer"
            />
          </div>
        ) : (
          <div className=" flex flex-col gap-4 h-full justify-between">
            <IoTrashBin
              size={18}
              onClick={handleDeleteTask}
              className={`text-red-500 hover:text-red-800 cursor-pointer ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <FiEdit
              size={18}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="cursor-pointer hover:scale-125 ease-in duration-150"
            />
          </div>
        )}
      </div>
    </div>
  );
}
