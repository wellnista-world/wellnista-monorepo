# Configuration Files

This directory contains configuration files for the NubSook app.

## Feature Flags (`featureFlags.ts`)

The feature flags system allows you to enable/disable specific features of the app without deploying new code.

### Usage

```typescript
import { isDailyPopupEnabled, isBmiTrackingEnabled } from '../config/featureFlags';

// Check if a feature is enabled
if (isDailyPopupEnabled()) {
  // Show daily popup
}

if (isBmiTrackingEnabled()) {
  // Show BMI tracking features
}
```

### Available Features

#### Daily Popup
- **Flag**: `dailyPopup.enabled`
- **Helper**: `isDailyPopupEnabled()`
- **Description**: Controls the daily welcome popup that appears on first visit of the day

#### BMI Tracking
- **Flag**: `bmiTracking.enabled`
- **Helper**: `isBmiTrackingEnabled()`
- **Description**: Controls the BMI tracking feature and related charts

#### Menu Recommendation
- **Flag**: `menuRecommendation.enabled`
- **Helper**: `isMenuRecommendationEnabled()`
- **Description**: Controls the AI-powered menu recommendation feature

#### Blood Sugar Tracking
- **Flag**: `bloodSugarTracking.enabled`
- **Helper**: `isBloodSugarTrackingEnabled()`
- **Description**: Controls the blood sugar tracking feature and graphs

#### Advertising
- **Flag**: `advertising.enabled`
- **Helper**: `isAdvertisingEnabled()`
- **Description**: Controls advertising carousel and promotions

#### Market
- **Flag**: `market.enabled`
- **Helper**: `isMarketEnabled()`
- **Description**: Controls the NubSook Market features

#### Profile
- **Flag**: `profile.enabled`
- **Helper**: `isProfileEnabled()`
- **Description**: Controls profile editing and health stats display

#### Scanning
- **Flag**: `scanning.enabled`
- **Helper**: `isScanningEnabled()`
- **Description**: Controls barcode and photo scanning features

### Environment Variables

You can control feature flags using environment variables:

```bash
# Disable daily popup in production
NEXT_PUBLIC_ENABLE_DAILY_POPUP=false

# Enable all features (default)
NEXT_PUBLIC_ENABLE_DAILY_POPUP=true
```

### Environment-Specific Behavior

- **Development**: All features enabled by default
- **Production**: Features can be controlled via environment variables
- **Test**: Daily popup disabled by default

### Adding New Features

To add a new feature flag:

1. Add the feature to the `FeatureFlags` interface
2. Add default values to `defaultFeatureFlags`
3. Add environment-specific overrides in `getFeatureFlags()`
4. Create a helper function for easy checking
5. Use the helper function in your components

Example:

```typescript
// 1. Add to interface
export interface FeatureFlags {
  newFeature: {
    enabled: boolean;
    // additional settings
  };
}

// 2. Add to default flags
export const defaultFeatureFlags: FeatureFlags = {
  newFeature: {
    enabled: true,
  },
};

// 3. Add helper function
export const isNewFeatureEnabled = (): boolean => {
  return isFeatureEnabled('newFeature');
};

// 4. Use in component
if (isNewFeatureEnabled()) {
  // Show new feature
}
```

### Best Practices

1. **Always check feature flags** before rendering feature-specific components
2. **Use helper functions** instead of directly accessing the flags object
3. **Test with flags disabled** to ensure graceful degradation
4. **Document new features** in this README
5. **Use environment variables** for production control

### Testing

```typescript
// Test with feature disabled
jest.mock('../config/featureFlags', () => ({
  isDailyPopupEnabled: () => false,
}));

// Test with feature enabled
jest.mock('../config/featureFlags', () => ({
  isDailyPopupEnabled: () => true,
}));
``` 