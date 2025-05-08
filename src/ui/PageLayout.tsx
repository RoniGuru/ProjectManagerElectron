import { type ReactNode } from 'react';
import LayoutSideBar from './Components/Layout/LayoutSideBar';
export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen ">
      <LayoutSideBar />

      {/* Main Content */}
      <div className="flex-1 bg-blue-200 p-6 overflow-auto">{children}</div>
    </div>
  );
}
