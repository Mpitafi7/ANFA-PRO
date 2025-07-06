const rateLimit = require('express-rate-limit');
const UAParser = require('ua-parser-js');

// Rate limiting for different endpoints
const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 URL creations per windowMs
  message: 'Too many URL creation attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const redirectLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 redirects per windowMs
  message: 'Too many redirect attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Malware protection middleware
const malwareProtection = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/') {
    const { originalUrl } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

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
      /tinyurl\.com/i,
      /goo\.gl/i,
      /t\.co/i
    ];
    
    const securityWarnings = [];
    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(originalUrl)) {
        securityWarnings.push('suspicious_domain');
      }
    });

    // Check for phishing patterns
    const phishingPatterns = [
      /paypal.*verify/i,
      /bank.*verify/i,
      /security.*update/i,
      /account.*suspended/i,
      /password.*expired/i
    ];

    phishingPatterns.forEach(pattern => {
      if (pattern.test(originalUrl)) {
        securityWarnings.push('phishing');
      }
    });

    // Check for HTTP URLs (should be HTTPS)
    if (originalUrl.startsWith('http://') && !originalUrl.includes('localhost')) {
      securityWarnings.push('http_redirect');
    }

    if (securityWarnings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This URL has been flagged as potentially suspicious',
        suspicious: true,
        warnings: securityWarnings
      });
    }
  }
  next();
};

// User agent parsing middleware
const parseUserAgent = (req, res, next) => {
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const parser = new UAParser(userAgent);
  const ua = parser.getResult();
  
  req.userAgent = {
    browser: ua.browser.name || 'Unknown',
    browserVersion: ua.browser.version || 'Unknown',
    os: ua.os.name || 'Unknown',
    osVersion: ua.os.version || 'Unknown',
    device: ua.device.type || 'desktop',
    deviceModel: ua.device.model || 'Unknown',
    deviceVendor: ua.device.vendor || 'Unknown',
    cpu: ua.cpu.architecture || 'Unknown',
    engine: ua.engine.name || 'Unknown',
    engineVersion: ua.engine.version || 'Unknown'
  };
  
  next();
};

// IP geolocation middleware
const getLocationInfo = async (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  try {
    const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
    const geoData = await geoResponse.json();
    
    req.location = {
      ip,
      country: geoData.country || 'Unknown',
      countryCode: geoData.countryCode || 'Unknown',
      region: geoData.regionName || 'Unknown',
      city: geoData.city || 'Unknown',
      timezone: geoData.timezone || 'Unknown',
      isp: geoData.isp || 'Unknown',
      org: geoData.org || 'Unknown'
    };
  } catch (error) {
    console.error('Geolocation error:', error);
    req.location = {
      ip,
      country: 'Unknown',
      countryCode: 'Unknown',
      region: 'Unknown',
      city: 'Unknown',
      timezone: 'Unknown',
      isp: 'Unknown',
      org: 'Unknown'
    };
  }
  
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
  
  next();
};

module.exports = {
  createUrlLimiter,
  redirectLimiter,
  authLimiter,
  malwareProtection,
  parseUserAgent,
  getLocationInfo,
  requestLogger,
  securityHeaders
}; 