// API configuration
// Always use the direct Vercel URL for API calls to ensure they work
export const API_BASE_URL = window.location.hostname === 'thewhitejersey.com'
  ? 'https://thewhitejersey-rowing-checklist.vercel.app'
  : '';
