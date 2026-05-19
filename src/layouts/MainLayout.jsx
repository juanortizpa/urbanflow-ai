import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import SmartAlerts from '../components/SmartAlerts';
import { useApp } from '../context/AppContext';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { activeAlert } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6 bg-mesh">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
        {activeAlert && <SmartAlerts alert={activeAlert} />}
      </div>
    </div>
  );
}
