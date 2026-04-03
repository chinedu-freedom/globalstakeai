// Auth-aware fetch wrapper
export async function authFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include", // include cookies (httpOnly session)
    });

    if (res.status === 401) {
      // Save current page before redirecting
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/login.html";
      return null;
    }

    return res;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

// Optional helper: check auth status on page load
export async function checkAuth() {
  try {
    const res = await authFetch("https://neo-invest-server.onrender.com/api/users/me");

    if (!res || !res.ok) {
      // authFetch already redirected, but just in case:
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/login.html";
      return null;
    }

    return res.json();
  } catch (err) {
    console.error("Auth check failed:", err);
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = "/login.html";
    return null;
  }
}
