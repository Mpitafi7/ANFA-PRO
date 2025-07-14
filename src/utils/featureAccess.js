// Feature Access Control System
export const PLANS = {
  BASIC: 'basic',
  PRO: 'pro', 
  TEAM: 'team'
};

export const FEATURES = {
  // Basic Features
  SMART_SHORTEN: 'smart_shorten',
  BASIC_ANALYTICS: 'basic_analytics',
  UTM_GENERATOR: 'utm_generator',
  QR_CODE: 'qr_code',
  
  // Pro Features
  ADVANCED_ANALYTICS: 'adv_analytics',
  PASSWORD_PROTECT: 'password_protect',
  EXPIRY_LINKS: 'expiry_links',
  TAGGING_SYSTEM: 'tagging_system',
  DOWNLOAD_REPORTS: 'download_reports',
  NO_ADS: 'no_ads',
  
  // Team Features
  MULTI_USER: 'multi_user',
  COMPANY_BRANDING: 'company_branding',
  ADMIN_PANEL: 'admin_panel',
  API_ACCESS: 'api_access'
};

// Feature Matrix - What each plan includes
const FEATURE_MATRIX = {
  [PLANS.BASIC]: [
    FEATURES.SMART_SHORTEN,
    FEATURES.BASIC_ANALYTICS,
    FEATURES.UTM_GENERATOR,
    FEATURES.QR_CODE
  ],
  [PLANS.PRO]: [
    FEATURES.SMART_SHORTEN,
    FEATURES.BASIC_ANALYTICS,
    FEATURES.UTM_GENERATOR,
    FEATURES.QR_CODE,
    FEATURES.ADVANCED_ANALYTICS,
    FEATURES.PASSWORD_PROTECT,
    FEATURES.EXPIRY_LINKS,
    FEATURES.TAGGING_SYSTEM,
    FEATURES.DOWNLOAD_REPORTS,
    FEATURES.NO_ADS
  ],
  [PLANS.TEAM]: [
    FEATURES.SMART_SHORTEN,
    FEATURES.BASIC_ANALYTICS,
    FEATURES.UTM_GENERATOR,
    FEATURES.QR_CODE,
    FEATURES.ADVANCED_ANALYTICS,
    FEATURES.PASSWORD_PROTECT,
    FEATURES.EXPIRY_LINKS,
    FEATURES.TAGGING_SYSTEM,
    FEATURES.DOWNLOAD_REPORTS,
    FEATURES.NO_ADS,
    FEATURES.MULTI_USER,
    FEATURES.COMPANY_BRANDING,
    FEATURES.ADMIN_PANEL,
    FEATURES.API_ACCESS
  ]
};

// Plan Details
export const PLAN_DETAILS = {
  [PLANS.BASIC]: {
    name: 'Basic',
    price: 'Free',
    features: [
      'Smart URL shortening',
      'Basic analytics (click count only)',
      'UTM Generator',
      'QR Code',
      '24hr limited access per tool',
      'Ads enabled'
    ],
    limitations: [
      'Limited to 10 links per day',
      'Basic analytics only',
      'Ads displayed',
      'No password protection',
      'No expiry dates'
    ]
  },
  [PLANS.PRO]: {
    name: 'Pro',
    price: '$2/month',
    features: [
      'All of Basic',
      'Ads removed',
      'Advanced analytics (geo, device, browser)',
      'Password-protected links',
      'Expiry/scheduled links',
      'Tagging system',
      'Downloadable reports'
    ],
    limitations: [
      'No multi-user access',
      'No API access',
      'No company branding'
    ]
  },
  [PLANS.TEAM]: {
    name: 'Team',
    price: '$10/month',
    features: [
      'All of Pro',
      'Multi-user access',
      'Company branding',
      'Admin panel access',
      'API Access'
    ],
    limitations: [
      'No limitations'
    ]
  }
};

// Main access control function
export const hasFeature = (userPlan, feature) => {
  if (!userPlan || !feature) return false;
  
  const availableFeatures = FEATURE_MATRIX[userPlan];
  return availableFeatures?.includes(feature) || false;
};

// Check if user can access multiple features
export const hasFeatures = (userPlan, features) => {
  if (!Array.isArray(features)) return hasFeature(userPlan, features);
  return features.every(feature => hasFeature(userPlan, feature));
};

// Get user's current plan details
export const getUserPlanDetails = (userPlan) => {
  return PLAN_DETAILS[userPlan] || PLAN_DETAILS[PLANS.BASIC];
};

// Get upgrade suggestion for feature
export const getUpgradeSuggestion = (feature) => {
  if (FEATURE_MATRIX[PLANS.PRO].includes(feature)) {
    return {
      plan: PLANS.PRO,
      message: `This feature is available in Pro plan. Upgrade now!`
    };
  }
  
  if (FEATURE_MATRIX[PLANS.TEAM].includes(feature)) {
    return {
      plan: PLANS.TEAM,
      message: `This feature is available in Team plan. Upgrade now!`
    };
  }
  
  return null;
};

// Get all available features for a plan
export const getPlanFeatures = (userPlan) => {
  return FEATURE_MATRIX[userPlan] || [];
};

// Check if user needs upgrade for feature
export const needsUpgrade = (userPlan, feature) => {
  return !hasFeature(userPlan, feature);
};

// Get minimum plan required for feature
export const getMinimumPlan = (feature) => {
  if (FEATURE_MATRIX[PLANS.BASIC].includes(feature)) return PLANS.BASIC;
  if (FEATURE_MATRIX[PLANS.PRO].includes(feature)) return PLANS.PRO;
  if (FEATURE_MATRIX[PLANS.TEAM].includes(feature)) return PLANS.TEAM;
  return null;
}; 