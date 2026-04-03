import { authFetch } from "./auth.js";

async function loadPartial(url, selector) {
  try {
    const res = await authFetch(url);
    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.text();
    const container = document.querySelector(selector);
    if (!container) return;

    container.innerHTML = data;

    container.querySelectorAll("script").forEach((oldScript) => {
      const newScript = document.createElement("script");

      if (oldScript.src) newScript.src = oldScript.src;
      else newScript.textContent = oldScript.textContent;

      // preserve type (important for ES modules)
      if (oldScript.type) newScript.type = oldScript.type;

      // preserve other attributes if needed
      if (oldScript.async) newScript.async = true;
      if (oldScript.defer) newScript.defer = true;

      document.body.appendChild(newScript);
    });
  } catch (err) {
    console.error(`Error loading ${url}:`, err);

    // remember where the user wanted to go
    localStorage.setItem("redirectAfterLogin", window.location.pathname);

    window.location.href = "/login.html";
  }
}

export async function protectPage() {
  await Promise.all([
    loadPartial("header.html", "#header"),
    loadPartial("footer.html", "#footer"),
  ]);
}
