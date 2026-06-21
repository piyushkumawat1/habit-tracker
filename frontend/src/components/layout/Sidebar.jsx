import { useAuth } from '../../context/AuthContext.jsx';
import { NavLink, Link } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const links = [
    { page: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { page: 'habits', path: '/habits', label: 'Habits', icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { page: 'challenges', path: '/challenges', label: 'Challenges', icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> },
    { page: 'insights', path: '/insights', label: 'Insights', icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  ];

  return (
    <nav id="sidebar" className={`sidebar ${isOpen ? 'open' : ''}`}>
      <Link 
        to="/dashboard"
        className="sidebar-brand" 
        onClick={onClose}
        style={{ cursor: 'pointer', transition: 'opacity 0.2s', textDecoration: 'none' }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        <div className="brand-icon" style={{ borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}>
          <img src="/logo.png" alt="Habitly Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span className="brand-name" style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.5px' }}>Habitly</span>
      </Link>

      <ul className="nav-links">
        {links.map(l => (
          <li key={l.page}>
            <NavLink 
              to={l.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
              onClick={onClose}
            >
              {l.icon}
              <span>{l.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <Link 
          to="/profile"
          className="user-pill" 
          onClick={onClose}
          style={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          <div className="user-avatar" style={{ overflow: 'hidden' }}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || user?.email || 'User'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>View Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
