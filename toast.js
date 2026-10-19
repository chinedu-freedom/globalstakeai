(function() {
  // Inject Toast Styles matching Ravenearning (Sonner single-line format + richColors + responsive positioning)
  if (!document.getElementById("pst-toast-styles")) {
    const style = document.createElement("style");
    style.id = "pst-toast-styles";
    style.textContent = `
      #toast-container {
        position: fixed !important;
        top: 16px !important;
        left: 50% !important;
        right: auto !important;
        transform: translateX(-50%) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 10px !important;
        width: calc(100% - 24px) !important;
        max-width: 480px !important;
        pointer-events: none !important;
      }

      /* Desktop / Large Screens: Position in top-right corner */
      @media (min-width: 640px) {
        #toast-container {
          top: 24px !important;
          right: 24px !important;
          left: auto !important;
          transform: none !important;
          width: auto !important;
          min-width: 380px !important;
          max-width: 520px !important;
          align-items: flex-end !important;
        }
      }

      .pst-toast {
        border-radius: 8px !important;
        width: 100% !important;
        min-width: 320px !important;
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.12) !important;
        padding: 13px 20px !important;
        min-height: 48px !important;
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        pointer-events: auto !important;
        opacity: 0 !important;
        transform: translateY(-16px) scale(0.96) !important;
        transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1) !important;
        box-sizing: border-box !important;
      }

      @media (min-width: 640px) {
        .pst-toast {
          min-width: 360px !important;
          max-width: 500px !important;
          width: auto !important;
          transform: translateX(24px) scale(0.96) !important;
        }
      }

      .pst-toast.show {
        opacity: 1 !important;
        transform: translateY(0) scale(1) !important;
      }

      @media (min-width: 640px) {
        .pst-toast.show {
          opacity: 1 !important;
          transform: translateX(0) scale(1) !important;
        }
      }

      .pst-toast.hide {
        opacity: 0 !important;
        transform: translateY(-12px) scale(0.92) !important;
      }

      @media (min-width: 640px) {
        .pst-toast.hide {
          opacity: 0 !important;
          transform: translateX(20px) scale(0.92) !important;
        }
      }

      .pst-toast-content {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        font-size: 13.5px !important;
        font-weight: 500 !important;
        line-height: 1.4 !important;
        color: inherit !important;
        margin: 0 !important;
        padding: 0 !important;
        white-space: normal !important;
      }

      .pst-toast-icon {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
        width: 18px !important;
        height: 18px !important;
        color: inherit !important;
      }

      .pst-toast-icon svg {
        width: 18px !important;
        height: 18px !important;
        display: block !important;
      }

      /* ========================================================
         RICH COLORS (MATCHING RAVENEARNING)
         ======================================================== */
      /* Success Toast - Light mint green background with crisp green text & icon */
      .pst-toast-success {
        background: #eafbf1 !important;
        border: 1px solid #bbf7d0 !important;
        color: #15803d !important;
      }
      .pst-toast-success .pst-toast-icon {
        color: #16a34a !important;
      }

      /* Error Toast - Light red/rose background with crisp red text & icon */
      .pst-toast-error {
        background: #fef2f2 !important;
        border: 1px solid #fecaca !important;
        color: #b91c1c !important;
      }
      .pst-toast-error .pst-toast-icon {
        color: #dc2626 !important;
      }

      /* Info Toast - Light blue background with crisp blue text & icon */
      .pst-toast-info {
        background: #eff6ff !important;
        border: 1px solid #bfdbfe !important;
        color: #1d4ed8 !important;
      }
      .pst-toast-info .pst-toast-icon {
        color: #2563eb !important;
      }

      /* Warning Toast - Light amber background with crisp amber text & icon */
      .pst-toast-warning {
        background: #fefce8 !important;
        border: 1px solid #fef08a !important;
        color: #854d0e !important;
      }
      .pst-toast-warning .pst-toast-icon {
        color: #ca8a04 !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Pure SVG Icons for crisp, zero-dependency rendering (Sonner / Radix style)
  const ICONS = {
    success: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>`,
    error: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>`,
    info: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>`,
    warning: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>`
  };

  /**
   * window.pToast - Displays a notification matching Ravenearning's Sonner format
   * @param {Object} options 
   * @param {string} options.message - The text to display
   * @param {string} options.type - success, error, info, warning
   * @param {number} options.duration - MS to show (default 3000ms matching Ravenearning)
   */
  window.pToast = function({ message, type = "info", duration = 3000 }) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    // visibleToasts={1} behavior from Ravenearning:
    // Dismiss any existing toasts immediately with smooth exit transition
    const existingToasts = container.querySelectorAll(".pst-toast:not(.hide)");
    existingToasts.forEach((t) => {
      t.classList.add("hide");
      setTimeout(() => t.remove(), 250);
    });

    const toast = document.createElement("div");
    toast.className = `pst-toast pst-toast-${type}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");

    const svgIcon = ICONS[type] || ICONS.info;

    toast.innerHTML = `
      <div class="pst-toast-icon">
        ${svgIcon}
      </div>
      <div class="pst-toast-content">${message}</div>
    `;

    container.appendChild(toast);

    // Animation: Enter
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Animation: Exit after duration (default 3000ms)
    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      }, 280);
    }, duration);
  };

  // Helper alias
  window.showToast = function(msg, type = "success", duration = 3000) {
    window.pToast({ message: msg, type, duration });
  };
})();
