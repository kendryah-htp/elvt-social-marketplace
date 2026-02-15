// Subscription & Feature Unlock Utilities

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  AFFILIATE: 'affiliate',
  ADMIN: 'admin'
};

export const FEATURE_GATES = {
  CREATE_CUSTOM_PRODUCTS: 'create_custom_products',
  FULL_MILO_ACCESS: 'full_milo_access',
  ADMIN_DASHBOARD: 'admin_dashboard',
  WHITE_LABEL: 'white_label',
  CUSTOM_DOMAIN: 'custom_domain',
  ADVANCED_ANALYTICS: 'advanced_analytics'
};

/**
 * Determine user's subscription tier based on UserSubscription entity
 */
export const getUserSubscriptionTier = (userSubscription) => {
  if (!userSubscription) return SUBSCRIPTION_TIERS.FREE;
  
  if (userSubscription.subscription_type === 'admin_custom' || userSubscription.status === 'active') {
    return SUBSCRIPTION_TIERS.ADMIN;
  }
  
  return SUBSCRIPTION_TIERS.AFFILIATE;
};

/**
 * Check if user has access to a specific feature
 */
export const hasFeatureAccess = (userSubscription, userRole, feature) => {
  const tier = getUserSubscriptionTier(userSubscription);
  
  // Admins get all features
  if (userRole === 'admin') return true;
  
  // Free affiliates cannot create custom products
  if (tier === SUBSCRIPTION_TIERS.FREE) {
    if (feature === FEATURE_GATES.CREATE_CUSTOM_PRODUCTS) return false;
    if (feature === FEATURE_GATES.FULL_MILO_ACCESS) return false;
    if (feature === FEATURE_GATES.ADMIN_DASHBOARD) return false;
    return true; // Free users get basic affiliate features
  }
  
  // Paid affiliates get everything except admin-only features
  if (tier === SUBSCRIPTION_TIERS.AFFILIATE) {
    if (feature === FEATURE_GATES.ADMIN_DASHBOARD) return false;
    return true;
  }
  
  return false;
};

/**
 * Get feature lock message for display to user
 */
export const getFeatureLockMessage = (feature) => {
  const messages = {
    [FEATURE_GATES.CREATE_CUSTOM_PRODUCTS]: 'Create custom products by upgrading to an Admin plan',
    [FEATURE_GATES.FULL_MILO_ACCESS]: 'Unlock full MILO AI customization with an Admin plan',
    [FEATURE_GATES.ADMIN_DASHBOARD]: 'Launch your own platform to access the Admin Dashboard',
    [FEATURE_GATES.WHITE_LABEL]: 'White-label your platform with an Admin plan',
    [FEATURE_GATES.CUSTOM_DOMAIN]: 'Custom domains available with Admin plans',
    [FEATURE_GATES.ADVANCED_ANALYTICS]: 'Advanced analytics unlocked with Admin plans'
  };
  
  return messages[feature] || 'Upgrade your plan to unlock this feature';
};