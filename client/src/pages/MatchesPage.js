import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/UserCard';

function MatchesPage() {
  const { apiCall, user, fetchUser } = useAuth();
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
        <h1>🤝 Your Matches</h1>
        <p>Users who can teach what you want to learn — highlighted skills show the match!</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Finding matches...</p>
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
          <span className="empty-icon">🎯</span>
          <h3>No matches yet</h3>
          <p>Add skills you want to learn in your profile to find matches!</p>
          <a href="/profile" className="setup-btn">Update Profile →</a>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default MatchesPage;
