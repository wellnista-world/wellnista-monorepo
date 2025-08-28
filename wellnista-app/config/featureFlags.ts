// Feature Flags Configuration
// This file controls which features are enabled/disabled in the app

export interface FeatureFlags {
  // Daily popup feature
  dailyPopup: {
    enabled: boolean;
    // Additional popup-specific settings
    showOnFirstVisit: boolean;
    showOnSubsequentVisits: boolean;
    // Custom popup content (optional)
    customImage?: string;
    customTitle?: string;
    customMessage?: string;
  };
  
  // BMI tracking feature
  bmiTracking: {
    enabled: boolean;
    showCharts: boolean;
    allowEdit: boolean;
  };
  
  // Menu recommendation feature
  menuRecommendation: {
    enabled: boolean;
    useOpenAI: boolean;
    showHealthInfo: boolean;
  };
  
  // Blood sugar tracking feature
  bloodSugarTracking: {
    enabled: boolean;
    showGraphs: boolean;
    allowEdit: boolean;
  };
  
  // Advertising features
  advertising: {
    enabled: boolean;
    showCarousel: boolean;
    showPromotions: boolean;
  };
  
  // Market features
  market: {
    enabled: boolean;
    showProducts: boolean;
    allowPurchase: boolean;
  };
  
  // Profile features
  profile: {
    enabled: boolean;
    allowEdit: boolean;
    showHealthStats: boolean;
  };
  
  // Scanning features
  scanning: {
    enabled: boolean;
    allowBarcode: boolean;
    allowPhoto: boolean;
  };
}

// Default feature flags configuration
export const defaultFeatureFlags: FeatureFlags = {
  dailyPopup: {
    enabled: false,
    showOnFirstVisit: false,
    showOnSubsequentVisits: false,
  },
  
  bmiTracking: {
    enabled: true,
    showCharts: true,
    allowEdit: true,
  },
  
  menuRecommendation: {
    enabled: true,
    useOpenAI: true,
    showHealthInfo: true,
  },
  
  bloodSugarTracking: {
    enabled: true,
    showGraphs: true,
    allowEdit: true,
  },
  
  advertising: {
    enabled: true,
    showCarousel: true,
    showPromotions: true,
  },
  
  market: {
    enabled: true,
    showProducts: true,
    allowPurchase: true,
  },
  
  profile: {
    enabled: true,
    allowEdit: true,
    showHealthStats: true,
  },
  
  scanning: {
    enabled: true,
    allowBarcode: true,
    allowPhoto: true,
  },
};

// Get feature flags (simplified - no environment variables)
export const getFeatureFlags = (): FeatureFlags => {
  return defaultFeatureFlags;
};

// Helper functions to check specific features
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  const flags = getFeatureFlags();
  return flags[feature]?.enabled ?? false;
};

export const isDailyPopupEnabled = (): boolean => {
  const result = isFeatureEnabled('dailyPopup');
  console.log('🎯 isDailyPopupEnabled called, result:', result);
  return result;
};

export const isBmiTrackingEnabled = (): boolean => {
  return isFeatureEnabled('bmiTracking');
};

export const isMenuRecommendationEnabled = (): boolean => {
  return isFeatureEnabled('menuRecommendation');
};

export const isBloodSugarTrackingEnabled = (): boolean => {
  return isFeatureEnabled('bloodSugarTracking');
};

export const isAdvertisingEnabled = (): boolean => {
  return isFeatureEnabled('advertising');
};

export const isMarketEnabled = (): boolean => {
  return isFeatureEnabled('market');
};

export const isProfileEnabled = (): boolean => {
  return isFeatureEnabled('profile');
};

export const isScanningEnabled = (): boolean => {
  return isFeatureEnabled('scanning');
};
