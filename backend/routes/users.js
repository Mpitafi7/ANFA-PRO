const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        urlsCreated: user.urlsCreated,
        maxUrls: user.maxUrls,
        isVerified: user.isVerified,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// @desc    Update user plan
// @route   PUT /api/users/plan
// @access  Private
router.put('/plan', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!['free', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type'
      });
    }
    
    const user = await User.findById(req.user._id);
    user.plan = plan;
    user.updatePlanLimits();
    await user.save();
    
    res.json({
      success: true,
      message: 'Plan updated successfully',
      data: {
        plan: user.plan,
        maxUrls: user.maxUrls
      }
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating plan',
      error: error.message
    });
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
router.delete('/profile', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
});

module.exports = router; 