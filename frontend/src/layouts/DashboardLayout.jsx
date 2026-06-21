import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div id="app">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && <div className="sidebar-overlay active" onClick={() => setSidebarOpen(false)} />}

      <header className="mobile-header">
        <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span className="mobile-brand">Habitly</span>
        <div style={{ width: 36 }} />
      </header>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
