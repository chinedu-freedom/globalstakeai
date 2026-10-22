/**
 * api-config.js - Centralized API Configuration for Blockvextrade
 *
 * Production Live URLs:
 * Site: https://blockvextrade.com
 * API:  https://api.blockvextrade.com
 */
(function () {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Live production API endpoint
  const LIVE_API = 'https://api.blockvextrade.com';

  // In local development, connect to live API by default.
  // To connect to a local server on port 5000: localStorage.setItem('USE_LOCAL_API', 'true')
  const useLocalOverride = isLocal && (localStorage.getItem('USE_LOCAL_API') === 'true');

  window.API_BASE = useLocalOverride
    ? 'http://localhost:5000'
    : LIVE_API;

  // Backward compatibility alias
  window.API = window.API_BASE;

  console.log(`🚀 [Blockvextrade] API Endpoint: ${window.API_BASE}`);
})();
