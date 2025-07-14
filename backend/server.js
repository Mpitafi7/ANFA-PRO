const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sanitizePublicId } = require('./utils/publicIdGenerator');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ANFA PRO API is running',
    timestamp: new Date().toISOString()
  });
});

// Public Profile API Routes
app.get('/api/users/:publicId/public', async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Validate and sanitize publicId
    const sanitizedId = sanitizePublicId(publicId);
    if (!sanitizedId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid public ID format'
      });
    }

    // In a real app, this would fetch from database
    // For now, we'll simulate with a mock response
    const mockProfile = {
      publicId: sanitizedId,
      name: 'John Doe',
      plan: 'pro',
      verified: true,
      linksCreated: 320,
      totalViews: 9845,
      joined: '2024-01-11T00:00:00.000Z',
      profileImage: null
    };

    res.json({
      success: true,
      data: mockProfile
    });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Admin-only endpoints (would require authentication in real app)
app.put('/api/users/:publicId/public', async (req, res) => {
  try {
    const { publicId } = req.params;
    const profileData = req.body;
    
    // Validate and sanitize publicId
    const sanitizedId = sanitizePublicId(publicId);
    if (!sanitizedId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid public ID format'
      });
    }

    // In a real app, this would update the database
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { publicId: sanitizedId, ...profileData }
    });
  } catch (error) {
    console.error('Error updating public profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/users/:publicId/ban', async (req, res) => {
  try {
    const { publicId } = req.params;
    const { reason } = req.body;
    
    // Validate and sanitize publicId
    const sanitizedId = sanitizePublicId(publicId);
    if (!sanitizedId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid public ID format'
      });
    }

    // In a real app, this would ban the user in the database
    res.json({
      success: true,
      message: 'User banned successfully',
      data: { publicId: sanitizedId, banned: true, reason }
    });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/users/:publicId/unban', async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Validate and sanitize publicId
    const sanitizedId = sanitizePublicId(publicId);
    if (!sanitizedId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid public ID format'
      });
    }

    // In a real app, this would unban the user in the database
    res.json({
      success: true,
      message: 'User unbanned successfully',
      data: { publicId: sanitizedId, banned: false }
    });
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ANFA PRO API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app; 