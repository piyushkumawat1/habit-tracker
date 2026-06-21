import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { useHabits } from './hooks/useHabits.js';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import LandingPage from './pages/LandingPage.jsx';
import TestDashboard from './pages/TestDashboard.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Habits from './pages/Habits.jsx';
import AddHabit from './pages/AddHabit.jsx';
import Insights from './pages/Insights.jsx';
import Challenges from './pages/Challenges.jsx';
import Profile from './pages/Profile.jsx';
import './index.css';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authView, setAuthView] = useState('landing');
  const { habits, logs, loading: dataLoading, refresh } = useHabits();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading Habitly...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === 'landing') return <TestDashboard onNavigate={setAuthView} />;
    if (authView === 'login') return <Login onSwitch={() => setAuthView('register')} onBack={() => setAuthView('landing')} />;
    if (authView === 'register') return <Register onSwitch={() => setAuthView('login')} onBack={() => setAuthView('landing')} />;
  }

  function renderPage() {
    switch (currentPage) {
      case 'dashboard': return <Dashboard habits={habits} logs={logs} refresh={refresh} onNavigate={setCurrentPage} />;
      case 'habits': return <Habits habits={habits} logs={logs} refresh={refresh} onNavigate={setCurrentPage} />;
      case 'add-habit': return <AddHabit onNavigate={setCurrentPage} refresh={refresh} habits={habits} />;
      case 'insights': return <Insights habits={habits} logs={logs} />;
      case 'challenges': return <Challenges habits={habits} logs={logs} />;
      case 'profile': return <Profile />;
      default: return <Dashboard habits={habits} logs={logs} refresh={refresh} onNavigate={setCurrentPage} />;
    }
  }

  return (
    <DashboardLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {dataLoading ? (
        <div className="loading-screen" style={{ position: 'relative', minHeight: 400 }}>
          <div className="loading-spinner" />
        </div>
      ) : renderPage()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
