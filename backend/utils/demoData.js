const Url = require('../models/Url');
const User = require('../models/User');
const CryptoJS = require('crypto-js');

const createDemoData = async () => {
  try {
    // Check if demo data already exists
    const existingUrls = await Url.countDocuments();
    if (existingUrls > 0) {
      console.log('Demo data already exists, skipping...');
      return;
    }

    // Get first user (or create one if none exists)
    let user = await User.findOne();
    if (!user) {
      console.log('No users found, creating demo user...');
      user = await User.create({
        username: 'demo',
        email: 'demo@example.com',
        password: 'demo123',
        isVerified: true
      });
    }

    const secretKey = process.env.ENCRYPTION_KEY || 'your-secret-key';

    const demoUrls = [
      {
        originalUrl: 'https://www.google.com',
        shortCode: 'demo1',
        customAlias: 'google',
        user: user._id,
        title: 'Google Search',
        description: 'The world\'s most popular search engine',
        tags: ['search', 'google', 'demo'],
        clicks: 150,
        uniqueClicks: 120,
        isActive: true,
        isPasswordProtected: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        utmSource: 'demo',
        utmMedium: 'organic',
        utmCampaign: 'demo-campaign',
        analytics: [
          {
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            ip: '192.168.1.1',
            country: 'United States',
            city: 'New York',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            browser: 'Chrome',
            device: 'desktop',
            os: 'Windows',
            referrer: 'Direct'
          },
          {
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            ip: '192.168.1.2',
            country: 'Canada',
            city: 'Toronto',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
            browser: 'Safari',
            device: 'mobile',
            os: 'iOS',
            referrer: 'Google'
          }
        ]
      },
      {
        originalUrl: 'https://github.com',
        shortCode: 'demo2',
        customAlias: 'github',
        user: user._id,
        title: 'GitHub',
        description: 'Where the world builds software',
        tags: ['development', 'github', 'code'],
        clicks: 89,
        uniqueClicks: 75,
        isActive: true,
        isPasswordProtected: true,
        encryptedPassword: CryptoJS.AES.encrypt('demo123', secretKey).toString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        utmSource: 'social',
        utmMedium: 'social',
        utmCampaign: 'github-promo',
        analytics: [
          {
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            ip: '192.168.1.3',
            country: 'United Kingdom',
            city: 'London',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            browser: 'Firefox',
            device: 'desktop',
            os: 'macOS',
            referrer: 'Twitter'
          }
        ]
      },
      {
        originalUrl: 'https://stackoverflow.com',
        shortCode: 'demo3',
        user: user._id,
        title: 'Stack Overflow',
        description: 'Where developers learn, share, & build careers',
        tags: ['programming', 'q&a', 'community'],
        clicks: 234,
        uniqueClicks: 198,
        isActive: true,
        isPasswordProtected: false,
        expiresAt: null, // No expiry
        utmSource: 'email',
        utmMedium: 'email',
        utmCampaign: 'newsletter',
        utmContent: 'banner',
        analytics: [
          {
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            ip: '192.168.1.4',
            country: 'Germany',
            city: 'Berlin',
            userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)',
            browser: 'Chrome',
            device: 'mobile',
            os: 'Android',
            referrer: 'Email'
          },
          {
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            ip: '192.168.1.5',
            country: 'Australia',
            city: 'Sydney',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            browser: 'Edge',
            device: 'desktop',
            os: 'Windows',
            referrer: 'Direct'
          }
        ]
      },
      {
        originalUrl: 'https://www.youtube.com',
        shortCode: 'demo4',
        customAlias: 'youtube',
        user: user._id,
        title: 'YouTube',
        description: 'Share and discover the best videos',
        tags: ['video', 'entertainment', 'social'],
        clicks: 567,
        uniqueClicks: 432,
        isActive: true,
        isPasswordProtected: false,
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
        utmSource: 'social',
        utmMedium: 'social',
        utmCampaign: 'video-share',
        utmTerm: 'tutorial',
        analytics: [
          {
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            ip: '192.168.1.6',
            country: 'India',
            city: 'Mumbai',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
            browser: 'Safari',
            device: 'mobile',
            os: 'iOS',
            referrer: 'Instagram'
          },
          {
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            ip: '192.168.1.7',
            country: 'Brazil',
            city: 'São Paulo',
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            browser: 'Chrome',
            device: 'desktop',
            os: 'Linux',
            referrer: 'Facebook'
          }
        ]
      },
      {
        originalUrl: 'https://www.linkedin.com',
        shortCode: 'demo5',
        user: user._id,
        title: 'LinkedIn',
        description: 'Professional networking platform',
        tags: ['professional', 'networking', 'career'],
        clicks: 123,
        uniqueClicks: 98,
        isActive: true,
        isPasswordProtected: true,
        encryptedPassword: CryptoJS.AES.encrypt('linkedin123', secretKey).toString(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        utmSource: 'linkedin',
        utmMedium: 'social',
        utmCampaign: 'professional-network',
        analytics: [
          {
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            ip: '192.168.1.8',
            country: 'France',
            city: 'Paris',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            browser: 'Safari',
            device: 'desktop',
            os: 'macOS',
            referrer: 'LinkedIn'
          }
        ]
      }
    ];

    // Create demo URLs
    for (const urlData of demoUrls) {
      await Url.create(urlData);
    }

    console.log(`Created ${demoUrls.length} demo URLs`);
  } catch (error) {
    console.error('Error creating demo data:', error);
  }
};

module.exports = { createDemoData }; 