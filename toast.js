export function showToast({ icon, message, type = "info", duration = 3000 }) {
  let container = document.getElementById("toast-container");
  
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.setAttribute("aria-live", "polite");
    container.className = `
      fixed top-5 z-[9999] space-y-3
      left-1/2 -translate-x-1/2 w-[90%] max-w-xs
      sm:left-auto sm:right-5 sm:translate-x-0
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast flex items-center p-4 rounded-lg shadow-lg text-white w-full
    ${type === "success" ? "bg-green-500" : ""}
    ${type === "error" ? "bg-red-500" : ""}
    ${type === "warning" ? "bg-yellow-500 text-gray-900" : ""}
    ${type === "info" ? "bg-blue-500" : ""}
  `;

  toast.innerHTML = `<i class="${icon} mr-2"></i><span>${message}</span>`;
  container.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add("show"), 50);

  // Animate out
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 400);
  }, duration);
}
