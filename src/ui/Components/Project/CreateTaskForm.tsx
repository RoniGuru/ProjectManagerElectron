import { useState, useRef, useEffect } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjust height on content change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [name]);

  async function handleCreateTask() {
    if (name !== '') {
      await dispatch(
        addTask({ project_id: id, name, description: '', status: 'todo' })
      );
    }
    setName('');
    setCreatingTask(false);
  }

  return (
    <div className="bg-white p-2 rounded mb-2 shadow flex justify-between gap-4">
      <textarea
        ref={textareaRef}
        value={name}
        placeholder="name"
        className="p-1 w-full  overflow-hidden"
        onChange={(e) => setName(e.target.value)}
        rows={1}
      />
      <SiTicktick
        onClick={handleCreateTask}
        className="justify-center text-blue-500 h-12 hover:text-blue-800 cursor-pointer"
        size={24}
      />
    </div>
  );
}
