import React from 'react';

function UserCard({ user, onConnect, currentUser, onViewProfile }) {
  const matchingSkills = user.matchingSkills || [];
  const mutualBenefit = user.mutualBenefit || [];
  const isConnected = currentUser?.connections?.some(
    c => c.user === user._id || c.user?._id === user._id
  );

  return (
    <div className="user-card" onClick={() => onViewProfile && onViewProfile(user)}>
      <div className="user-card-header">
        <div className="user-avatar-lg">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="user-card-info">
          <h3>{user.name}</h3>
          {user.location && <span className="user-location">📍 {user.location}</span>}
        </div>
        {user.matchScore && (
          <div className="match-score">
            <span className="match-number">{Math.min(user.matchScore * 20, 100)}%</span>
            <span className="match-label">match</span>
          </div>
        )}
      </div>

      {user.bio && <p className="user-bio">{user.bio}</p>}

      <div className="skills-section">
        <div className="skill-group">
          <span className="skill-label">🎓 Can Teach</span>
          <div className="skill-tags">
            {user.skillsToTeach?.length > 0 ? (
              user.skillsToTeach.map((skill, i) => (
                <span key={i} className={`skill-tag teach ${matchingSkills.includes(skill) ? 'highlight' : ''}`}>
                  {skill}
                </span>
              ))
            ) : (
              <span className="no-skills">No skills listed</span>
            )}
          </div>
        </div>
        <div className="skill-group">
          <span className="skill-label">📚 Wants to Learn</span>
          <div className="skill-tags">
            {user.skillsToLearn?.length > 0 ? (
              user.skillsToLearn.map((skill, i) => (
                <span key={i} className={`skill-tag learn ${mutualBenefit.includes(skill) ? 'highlight' : ''}`}>
                  {skill}
                </span>
              ))
            ) : (
              <span className="no-skills">No skills listed</span>
            )}
          </div>
        </div>
      </div>

      <div className="user-card-footer">
        <div className="social-links">
          {user.github && <a href={user.github} target="_blank" rel="noreferrer" className="social-link" onClick={e => e.stopPropagation()}>GitHub</a>}
          {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" className="social-link" onClick={e => e.stopPropagation()}>LinkedIn</a>}
        </div>
        {!isConnected ? (
          <button className="connect-btn" onClick={(e) => { e.stopPropagation(); onConnect(user._id); }}>
            🤝 Connect
          </button>
        ) : (
          <span className="connected-badge">✅ Connected</span>
        )}
      </div>
    </div>
  );
}

export default UserCard;
