import { useState } from 'react';
import { SiTicktick } from 'react-icons/si';
import { useDispatch } from 'react-redux';
import { type AppDispatch } from '../../state/store';
import { addTask } from '../../state/TaskSlice';

export default function CreateTaskForm({
  id,
  setCreatingTask,
}: {
  id: number;
  setCreatingTask: (creatingTask: boolean) => void;
}) {
  const [name, setName] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();

  async function handleCreateTask() {
    if (name != '') {
      await dispatch(
        addTask({ project_id: id, name, description: '', status: 'done' })
      );
    }
    setName('');
    setCreatingTask(false);
  }
  return (
    <div className="bg-white p-2 rounded mb-2 shadow flex justify-between  ">
      <input
        type="text"
        placeholder="name"
        className="p-1 w-3/4"
        onChange={(e) => setName(e.target.value)}
      />
      <SiTicktick
        onClick={handleCreateTask}
        className="justify-center text-blue-500 h-12 hover:text-blue-800 cursor-pointer"
        size={24}
      >
        submit
      </SiTicktick>
    </div>
  );
}
