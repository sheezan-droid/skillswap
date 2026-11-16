import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-hero">
          <div className="auth-hero-content">
            <span className="auth-logo">🔄</span>
            <h1>SkillSwap</h1>
            <p>Exchange skills with people around the world. Teach what you know, learn what you don't.</p>
            <div className="auth-features">
              <div className="auth-feature">🎓 List skills you can teach</div>
              <div className="auth-feature">📚 Find skills you want to learn</div>
              <div className="auth-feature">🤝 Connect with matching users</div>
              <div className="auth-feature">🌍 Global skill exchange community</div>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-container">
            <h2>{isLogin ? 'Welcome Back' : 'Join SkillSwap'}</h2>
            <p className="auth-subtitle">
              {isLogin ? 'Sign in to continue your skill exchange journey' : 'Create an account to start exchanging skills'}
            </p>

            {error && <div className="auth-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? '⏳ Please wait...' : isLogin ? '🚀 Sign In' : '✨ Create Account'}
              </button>
            </form>

            <p className="auth-switch">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
