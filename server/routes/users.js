const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (with optional search/filter)
router.get('/', auth, async (req, res) => {
  try {
    const { search, skill, page = 1, limit = 12 } = req.query;
    let query = { _id: { $ne: req.user._id } }; // Exclude current user

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skillsToTeach: { $regex: search, $options: 'i' } },
        { skillsToLearn: { $regex: search, $options: 'i' } }
      ];
    }

    if (skill) {
      query.skillsToTeach = { $regex: skill, $options: 'i' };
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/matches
// @desc    Get skill matches (users who teach what you want to learn)
router.get('/matches', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser.skillsToLearn.length) {
      return res.json({ matches: [] });
    }

    const matches = await User.find({
      _id: { $ne: req.user._id },
      skillsToTeach: { $in: currentUser.skillsToLearn }
    })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(20);

    // Calculate match score
    const scoredMatches = matches.map(user => {
      const matchingSkills = user.skillsToTeach.filter(skill =>
        currentUser.skillsToLearn.some(s => s.toLowerCase() === skill.toLowerCase())
      );
      const mutualBenefit = user.skillsToLearn.filter(skill =>
        currentUser.skillsToTeach.some(s => s.toLowerCase() === skill.toLowerCase())
      );
      return {
        ...user.toObject(),
        matchingSkills,
        mutualBenefit,
        matchScore: matchingSkills.length + mutualBenefit.length * 2
      };
    });

    scoredMatches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ matches: scoredMatches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, skillsToTeach, skillsToLearn, location, github, linkedin } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (skillsToTeach) updateData.skillsToTeach = skillsToTeach;
    if (skillsToLearn) updateData.skillsToLearn = skillsToLearn;
    if (location !== undefined) updateData.location = location;
    if (github !== undefined) updateData.github = github;
    if (linkedin !== undefined) updateData.linkedin = linkedin;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/connect/:id
// @desc    Send connection request
router.post('/connect/:id', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already connected
    const existingConnection = targetUser.connections.find(
      c => c.user.toString() === req.user._id.toString()
    );
    if (existingConnection) {
      return res.status(400).json({ message: 'Connection already exists' });
    }

    // Add to target's connections
    targetUser.connections.push({ user: req.user._id, status: 'pending' });
    await targetUser.save();

    // Add to sender's connections
    const sender = await User.findById(req.user._id);
    sender.connections.push({ user: req.params.id, status: 'pending' });
    await sender.save();

    res.json({ message: 'Connection request sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/connect/:id/accept
// @desc    Accept connection request
router.put('/connect/:id/accept', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const connection = user.connections.find(
      c => c.user.toString() === req.params.id
    );

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    connection.status = 'accepted';
    await user.save();

    // Update other user's connection too
    const otherUser = await User.findById(req.params.id);
    const otherConnection = otherUser.connections.find(
      c => c.user.toString() === req.user._id.toString()
    );
    if (otherConnection) {
      otherConnection.status = 'accepted';
      await otherUser.save();
    }

    res.json({ message: 'Connection accepted!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/skills/all
// @desc    Get all unique skills
router.get('/skills/all', auth, async (req, res) => {
  try {
    const teachSkills = await User.distinct('skillsToTeach');
    const learnSkills = await User.distinct('skillsToLearn');
    const allSkills = [...new Set([...teachSkills, ...learnSkills])].sort();
    res.json(allSkills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
