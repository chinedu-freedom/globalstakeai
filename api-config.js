/**
 * api-config.js - Centralized API Configuration for Blockvextrade
 *
 * Automatically detects whether you are developing locally or in production.
 * You can toggle USE_LOCAL_BACKEND between true (local backend on port 5000)
 * and false (live remote backend).
 */
(function () {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Set to true to route to local stakewiseai-server (http://localhost:5000)
  // Set to false to route to the live production server (https://stakewiseai-server.onrender.com)
  const USE_LOCAL_BACKEND = true;

  window.API_BASE = (isLocal && USE_LOCAL_BACKEND)
    ? 'http://localhost:5000'
    : 'https://stakewiseai-server.onrender.com';

  // Backward compatibility alias
  window.API = window.API_BASE;

  console.log(`🚀 [Blockvextrade] API Endpoint: ${window.API_BASE}`);
})();
