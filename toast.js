(function() {
  // Inject Toast Styles
  if (!document.getElementById("pst-toast-styles")) {
    const style = document.createElement("style");
    style.id = "pst-toast-styles";
    style.textContent = `
      #toast-container {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 90%;
        max-width: 350px;
        pointer-events: none;
      }
      .pst-toast {
        background: white;
        color: #1e293b;
        padding: 12px 16px;
        border-radius: 16px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Poppins', sans-serif;
        font-size: 13px;
        font-weight: 500;
        border: 1px solid rgba(226, 232, 240, 0.8);
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        pointer-events: auto;
      }
      .pst-toast.show {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      .pst-toast.hide {
        opacity: 0;
        transform: translateY(-10px) scale(0.9);
      }
      .pst-toast-icon {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .pst-toast-success .pst-toast-icon { background: #ecfdf5; color: #10b981; }
      .pst-toast-error .pst-toast-icon { background: #fef2f2; color: #ef4444; }
      .pst-toast-info .pst-toast-icon { background: #eff6ff; color: #3b82f6; }
      .pst-toast-warning .pst-toast-icon { background: #fffbeb; color: #f59e0b; }
      
      .pst-toast-success { border-left: 4px solid #10b981; }
      .pst-toast-error { border-left: 4px solid #ef4444; }
      .pst-toast-info { border-left: 4px solid #3b82f6; }
      .pst-toast-warning { border-left: 4px solid #f59e0b; }
    `;
    document.head.appendChild(style);
  }

  /**
   * showToast - Displays a premium notification
   * @param {Object} options 
   * @param {string} options.message - The text to display
   * @param {string} options.type - success, error, info, warning
   * @param {number} options.duration - MS to show (default 3000)
   */
  window.showToast = function({ message, type = "info", duration = 3000 }) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `pst-toast pst-toast-${type}`;
    
    let iconClass = "fas fa-info-circle";
    if (type === "success") iconClass = "fas fa-check-circle";
    if (type === "error") iconClass = "fas fa-exclamation-circle";
    if (type === "warning") iconClass = "fas fa-exclamation-triangle";

    toast.innerHTML = `
      <div class="pst-toast-icon">
        <i class="${iconClass}"></i>
      </div>
      <div class="pst-toast-content">${message}</div>
    `;

    container.appendChild(toast);

    // Animation: Enter
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Animation: Exit
    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      }, 400);
    }, duration);
  };
})();
