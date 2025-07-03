const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  url: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  referrer: {
    type: String
  },
  country: {
    type: String
  },
  city: {
    type: String
  },
  region: {
    type: String
  },
  timezone: {
    type: String
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'unknown']
  },
  browser: {
    type: String
  },
  os: {
    type: String
  },
  isUnique: {
    type: Boolean,
    default: true
  },
  sessionId: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
clickSchema.index({ url: 1, createdAt: -1 });
clickSchema.index({ user: 1, createdAt: -1 });
clickSchema.index({ ipAddress: 1, url: 1 });
clickSchema.index({ createdAt: 1 });

// Method to check if click is unique for this IP and URL
clickSchema.statics.isUniqueClick = async function(urlId, ipAddress) {
  const existingClick = await this.findOne({
    url: urlId,
    ipAddress: ipAddress,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
  });
  
  return !existingClick;
};

module.exports = mongoose.model('Click', clickSchema); 