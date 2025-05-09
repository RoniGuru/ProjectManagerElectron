import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../state/store';
import SideBarProjectCard from './SideBarProjectCard';

export default function LayoutSideBar() {
  const { items } = useSelector((state: RootState) => state.Project);
  const navigate = useNavigate();
  return (
    <div className="w-72 h-screen  bg-gray-800 text-white shadow-lg flex-col flex gap-2  justify-between  overflow-y-auto  minimal-scrollbar ">
      <div className="h-full">
        <div className="mb-1  p-4 flex  justify-around items-center ">
          <h1 className="text-xl font-bold">Projects</h1>
          <FaPlus
            size={30}
            className="hover:opacity-45 cursor-pointer"
            onClick={() => navigate('/CreateProject')}
          />
        </div>
        <nav className="p-4 rounded gap-2 flex flex-col">
          {items.map((project) => (
            <SideBarProjectCard project={project} />
          ))}
        </nav>
      </div>
    </div>
  );
}
