import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showRightSidebar?: boolean;
}

export function MainLayout({ children, showSidebar = true, showRightSidebar = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 min-w-0">
          {children}
        </main>
        {showRightSidebar && <RightSidebar />}
      </div>
    </div>
  );
}
