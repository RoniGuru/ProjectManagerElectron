import { useSelector } from 'react-redux';
import type { RootState } from '../state/store';
import { useState } from 'react';
import type { Task } from '../../db/types';

export default function ProjectPage() {
  const currentProject = useSelector(
    (state: RootState) => state.Project.selectedProject
  );

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
    <div>
      {currentProject ? (
        <>
          <h1>
            {currentProject.name} {currentProject.id}
          </h1>
        </>
      ) : null}
    </div>
  );
}
