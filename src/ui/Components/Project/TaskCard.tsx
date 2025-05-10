import type { Task } from '../../../db/types';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../state/store';
import { deleteTask, updateTask } from '../../state/TaskSlice';
import { useState } from 'react';
import { SiTicktick } from 'react-icons/si';
import { FaXmark } from 'react-icons/fa6';
import TextareaAutosize from 'react-textarea-autosize';
import { IoTrashBin } from 'react-icons/io5';

export default function TaskCard({
  task,
  handleDragStart,
}: {
  task: Task;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: number) => void;
}) {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
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
      className="bg-white p-3 rounded mb-2 shadow cursor-move w-full"
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
    >
      {isEditing ? (
        <div style={{ height: 18 }} />
      ) : (
        <div className="w-full flex justify-end">
          <IoTrashBin
            size={18}
            onClick={handleDeleteTask}
            className=" text-red-500  hover:text-red-800 cursor-pointer"
          />
        </div>
      )}
      <div
        className="flex justify-between items-start w-full"
        onDoubleClick={(e) => {
          e.stopPropagation;
          setIsEditing(true);
        }}
      >
        {isEditing ? (
          <TextareaAutosize
            value={name}
            onChange={(e) => setName(e.target.value)}
            minRows={1}
            maxRows={10}
            className="p-1 w-full cursor-pointer  "
          />
        ) : (
          <h3 className="font-medium break-all p-1 flex-grow overflow-hidden w-full cursor-pointer">
            {task.name}
          </h3>
        )}
      </div>
      <div className=" flex justify-end flex-row w-full  items-center gap-6 pr-2  h-[24px]">
        {isEditing ? (
          <>
            <SiTicktick
              className="justify-center text-blue-500  hover:text-blue-800 cursor-pointer"
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
              className="justify-center text-red-500  hover:text-red-800 cursor-pointer"
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
