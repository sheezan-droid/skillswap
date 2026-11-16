import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/UserCard';

function HomePage() {
  const { user, apiCall, fetchUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const data = await apiCall('/users/matches');
      setMatches(data.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    try {
      await apiCall(`/users/connect/${userId}`, { method: 'POST' });
      setToast('Connection request sent! 🤝');
      await fetchUser();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast(err.message);
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>👋 Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p>Here are your top skill matches</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-icon">🎓</span>
          <span className="stat-value">{user?.skillsToTeach?.length || 0}</span>
          <span className="stat-label">Skills to Teach</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <span className="stat-value">{user?.skillsToLearn?.length || 0}</span>
          <span className="stat-label">Skills to Learn</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🤝</span>
          <span className="stat-value">{user?.connections?.length || 0}</span>
          <span className="stat-label">Connections</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <span className="stat-value">{matches.length}</span>
          <span className="stat-label">Matches Found</span>
        </div>
      </div>

      {(!user?.skillsToTeach?.length && !user?.skillsToLearn?.length) && (
        <div className="setup-prompt">
          <h3>🚀 Complete your profile to get started!</h3>
          <p>Add skills you can teach and skills you want to learn to find your matches.</p>
          <a href="/profile" className="setup-btn">Setup Profile →</a>
        </div>
      )}

      <div className="section-header">
        <h2>🤝 Your Skill Matches</h2>
        <a href="/browse" className="view-all">Browse All →</a>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Finding your matches...</p>
        </div>
      ) : matches.length > 0 ? (
        <div className="user-grid">
          {matches.map(match => (
            <UserCard
              key={match._id}
              user={match}
              currentUser={user}
              onConnect={handleConnect}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No matches yet</h3>
          <p>Add more skills to your profile or browse users to find connections!</p>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default HomePage;
