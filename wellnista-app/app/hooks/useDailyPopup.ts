import { useState, useEffect } from 'react';
import { isDailyPopupEnabled } from '../../config/featureFlags';

export const useDailyPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if popup should be shown today
    const checkDailyPopup = () => {
      // First check if the feature is enabled
      const isEnabled = isDailyPopupEnabled();
      console.log('🔍 Daily popup feature enabled:', isEnabled);
      
      if (!isEnabled) {
        console.log('❌ Daily popup feature is disabled, not showing popup');
        // Clear any existing popup state
        setShowPopup(false);
        return;
      }

      const lastPopupDate = localStorage.getItem('lastPopupDate');
      const today = new Date().toDateString();
      
      console.log('📅 Last popup date:', lastPopupDate, 'Today:', today);
      
      // Show popup if it hasn't been shown today
      if (lastPopupDate !== today) {
        console.log('✅ Showing daily popup');
        setShowPopup(true);
      } else {
        console.log('⏭️ Popup already shown today, not showing');
      }
    };

    // Check after a short delay to ensure the app is fully loaded
    const timer = setTimeout(checkDailyPopup, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    // Mark today as shown
    localStorage.setItem('lastPopupDate', new Date().toDateString());
  };

  const clearPopupHistory = () => {
    localStorage.removeItem('lastPopupDate');
    setShowPopup(false);
  };

  return {
    showPopup,
    closePopup,
    clearPopupHistory
  };
};
