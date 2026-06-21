import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';
import WelcomeModal from '../components/WelcomeModal.jsx';

export default function DashboardLayout({ currentPage, onNavigate, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastView = localStorage.getItem('lastGardenViewDate');
    if (lastView !== today) {
      setShowWelcome(true);
    }
  }, []);

  function handleDismissWelcome() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastGardenViewDate', today);
    setShowWelcome(false);
  }

  function handleNavigate(page) {
    onNavigate(page);
    setSidebarOpen(false);
  }

  return (
    <div id="app">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} isOpen={sidebarOpen} />

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

      {showWelcome && <WelcomeModal onClose={handleDismissWelcome} />}
    </div>
  );
}
