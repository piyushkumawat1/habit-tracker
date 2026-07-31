import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';
import BottomNav from '../components/layout/BottomNav.jsx';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div id="app" className="pb-[calc(env(safe-area-inset-bottom)+70px)] md:pb-0">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Top Header */}
      <header className="mobile-header md:hidden">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Habitley" className="w-7 h-7" />
          <span className="mobile-brand">Habitley</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
