// AI Core System for ANFA PRO
// Optimized for performance and user experience

// Cache for AI responses to reduce API calls
const aiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// AI Configuration
const AI_CONFIG = {
  maxRetries: 3,
  timeout: 10000,
  temperature: 0.7,
  maxTokens: 150
};

// URL Analysis Patterns
const URL_PATTERNS = {
  social: /(facebook|twitter|instagram|linkedin|youtube|tiktok)/i,
  ecommerce: /(amazon|flipkart|daraz|shopify|ebay)/i,
  news: /(bbc|cnn|dawn|tribune|express)/i,
  tech: /(github|stackoverflow|medium|dev\.to)/i,
  long: /.{100,}/,
  short: /.{0,20}/
};

// Smart URL Analysis
export function analyzeURL(url) {
  const analysis = {
    type: 'general',
    length: url.length,
    domain: extractDomain(url),
    suggestions: [],
    risk: 'low',
    category: 'other'
  };

  // URL Type Detection
  if (URL_PATTERNS.social.test(url)) {
    analysis.type = 'social';
    analysis.category = 'social-media';
    analysis.suggestions.push('Perfect for social sharing! 📱');
  } else if (URL_PATTERNS.ecommerce.test(url)) {
    analysis.type = 'ecommerce';
    analysis.category = 'shopping';
    analysis.suggestions.push('Great for tracking sales! 🛒');
  } else if (URL_PATTERNS.news.test(url)) {
    analysis.type = 'news';
    analysis.category = 'media';
    analysis.suggestions.push('News links get high engagement! 📰');
  } else if (URL_PATTERNS.tech.test(url)) {
    analysis.type = 'tech';
    analysis.category = 'development';
    analysis.suggestions.push('Tech community loves short links! 💻');
  }

  // Length Analysis
  if (URL_PATTERNS.long.test(url)) {
    analysis.suggestions.push('This URL is quite long - perfect for shortening! ✂️');
    analysis.risk = 'medium';
  } else if (URL_PATTERNS.short.test(url)) {
    analysis.suggestions.push('Already quite short, but we can make it memorable! 🎯');
  }

  return analysis;
}

// Extract domain from URL
function extractDomain(url) {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return 'unknown';
  }
}

// Enhanced AI Response Generator
export async function InvokeLLM({ prompt, response_json_schema, context = {} }) {
  const cacheKey = `${prompt}_${JSON.stringify(context)}`;
  
  // Check cache first
  if (aiCache.has(cacheKey)) {
    const cached = aiCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  try {
    // Simulate AI API call with enhanced logic
    const response = await simulateAIResponse(prompt, context);
    
    // Cache the response
    aiCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    return response;
  } catch (error) {
    console.error('AI Error:', error);
    return generateFallbackResponse(prompt, context);
  }
}

// Smart AI Response Simulation
async function simulateAIResponse(prompt, context) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  const url = context.url || '';
  const analysis = analyzeURL(url);
  
  // Generate contextual response based on URL type
  const responses = {
    social: [
      "Your social media link is ready to go viral! 🚀",
      "Perfect for sharing on Instagram stories! 📸",
      "This will look great on your Twitter bio! 🐦"
    ],
    ecommerce: [
      "Track your sales with this powerful link! 💰",
      "Perfect for your product catalog! 🛍️",
      "Your customers will love this clean URL! ✨"
    ],
    news: [
      "News travels fast with short links! 📰",
      "Perfect for breaking news sharing! 🔥",
      "Journalists love clean URLs! 📝"
    ],
    tech: [
      "Developers appreciate clean links! 💻",
      "Perfect for GitHub README files! 🔧",
      "Stack Overflow approved! 🚀"
    ],
    general: [
      "Your link is now as clean as a Karachi morning! ☀️",
      "Shorter than a Lahore traffic signal! 🚦",
      "This URL is hotter than a Peshawar summer! 🔥",
      "Faster than a Karachi pizza delivery! 🍕",
      "Cleaner than a Multan sunset! 🌅"
    ]
  };

  const categoryResponses = responses[analysis.category] || responses.general;
  const message = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

  return {
    message,
    analysis,
    suggestions: analysis.suggestions,
    category: analysis.category
  };
}

// Fallback Response Generator
function generateFallbackResponse(prompt, context) {
  const fallbackMessages = [
    "Your link is ready to conquer the internet! 🌐",
    "Shorter than a chai break! ☕",
    "This URL is as clean as your code! 💻",
    "Perfect for sharing everywhere! 📱",
    "Your link is now internet famous! ⭐"
  ];

  return {
    message: fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)],
    analysis: analyzeURL(context.url || ''),
    suggestions: ["Try our premium features for more insights!"],
    category: 'general'
  };
}

// Smart URL Suggestions
export function generateSmartSuggestions(url, userHistory = []) {
  const analysis = analyzeURL(url);
  const suggestions = [];

  // Based on URL type
  if (analysis.type === 'social') {
    suggestions.push({
      type: 'feature',
      title: 'Social Media Tracking',
      description: 'Track clicks from different social platforms',
      icon: '📱'
    });
  }

  if (analysis.type === 'ecommerce') {
    suggestions.push({
      type: 'feature',
      title: 'Sales Analytics',
      description: 'Monitor conversion rates and sales',
      icon: '💰'
    });
  }

  // Based on user history
  if (userHistory.length > 5) {
    suggestions.push({
      type: 'tip',
      title: 'Power User',
      description: 'You\'re a link shortening pro!',
      icon: '🏆'
    });
  }

  return suggestions;
}

// Performance Monitoring
export function trackAIPerformance(operation, duration, success) {
  const metrics = {
    operation,
    duration,
    success,
    timestamp: Date.now()
  };

  // Store metrics for analysis
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem('ai_metrics') || '[]');
    existing.push(metrics);
    localStorage.setItem('ai_metrics', JSON.stringify(existing.slice(-100))); // Keep last 100
  }

  return metrics;
}

// Cache Management
export function clearAICache() {
  aiCache.clear();
}

export function getAICacheStats() {
  return {
    size: aiCache.size,
    entries: Array.from(aiCache.keys())
  };
} 