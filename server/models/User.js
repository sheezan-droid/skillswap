const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  bio: {
    type: String,
    default: '',
    maxlength: 300
  },
  avatar: {
    type: String,
    default: ''
  },
  skillsToTeach: [{
    type: String,
    trim: true
  }],
  skillsToLearn: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  connections: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Index for searching by skills
userSchema.index({ skillsToTeach: 1 });
userSchema.index({ skillsToLearn: 1 });
userSchema.index({ name: 'text', bio: 'text' });

module.exports = mongoose.model('User', userSchema);
