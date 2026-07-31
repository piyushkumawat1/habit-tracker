import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Trophy, LineChart, User } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { path: '/habits', label: 'Habits', icon: CheckSquare },
    { path: '/challenges', label: 'Challenges', icon: Trophy },
    { path: '/insights', label: 'Insights', icon: LineChart },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="mobile-bottom-nav md:hidden">
      <div className="bottom-nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `bottom-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <div className="bottom-nav-icon-wrapper">
                <Icon size={24} strokeWidth={2.2} />
              </div>
              <span className="bottom-nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
