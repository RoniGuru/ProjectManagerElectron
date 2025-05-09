import { useNavigate } from 'react-router-dom';
import CreateProjectForm from '../Components/CreateProjectForm';

/**
 * Page when user creates a project
 */
export default function CreateProject() {
  const navigate = useNavigate();
  return (
    <div className="    flex items-center flex-col">
      <header className="w-full ">
        <button onClick={() => navigate('/')}>go back</button>
      </header>

      <CreateProjectForm />
    </div>
  );
}
