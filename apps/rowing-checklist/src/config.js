// API configuration
// Use the rowing app's direct URL for API calls to avoid proxy issues
export const API_BASE_URL = window.location.hostname === 'thewhitejersey.com'
  ? 'https://thewhitejersey-ika2.vercel.app'
  : '';
