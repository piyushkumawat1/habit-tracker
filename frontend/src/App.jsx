import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { useHabits } from './hooks/useHabits.js';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Habits from './pages/Habits.jsx';
import AddHabit from './pages/AddHabit.jsx';
import Calendar from './pages/Calendar.jsx';
import Insights from './pages/Insights.jsx';
import Challenges from './pages/Challenges.jsx';
import Journey from './pages/Journey.jsx';
import Profile from './pages/Profile.jsx';
import './index.css';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [authView, setAuthView] = useState('login');
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
    return authView === 'login'
      ? <Login onSwitch={() => setAuthView('register')} />
      : <Register onSwitch={() => setAuthView('login')} />;
  }

  function renderPage() {
    switch (currentPage) {
      case 'home': return <Home habits={habits} logs={logs} refresh={refresh} />;
      case 'habits': return <Habits habits={habits} logs={logs} refresh={refresh} onNavigate={setCurrentPage} />;
      case 'add-habit': return <AddHabit onNavigate={setCurrentPage} refresh={refresh} />;
      case 'calendar': return <Calendar habits={habits} logs={logs} refresh={refresh} />;
      case 'insights': return <Insights habits={habits} logs={logs} />;
      case 'challenges': return <Challenges habits={habits} logs={logs} />;
      case 'journey': return <Journey habits={habits} logs={logs} />;
      case 'profile': return <Profile />;
      default: return <Home habits={habits} logs={logs} refresh={refresh} />;
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
