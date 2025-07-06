const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import routes
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/urls');
const userRoutes = require('./routes/users');
const blogRoutes = require('./routes/blog');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anfa-pro', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Add demo blog posts if none exist
const addDemoBlogPosts = async () => {
  try {
    const BlogPost = require('./models/BlogPost');
    const User = require('./models/User');
    
    const postCount = await BlogPost.countDocuments();
    if (postCount === 0) {
      // Create demo admin user if not exists
      let adminUser = await User.findOne({ email: 'admin@anfapro.com' });
      if (!adminUser) {
        adminUser = await User.create({
          username: 'admin',
          email: 'admin@anfapro.com',
          password: 'admin123',
          role: 'admin'
        });
      }
      
      // Create demo blog posts
      const demoPosts = [
        {
          title: "The Ultimate Guide to URL Shortening",
          content: "URL shortening has become an essential tool in digital marketing. Learn how to create effective short links that drive engagement and track performance. This comprehensive guide covers everything from basic URL shortening techniques to advanced analytics and optimization strategies.",
          excerpt: "Master the art of URL shortening with our comprehensive guide. Discover best practices, tracking methods, and optimization techniques.",
          featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
          tags: ["URL Shortening", "Digital Marketing", "Analytics"],
          author: adminUser._id,
          is_published: true,
          reading_time: 8
        },
        {
          title: "5 Ways to Boost Your Link Click-Through Rates",
          content: "Discover proven strategies to increase your link click-through rates. From compelling call-to-actions to strategic placement, we cover it all. Learn how to optimize your links for maximum engagement and conversion.",
          excerpt: "Learn the top 5 strategies that successful marketers use to boost their link click-through rates and drive more traffic.",
          featured_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
          tags: ["CTR", "Marketing", "Traffic"],
          author: adminUser._id,
          is_published: true,
          reading_time: 6
        },
        {
          title: "QR Codes: The Future of Link Sharing",
          content: "QR codes are revolutionizing how we share links. Explore how businesses are using QR codes for marketing and customer engagement. Discover the latest trends and best practices for QR code implementation.",
          excerpt: "Discover how QR codes are changing the way we share and track links in the digital age.",
          featured_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
          tags: ["QR Codes", "Innovation", "Mobile"],
          author: adminUser._id,
          is_published: true,
          reading_time: 5
        }
      ];
      
      await BlogPost.insertMany(demoPosts);
      console.log('✅ Demo blog posts added successfully');
    }
  } catch (error) {
    console.error('❌ Error adding demo blog posts:', error);
  }
};

// Add demo URLs if none exist
const addDemoUrls = async () => {
  try {
    const { createDemoData } = require('./utils/demoData');
    await createDemoData();
  } catch (error) {
    console.error('❌ Error adding demo URLs:', error);
  }
};

// Add demo data after database connection
mongoose.connection.once('open', () => {
  addDemoBlogPosts();
  addDemoUrls();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blog', blogRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ANFA PRO API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Malware protection middleware
app.use('/api/urls', (req, res, next) => {
  if (req.method === 'POST') {
    const { originalUrl } = req.body;
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /paypal.*login/i,
      /bank.*login/i,
      /secure.*login/i,
      /\.tk$/i,
      /\.ml$/i,
      /\.ga$/i,
      /\.cf$/i,
      /bit\.ly/i,
      /tinyurl\.com/i
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(originalUrl));
    
    if (isSuspicious) {
      return res.status(400).json({
        success: false,
        message: 'This URL has been flagged as potentially suspicious',
        suspicious: true
      });
    }
  }
  next();
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  // HTTPS redirect (in production)
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 ANFA PRO Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}); 

module.exports = app; 