(function() {
    // 1. Inject Styles Immediately
    const css = `
        #global-loader-overlay {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
            visibility: visible;
            opacity: 1;
        }
        #global-loader-overlay.fade-out {
            opacity: 0;
            visibility: hidden;
        }
        .pst-loader-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f1f5f9;
            border-top: 5px solid #4f8cff;
            border-radius: 50%;
            animation: pst-spin 0.8s linear infinite;
            box-shadow: 0 0 15px rgba(79, 140, 255, 0.1);
        }
        @keyframes pst-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        body.loader-locked {
            overflow: hidden !important;
        }
    `;

    // Ensure head exists before appending style
    const styleInject = () => {
        if (document.head) {
            const style = document.createElement('style');
            style.id = 'pst-loader-styles';
            style.textContent = css;
            document.head.appendChild(style);

            // Inject favicon
            if (!document.querySelector('link[rel="icon"]')) {
                const favicon = document.createElement('link');
                favicon.rel = 'icon';
                favicon.type = 'image/x-icon';
                favicon.href = './images/favicon.ico';
                document.head.appendChild(favicon);
            }
        } else {
            setTimeout(styleInject, 10);
        }
    };
    styleInject();

    // 2. Create Loader Structure
    const loader = document.createElement('div');
    loader.id = 'global-loader-overlay';
    loader.innerHTML = '<div class="pst-loader-spinner"></div>';

    // 3. Inject Loader into Body
    const injectLoader = () => {
        if (document.body) {
            // Prevent duplicate injection
            if (!document.getElementById('global-loader-overlay')) {
                document.body.appendChild(loader);
                document.body.classList.add('loader-locked');
            }
        } else {
            // Check again on next frame
            requestAnimationFrame(injectLoader);
        }
    };
    injectLoader();

    // 4. Global Control Functions
    window.showLoader = function() {
        loader.classList.remove('fade-out');
        if (document.body) document.body.classList.add('loader-locked');
    };

    window.hideLoader = function() {
        loader.classList.add('fade-out');
        if (document.body) document.body.classList.remove('loader-locked');
    };

    // 5. Auto-hide on window load
    // We use 'load' instead of 'DOMContentLoaded' to ensure 
    // all images and sub-resources (like fonts/API data) are visually ready.
    window.addEventListener('load', function() {
        // Add a slight delay so the transition feels premium and not jerky
        setTimeout(window.hideLoader, 400);
    });

    // Fallback: If for some reason the load event takes too long (> 10 seconds), hide it
    setTimeout(() => {
        if (!loader.classList.contains('fade-out')) {
            window.hideLoader();
        }
    }, 10000);

    // 6. Global Fetch Interceptor for Token Auth
    const originalFetch = window.fetch;
    window.fetch = async function() {
        let [resource, config] = arguments;
        
        // Only intercept requests to the backend API
        if (typeof resource === 'string' && resource.includes('satrixai-server.onrender.com')) {
            const token = localStorage.getItem('token');
            
            config = config || {};
            
            // If token exists, inject Authorization header
            if (token) {
                config.headers = config.headers || {};
                
                // If headers is a Headers object
                if (config.headers instanceof Headers) {
                    if (!config.headers.has('Authorization')) {
                        config.headers.append('Authorization', 'Bearer ' + token);
                    }
                } else {
                    // Plain object
                    if (!config.headers['Authorization'] && !config.headers['authorization']) {
                        config.headers['Authorization'] = 'Bearer ' + token;
                    }
                }
            }
            
            // Remove legacy cookie-based auth directive to prevent CORS errors
            if (config.credentials === 'include') {
                delete config.credentials;
            }
            
            // Put modified config back into arguments
            arguments[1] = config;
        }
        
        return originalFetch.apply(this, arguments);
    };

})();
