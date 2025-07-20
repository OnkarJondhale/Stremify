import { useState } from 'react';
import { Outlet } from 'react-router-dom'; 

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Theme from './Theme';

function Layout({ user, navElements, sidebarElements, bottomElements,themeModal }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar navElements={navElements} bottomElements={bottomElements} />
      {
        themeModal && <Theme isOpen={themeModal}/>
      }
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          user={user}
          sidebarElements={sidebarElements}
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;