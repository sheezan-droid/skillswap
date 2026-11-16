import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar({ theme, toggleTheme }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <a href="/" className="nav-logo">
          <span className="nav-logo-icon">🔄</span>
          <span className="nav-logo-text">SkillSwap</span>
        </a>

        {user && (
          <div className="nav-links">
            <a href="/" className="nav-link">🏠 Home</a>
            <a href="/browse" className="nav-link">🔍 Browse</a>
            <a href="/matches" className="nav-link">🤝 Matches</a>
            <a href="/profile" className="nav-link">👤 Profile</a>
          </div>
        )}

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user && (
            <div className="nav-user" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="nav-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              {menuOpen && (
                <div className="nav-dropdown">
                  <span className="dropdown-name">{user.name}</span>
                  <span className="dropdown-email">{user.email}</span>
                  <hr />
                  <a href="/profile" className="dropdown-item">👤 My Profile</a>
                  <button className="dropdown-item logout-btn" onClick={logout}>🚪 Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
