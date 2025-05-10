import { useNavigate } from 'react-router-dom';
import CreateProjectForm from '../Components/CreateProjectForm';

/**
 * Page when user creates a project
 */
export default function CreateProject() {
  const navigate = useNavigate();
  return (
    <div className="    h-full flex justify-center items-center">
      <CreateProjectForm />
    </div>
  );
}
