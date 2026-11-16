import React, { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import MatchesPage from './pages/MatchesPage';
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const { user, loading } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('ss-theme') || 'dark');
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ss-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleNav = () => {
      const path = window.location.pathname;
      if (path === '/browse') setCurrentPage('browse');
      else if (path === '/matches') setCurrentPage('matches');
      else if (path === '/profile') setCurrentPage('profile');
      else setCurrentPage('home');
    };
    handleNav();
    window.addEventListener('popstate', handleNav);
    return () => window.removeEventListener('popstate', handleNav);
  }, []);

  // Simple client-side navigation
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const path = link.getAttribute('href');
        window.history.pushState(null, '', path);
        if (path === '/browse') setCurrentPage('browse');
        else if (path === '/matches') setCurrentPage('matches');
        else if (path === '/profile') setCurrentPage('profile');
        else setCurrentPage('home');
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading SkillSwap...</p>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  const renderPage = () => {
    switch (currentPage) {
      case 'browse': return <BrowsePage />;
      case 'matches': return <MatchesPage />;
      case 'profile': return <ProfilePage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="app">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
