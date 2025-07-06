const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  clicks: {
    type: Number,
    default: 0
  },
  uniqueClicks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Password protection
  isPasswordProtected: {
    type: Boolean,
    default: false
  },
  encryptedPassword: {
    type: String,
    default: null
  },
  // Link expiry
  expiresAt: {
    type: Date,
    default: null
  },
  // UTM parameters
  utmSource: {
    type: String,
    trim: true
  },
  utmMedium: {
    type: String,
    trim: true
  },
  utmCampaign: {
    type: String,
    trim: true
  },
  utmTerm: {
    type: String,
    trim: true
  },
  utmContent: {
    type: String,
    trim: true
  },
  // Analytics data
  analytics: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    ip: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'Unknown'
    },
    city: {
      type: String,
      default: 'Unknown'
    },
    userAgent: {
      type: String,
      required: true
    },
    browser: {
      type: String,
      default: 'Unknown'
    },
    device: {
      type: String,
      default: 'Unknown'
    },
    os: {
      type: String,
      default: 'Unknown'
    },
    referrer: {
      type: String,
      default: 'Direct'
    }
  }],
  // Malware protection
  isSuspicious: {
    type: Boolean,
    default: false
  },
  securityWarnings: [{
    type: String,
    enum: ['phishing', 'malware', 'suspicious_domain', 'http_redirect']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
urlSchema.index({ shortCode: 1 });
urlSchema.index({ customAlias: 1 });
urlSchema.index({ user: 1 });
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for automatic deletion
urlSchema.index({ createdAt: -1 });
urlSchema.index({ clicks: -1 });

// Virtual for short URL
urlSchema.virtual('shortUrl').get(function() {
  return `${process.env.BASE_URL || 'https://anfa.pro'}/${this.shortCode}`;
});

// Virtual for full URL with UTM parameters
urlSchema.virtual('fullUrl').get(function() {
  let url = this.originalUrl;
  const params = new URLSearchParams();
  
  if (this.utmSource) params.append('utm_source', this.utmSource);
  if (this.utmMedium) params.append('utm_medium', this.utmMedium);
  if (this.utmCampaign) params.append('utm_campaign', this.utmCampaign);
  if (this.utmTerm) params.append('utm_term', this.utmTerm);
  if (this.utmContent) params.append('utm_content', this.utmContent);
  
  const queryString = params.toString();
  if (queryString) {
    url += (url.includes('?') ? '&' : '?') + queryString;
  }
  
  return url;
});

// Pre-save middleware
urlSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if link is expired
urlSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return Date.now() > this.expiresAt.getTime();
};

// Method to add click analytics
urlSchema.methods.addClick = function(clickData) {
  this.clicks += 1;
  this.analytics.push(clickData);
  return this.save();
};

// Method to get analytics summary
urlSchema.methods.getAnalyticsSummary = function() {
  const analytics = this.analytics;
  
  // Country distribution
  const countries = {};
  analytics.forEach(click => {
    countries[click.country] = (countries[click.country] || 0) + 1;
  });
  
  // Device distribution
  const devices = {};
  analytics.forEach(click => {
    devices[click.device] = (devices[click.device] || 0) + 1;
  });
  
  // Browser distribution
  const browsers = {};
  analytics.forEach(click => {
    browsers[click.browser] = (browsers[click.browser] || 0) + 1;
  });
  
  // Daily clicks
  const dailyClicks = {};
  analytics.forEach(click => {
    const date = click.timestamp.toISOString().split('T')[0];
    dailyClicks[date] = (dailyClicks[date] || 0) + 1;
  });
  
  return {
    totalClicks: this.clicks,
    countries,
    devices,
    browsers,
    dailyClicks
  };
};

module.exports = mongoose.model('Url', urlSchema); 