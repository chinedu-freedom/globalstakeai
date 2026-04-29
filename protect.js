/**
 * protect.js — Page-level auth guard
 *
 * Because the session token is an httpOnly cookie, JavaScript cannot
 * read it directly. Instead we call a lightweight /api/users/me endpoint
 * that the server validates. If the request comes back as 401 / network
 * error, the user is not authenticated and we redirect them to login.
 *
 * Usage: add  <script src="./protect.js"></script>
 *        as the FIRST script in <head> on every protected page.
 */
(function () {
  const API_BASE = "https://stakewiseai-server.onrender.com";
  const LOGIN_PAGE = "/login.html";

  // Pages that are publicly accessible — no redirect needed.
  // Keep this list lowercase for reliable comparison.
  const PUBLIC_PATHS = [
    "/login.html",
    "/forgotpassword.html",
    "/resetpassword.html",
    "/otp.html",
  ];

  function currentPathIsPublic() {
    const path = window.location.pathname.toLowerCase();
    return PUBLIC_PATHS.some((p) => path.endsWith(p));
  }

  function redirectToLogin() {
    // Remember where the user wanted to go so we can send them back
    // after a successful login (login.html can read this).
    try {
      localStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search);
    } catch (_) {}
    window.location.replace(LOGIN_PAGE);
  }

  // If this page is public, do nothing at all.
  if (currentPathIsPublic()) return;

  // -------------------------------------------------------
  // Immediately hide the body so there's no flash of
  // protected content while the auth check is in flight.
  // -------------------------------------------------------
  var style = document.createElement("style");
  style.id = "__auth_guard_style";
  style.textContent = "body { visibility: hidden !important; }";
  document.head
    ? document.head.appendChild(style)
    : document.documentElement.appendChild(style);

  function removeBodyHide() {
    var el = document.getElementById("__auth_guard_style");
    if (el) el.parentNode.removeChild(el);
  }

  // -------------------------------------------------------
  // Check for token first; if missing, redirect immediately
  // -------------------------------------------------------
  const token = localStorage.getItem("token");
  if (!token) {
    return redirectToLogin();
  }

  // -------------------------------------------------------
  // Hit the server with the token attached (via interceptor).
  // -------------------------------------------------------
  fetch(API_BASE + "/api/users/me", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(function (res) {
      if (res.status === 401 || res.status === 403) {
        redirectToLogin();
      } else if (!res.ok) {
        // Other server error — still redirect to be safe
        redirectToLogin();
      } else {
        // Authenticated — reveal the page
        removeBodyHide();
      }
    })
    .catch(function () {
      // Network failure — could be offline or CORS; redirect to login
      redirectToLogin();
    });
})();
