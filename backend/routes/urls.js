const express = require('express');
const { nanoid } = require('nanoid');
const CryptoJS = require('crypto-js');
const rateLimit = require('express-rate-limit');
const UAParser = require('ua-parser-js');
const Url = require('../models/Url');
const Click = require('../models/Click');
const { protect, optionalAuth, checkUrlLimit } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for URL creation
const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many URL creation attempts, please try again later.'
});

// Rate limiting for URL redirects
const redirectLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many redirect attempts, please try again later.'
});

// @desc    Create short URL with advanced features
// @route   POST /api/urls
// @access  Private
router.post('/', protect, checkUrlLimit, createUrlLimiter, async (req, res) => {
  try {
    const { 
      originalUrl, 
      customAlias, 
      title, 
      description, 
      tags,
      password,
      expiryHours,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent
    } = req.body;

    // Validate URL
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid URL'
      });
    }

    // Malware protection - check for suspicious patterns
    const suspiciousPatterns = [
      /paypal.*login/i,
      /bank.*login/i,
      /secure.*login/i,
      /\.tk$/i,
      /\.ml$/i,
      /\.ga$/i,
      /\.cf$/i
    ];
    
    const securityWarnings = [];
    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(originalUrl)) {
        securityWarnings.push('suspicious_domain');
      }
    });

    // Check if custom alias already exists
    if (customAlias) {
      const existingUrl = await Url.findOne({ customAlias });
      if (existingUrl) {
        return res.status(400).json({
          success: false,
          message: 'Custom alias already exists'
        });
      }
    }

    // Create URL data
    const urlData = {
      originalUrl,
      user: req.user._id,
      title,
      description,
      tags,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      securityWarnings: securityWarnings.length > 0 ? securityWarnings : undefined,
      isSuspicious: securityWarnings.length > 0
    };

    // Password protection
    if (password) {
      const secretKey = process.env.ENCRYPTION_KEY || 'your-secret-key';
      const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
      urlData.isPasswordProtected = true;
      urlData.encryptedPassword = encryptedPassword;
    }

    // Link expiry
    if (expiryHours) {
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + parseInt(expiryHours));
      urlData.expiresAt = expiryTime;
    }

    if (customAlias) {
      urlData.customAlias = customAlias;
    }

    const url = await Url.create(urlData);

    // Update user's URL count
    req.user.urlsCreated += 1;
    await req.user.save();

    res.status(201).json({
      success: true,
      message: 'URL shortened successfully',
      data: {
        _id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        customAlias: url.customAlias,
        shortUrl: url.shortUrl,
        fullUrl: url.fullUrl,
        title: url.title,
        description: url.description,
        tags: url.tags,
        clicks: url.clicks,
        uniqueClicks: url.uniqueClicks,
        isPasswordProtected: url.isPasswordProtected,
        expiresAt: url.expiresAt,
        isSuspicious: url.isSuspicious,
        securityWarnings: url.securityWarnings,
        createdAt: url.createdAt,
        qrCode: url.qrCode
      }
    });
  } catch (error) {
    console.error('Create URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating short URL',
      error: error.message
    });
  }
});

// @desc    Redirect to original URL with analytics
// @route   GET /api/urls/:shortCode
// @access  Public
router.get('/:shortCode', redirectLimiter, async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { password } = req.query;
    
    const url = await Url.findOne({ 
      $or: [{ shortCode }, { customAlias: shortCode }],
      isActive: true
    });
    
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    // Check if link is expired
    if (url.isExpired()) {
      return res.status(410).json({
        success: false,
        message: 'This link has expired',
        expired: true
      });
    }

    // Check for suspicious links
    if (url.isSuspicious) {
      return res.status(403).json({
        success: false,
        message: 'This link has been flagged as suspicious',
        suspicious: true,
        warnings: url.securityWarnings
      });
    }

    // Password protection check
    if (url.isPasswordProtected) {
      if (!password) {
        return res.status(401).json({
          success: false,
          message: 'Password required',
          requiresPassword: true
        });
      }

      const secretKey = process.env.ENCRYPTION_KEY || 'your-secret-key';
      const decryptedPassword = CryptoJS.AES.decrypt(url.encryptedPassword, secretKey).toString(CryptoJS.enc.Utf8);
      
      if (password !== decryptedPassword) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect password'
        });
      }
    }

    // Get user agent and IP info
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const parser = new UAParser(userAgent);
    const ua = parser.getResult();
    
    // Get IP and location info
    const ip = req.ip || req.connection.remoteAddress;
    let country = 'Unknown';
    let city = 'Unknown';
    
    try {
      const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
      const geoData = await geoResponse.json();
      if (geoData.status === 'success') {
        country = geoData.country || 'Unknown';
        city = geoData.city || 'Unknown';
      }
    } catch (error) {
      console.error('Geo location error:', error);
    }

    // Add analytics
    const clickData = {
      timestamp: new Date(),
      ip,
      country,
      city,
      userAgent,
      browser: ua.browser.name || 'Unknown',
      device: ua.device.type || 'desktop',
      os: ua.os.name || 'Unknown',
      referrer: req.headers.referer || 'Direct'
    };

    await url.addClick(clickData);

    // Redirect to full URL with UTM parameters
    res.redirect(url.fullUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({
      success: false,
      message: 'Error redirecting to URL',
      error: error.message
    });
  }
});

// @desc    Get URL analytics
// @route   GET /api/urls/:id/analytics
// @access  Private
router.get('/:id/analytics', protect, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    const analytics = url.getAnalyticsSummary();

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
});

// @desc    Get all URLs for user
// @route   GET /api/urls
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const query = { user: req.user._id };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const urls = await Url.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Url.countDocuments(query);

    res.json({
      success: true,
      data: urls,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUrls: total
      }
    });
  } catch (error) {
    console.error('Get URLs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching URLs',
      error: error.message
    });
  }
});

// @desc    Get single URL
// @route   GET /api/urls/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    res.json({
      success: true,
      data: url
    });
  } catch (error) {
    console.error('Get URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching URL',
      error: error.message
    });
  }
});

// @desc    Update URL
// @route   PUT /api/urls/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      tags, 
      isActive, 
      expiresAt,
      password,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent
    } = req.body;
    
    const url = await Url.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    if (title !== undefined) url.title = title;
    if (description !== undefined) url.description = description;
    if (tags !== undefined) url.tags = tags;
    if (isActive !== undefined) url.isActive = isActive;
    if (expiresAt !== undefined) url.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (utmSource !== undefined) url.utmSource = utmSource;
    if (utmMedium !== undefined) url.utmMedium = utmMedium;
    if (utmCampaign !== undefined) url.utmCampaign = utmCampaign;
    if (utmTerm !== undefined) url.utmTerm = utmTerm;
    if (utmContent !== undefined) url.utmContent = utmContent;

    // Update password protection
    if (password !== undefined) {
      if (password) {
        const secretKey = process.env.ENCRYPTION_KEY || 'your-secret-key';
        const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
        url.isPasswordProtected = true;
        url.encryptedPassword = encryptedPassword;
      } else {
        url.isPasswordProtected = false;
        url.encryptedPassword = null;
      }
    }

    const updatedUrl = await url.save();

    res.json({
      success: true,
      message: 'URL updated successfully',
      data: updatedUrl
    });
  } catch (error) {
    console.error('Update URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating URL',
      error: error.message
    });
  }
});

// @desc    Delete URL
// @route   DELETE /api/urls/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    await url.remove();

    // Update user's URL count
    req.user.urlsCreated -= 1;
    await req.user.save();

    res.json({
      success: true,
      message: 'URL deleted successfully'
    });
  } catch (error) {
    console.error('Delete URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting URL',
      error: error.message
    });
  }
});

module.exports = router; 