import { useAuth } from '../../context/AuthContext.jsx';

export default function Sidebar({ currentPage, onNavigate }) {
  const { user, logout } = useAuth();

  const links = [
    { page: 'home', label: 'Home', icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { page: 'habits', label: 'Habits', icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { page: 'add-habit', label: 'Add Habit', icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
    { page: 'calendar', label: 'Calendar', icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { page: 'challenges', label: 'Challenges', icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> },
    { page: 'insights', label: 'Insights', icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { page: 'journey', label: 'Journey', icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  ];

  return (
    <nav id="sidebar" className="sidebar">
      <div 
        className="sidebar-brand" 
        onClick={() => onNavigate('home')}
        style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        <div className="brand-icon" style={{ borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}>
          <img src="/logo.png" alt="Habitly Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span className="brand-name" style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.5px' }}>Habitly</span>
      </div>

      <ul className="nav-links">
        {links.map(l => (
          <li key={l.page}>
            <a href="#" className={`nav-link ${currentPage === l.page ? 'active' : ''}`} onClick={e => { e.preventDefault(); onNavigate(l.page); }}>
              {l.icon}
              <span>{l.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <div 
          className="user-pill" 
          onClick={() => onNavigate('profile')}
          style={{ cursor: 'pointer' }}
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
        </div>
      </div>
    </nav>
  );
}
