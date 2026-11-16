import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/UserCard';

function BrowsePage() {
  const { apiCall, user, fetchUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (searchQuery = '') => {
    setLoading(true);
    try {
      const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
      const data = await apiCall(`/users${query}`);
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers(search);
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
        <h1>🔍 Browse Users</h1>
        <p>Find people to exchange skills with</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name, skill, or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">🔍 Search</button>
      </form>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : users.length > 0 ? (
        <div className="user-grid">
          {users.map(u => (
            <UserCard
              key={u._id}
              user={u}
              currentUser={user}
              onConnect={handleConnect}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">😕</span>
          <h3>No users found</h3>
          <p>Try a different search term</p>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default BrowsePage;
