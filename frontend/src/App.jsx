import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    return (
      <Routes>
        <Route path="/" element={<TestDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <DashboardLayout>
      {dataLoading ? (
        <div className="loading-screen" style={{ position: 'relative', minHeight: 400 }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard habits={habits} logs={logs} refresh={refresh} />} />
          <Route path="/habits" element={<Habits habits={habits} logs={logs} refresh={refresh} />} />
          <Route path="/add-habit" element={<AddHabit refresh={refresh} habits={habits} />} />
          <Route path="/insights" element={<Insights habits={habits} logs={logs} />} />
          <Route path="/challenges" element={<Challenges habits={habits} logs={logs} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      )}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
