import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    skillsToTeach: user?.skillsToTeach?.join(', ') || '',
    skillsToLearn: user?.skillsToLearn?.join(', ') || ''
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        github: formData.github,
        linkedin: formData.linkedin,
        skillsToTeach: formData.skillsToTeach.split(',').map(s => s.trim()).filter(Boolean),
        skillsToLearn: formData.skillsToLearn.split(',').map(s => s.trim()).filter(Boolean)
      });
      setEditing(false);
      setToast('Profile updated successfully! ✅');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast(err.message);
      setTimeout(() => setToast(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>👤 My Profile</h1>
        <button className="edit-btn" onClick={() => setEditing(!editing)}>
          {editing ? '✕ Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      {editing ? (
        <form className="profile-form" onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" placeholder="e.g., Mumbai, India" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea placeholder="Tell others about yourself..." value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} maxLength={300} rows={3} />
            <span className="char-count">{formData.bio.length}/300</span>
          </div>

          <div className="form-group">
            <label>🎓 Skills I Can Teach <span className="hint">(comma separated)</span></label>
            <input type="text" placeholder="e.g., React, Python, Guitar, Photography" value={formData.skillsToTeach} onChange={(e) => setFormData({...formData, skillsToTeach: e.target.value})} />
          </div>

          <div className="form-group">
            <label>📚 Skills I Want to Learn <span className="hint">(comma separated)</span></label>
            <input type="text" placeholder="e.g., Machine Learning, Cooking, Spanish" value={formData.skillsToLearn} onChange={(e) => setFormData({...formData, skillsToLearn: e.target.value})} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub URL</label>
              <input type="url" placeholder="https://github.com/username" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} />
            </div>
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input type="url" placeholder="https://linkedin.com/in/username" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </form>
      ) : (
        <div className="profile-view">
          <div className="profile-card">
            <div className="profile-top">
              <div className="profile-avatar-xl">{user?.name?.charAt(0).toUpperCase()}</div>
              <div>
                <h2>{user?.name}</h2>
                <p className="profile-email">{user?.email}</p>
                {user?.location && <p className="profile-location">📍 {user?.location}</p>}
              </div>
            </div>
            {user?.bio && <p className="profile-bio">{user?.bio}</p>}

            <div className="profile-links">
              {user?.github && <a href={user.github} target="_blank" rel="noreferrer" className="profile-link">🔗 GitHub</a>}
              {user?.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" className="profile-link">🔗 LinkedIn</a>}
            </div>
          </div>

          <div className="profile-skills-section">
            <div className="profile-skill-card">
              <h3>🎓 Skills I Can Teach</h3>
              <div className="skill-tags">
                {user?.skillsToTeach?.length > 0 ? (
                  user.skillsToTeach.map((skill, i) => (
                    <span key={i} className="skill-tag teach">{skill}</span>
                  ))
                ) : (
                  <p className="no-skills">No skills added yet. Click Edit to add!</p>
                )}
              </div>
            </div>
            <div className="profile-skill-card">
              <h3>📚 Skills I Want to Learn</h3>
              <div className="skill-tags">
                {user?.skillsToLearn?.length > 0 ? (
                  user.skillsToLearn.map((skill, i) => (
                    <span key={i} className="skill-tag learn">{skill}</span>
                  ))
                ) : (
                  <p className="no-skills">No skills added yet. Click Edit to add!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default ProfilePage;
