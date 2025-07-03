const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const Click = require('../models/Click');
const { protect, optionalAuth, checkUrlLimit } = require('../middleware/auth');

const router = express.Router();

// @desc    Create short URL
// @route   POST /api/urls
// @access  Private
router.post('/', protect, checkUrlLimit, async (req, res) => {
  try {
    const { originalUrl, customAlias, title, description, tags } = req.body;

    // Validate URL
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid URL'
      });
    }

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

    // Create URL
    const urlData = {
      originalUrl,
      user: req.user._id,
      title,
      description,
      tags
    };

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
        title: url.title,
        description: url.description,
        tags: url.tags,
        clicks: url.clicks,
        uniqueClicks: url.uniqueClicks,
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
    const { title, description, tags, isActive, expiresAt } = req.body;
    
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

    // Delete associated clicks
    await Click.deleteMany({ url: url._id });
    
    // Delete URL
    await url.deleteOne();

    // Update user's URL count
    req.user.urlsCreated = Math.max(0, req.user.urlsCreated - 1);
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

// @desc    Redirect to original URL
// @route   GET /:shortCode
// @access  Public
router.get('/redirect/:shortCode', optionalAuth, async (req, res) => {
  try {
    const { shortCode } = req.params;
    
    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }]
    });

    if (!url || !url.isActive) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    // Track click
    const clickData = {
      url: url._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referrer')
    };

    if (req.user) {
      clickData.user = req.user._id;
    }

    // Check if unique click
    const isUnique = await Click.isUniqueClick(url._id, clickData.ipAddress);
    clickData.isUnique = isUnique;

    await Click.create(clickData);

    // Update URL stats
    url.clicks += 1;
    if (isUnique) {
      url.uniqueClicks += 1;
    }
    url.lastClicked = new Date();
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({
      success: false,
      message: 'Error redirecting to URL'
    });
  }
});

// @desc    Get URL analytics
// @route   GET /api/urls/:id/analytics
// @access  Private
router.get('/:id/analytics', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { period = '7d' } = req.query;

    const url = await Url.findOne({ _id: id, user: req.user._id });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get clicks for the period
    const clicks = await Click.find({
      url: id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    // Group clicks by date
    const clicksByDate = {};
    clicks.forEach(click => {
      const date = click.createdAt.toISOString().split('T')[0];
      if (!clicksByDate[date]) {
        clicksByDate[date] = { total: 0, unique: 0 };
      }
      clicksByDate[date].total += 1;
      if (click.isUnique) {
        clicksByDate[date].unique += 1;
      }
    });

    // Get device stats
    const deviceStats = await Click.aggregate([
      { $match: { url: url._id, createdAt: { $gte: startDate } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get browser stats
    const browserStats = await Click.aggregate([
      { $match: { url: url._id, createdAt: { $gte: startDate } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        url: {
          _id: url._id,
          title: url.title,
          shortCode: url.shortCode,
          customAlias: url.customAlias,
          totalClicks: url.clicks,
          uniqueClicks: url.uniqueClicks
        },
        period,
        clicksByDate,
        deviceStats,
        browserStats,
        totalClicks: clicks.length,
        uniqueClicks: clicks.filter(c => c.isUnique).length
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
});

module.exports = router; 