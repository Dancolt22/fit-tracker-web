import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Apple, 
  LineChart, 
  Settings, 
  Activity,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Sidebar.css';

export default function Sidebar() {
  const { theme, toggleTheme, userProfile } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Nutrition', path: '/nutrition', icon: Apple },
    { name: 'Progress', path: '/progress', icon: LineChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="mobile-header">
        <div className="mobile-logo-group">
          <Activity className="app-logo-icon" />
          <span className="logo-text">FitTrack</span>
        </div>
        <button className="menu-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`sidebar-container ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <Activity className="app-logo-icon animate-pulse-slow" />
          <span className="logo-text">FitTrack</span>
        </div>

        {/* User Mini Profile */}
        <div className="user-profile-widget">
          <div className="user-avatar">
            {userProfile?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-info">
            <h4 className="user-name">{userProfile?.name || 'User'}</h4>
            <p className="user-role">Premium Member</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.name} 
                to={item.path} 
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} className="nav-icon" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="sidebar-footer">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <>
                <Sun size={18} className="theme-icon text-warning" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={18} className="theme-icon text-secondary" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile menu */}
      {isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)}></div>}
    </>
  );
}
