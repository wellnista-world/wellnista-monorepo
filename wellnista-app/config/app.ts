// App Configuration
// This file contains all app-wide configuration including branding, names, and metadata

export const appConfig = {
  // App Identity
  name: "NubSook",
  shortName: "NubSook", 
  displayName: "NubSook",
  
  // App Description
  description: "Your personal nutrition assistant",
  tagline: "Count Happiness",
  
  // App URLs and Links
  website: "https://app.wellnista.world",
  supportEmail: "tao.isaman@gmail.com",
  
  // App Colors (matching your theme)
  themeColor: "#9F9260",
  backgroundColor: "#ffffff",
  
  // App Features
  features: {
    nutritionTracking: true,
    healthMonitoring: true,
    menuRecommendation: true,
    barcodeScanning: true,
    mentalHealthTracking: true,
    bloodPressureTracking: true,
    bmiTracking: true,
  },
  
  // Social Links
  social: {
    line: "https://lin.ee/q4tHGv0",
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  },
  
  // App Metadata
  version: "1.0.0",
  author: "NubSook Team",
  copyright: "© 2024 NubSook. All rights reserved.",
  
  // Localization
  defaultLanguage: "th",
  supportedLanguages: ["th", "en", "zh", "ja", "ko", "id"],
  
  // PWA Configuration
  pwa: {
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    startUrl: "/",
  }
} as const;

// Helper functions for easy access
export const getAppName = () => appConfig.name;
export const getAppShortName = () => appConfig.shortName;
export const getAppDescription = () => appConfig.description;
export const getAppTagline = () => appConfig.tagline;
export const getAppThemeColor = () => appConfig.themeColor;
export const getAppBackgroundColor = () => appConfig.backgroundColor;

// Type exports for TypeScript
export type AppConfig = typeof appConfig;
