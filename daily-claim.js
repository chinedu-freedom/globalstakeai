/**
 * daily-claim.js - Daily Claim Feature ($0.50 Everyday)
 * Blockvextrade / Globalstake AI
 */

(function () {
  'use strict';

  // --- Confetti Engine ---
  class ConfettiEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.running = false;
      this.animationId = null;
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    launch(count = 140) {
      this.resize();
      this.canvas.style.display = 'block';
      this.particles = [];
      const colors = ['#00ff00', '#22c55e', '#ffffff', '#eab308', '#10b981', '#a3e635'];

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: -20 - Math.random() * 200,
          size: Math.random() * 9 + 4,
          speedY: Math.random() * 4 + 2.5,
          speedX: (Math.random() - 0.5) * 5,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 12,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: Math.random() > 0.4 ? 'rect' : 'circle',
        });
      }

      this.running = true;
      if (this.animationId) cancelAnimationFrame(this.animationId);
      this.animate();
    }

    animate() {
      if (!this.running) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let active = 0;

      this.particles.forEach((p) => {
        if (p.y < this.canvas.height + 40) {
          active++;
          p.y += p.speedY;
          p.x += p.speedX;
          p.rotation += p.rotSpeed;
          p.speedY += 0.12; // gravity

          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
          }
          this.ctx.restore();
        }
      });

      if (active > 0) {
        this.animationId = requestAnimationFrame(() => this.animate());
      } else {
        this.running = false;
        this.canvas.style.display = 'none';
      }
    }
  }

  // --- State ---
  let confetti = null;
  let claimState = null;
  let countdownInterval = null;
  let isClaiming = false;

  // --- API Base Helper ---
  function getApiBase() {
    return window.API_BASE || window.API || 'http://localhost:5000';
  }

  function getToken() {
    let t = localStorage.getItem('token');
    if (!t) return null;
    return t.trim().replace(/^['"]+|['"]+$/g, '').replace(/^Bearer\s+/i, '');
  }

  // --- Create HTML Structure ---
  function injectDOMElements() {
    // 1. Confetti Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'dailyConfettiCanvas';
    canvas.className = 'daily-confetti-canvas';
    document.body.appendChild(canvas);
    confetti = new ConfettiEngine(canvas);

    window.addEventListener('resize', () => {
      if (confetti && confetti.running) confetti.resize();
    });

    // 2. Floating Claim Button
    const floatingBtn = document.createElement('div');
    floatingBtn.id = 'dailyClaimFloatingBtn';
    floatingBtn.className = 'daily-claim-floating-btn';
    floatingBtn.style.display = 'none'; // revealed once state is loaded
    floatingBtn.innerHTML = `
      <div class="daily-claim-floating-icon">
        <i class="fa-solid fa-gift"></i>
        <div id="dailyClaimFloatingBadge" class="daily-claim-floating-badge" style="display:none;"></div>
      </div>
      <div class="daily-claim-floating-text">
        <span>Daily Gift</span>
        <div class="daily-claim-floating-sub">+$0.50 USD</div>
      </div>
    `;
    floatingBtn.addEventListener('click', openModal);
    document.body.appendChild(floatingBtn);

    // 3. Main Modal Backdrop & Dialog
    const backdrop = document.createElement('div');
    backdrop.id = 'dailyClaimBackdrop';
    backdrop.className = 'daily-claim-backdrop';
    backdrop.innerHTML = `
      <div class="daily-claim-modal">
        <button type="button" id="dailyClaimCloseBtn" class="daily-claim-close-btn" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="daily-claim-header">
          <div class="daily-claim-gift-icon-wrap">
            <i class="fa-solid fa-gift"></i>
          </div>
          <h2 class="daily-claim-title">Daily Check-in Rewards</h2>
          <p class="daily-claim-subtitle">
            Claim <strong style="color:#00ff00;">$0.50 free bonus</strong> every day! Check in consecutive days to keep your earning streak active.
          </p>
        </div>

        <!-- 7 Days Grid -->
        <div id="dailyClaimGridTop" class="daily-claim-grid-top"></div>
        <div id="dailyClaimGridBottom" class="daily-claim-grid-bottom"></div>

        <!-- Dynamic Action / Countdown Container -->
        <div id="dailyClaimActionArea">
          <div class="daily-claim-countdown-box">
            <div class="daily-claim-countdown-label">Loading status...</div>
          </div>
        </div>
      </div>
    `;

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    document.body.appendChild(backdrop);

    const closeBtn = document.getElementById('dailyClaimCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // 4. Celebration Modal Backdrop & Dialog
    const celebrationBackdrop = document.createElement('div');
    celebrationBackdrop.id = 'dailyCelebrationBackdrop';
    celebrationBackdrop.className = 'daily-celebration-backdrop';
    celebrationBackdrop.innerHTML = `
      <div class="daily-celebration-modal">
        <div class="daily-celebration-badge">Bonus Credited</div>
        <div class="daily-celebration-amount">+$0.50</div>
        <h3 class="daily-celebration-title">🎉 Congratulations!</h3>
        <p class="daily-celebration-desc">
          Your daily check-in bonus of $0.50 USD has been credited directly to your account balance.
        </p>
        <button type="button" id="dailyCelebrationDismissBtn" class="daily-celebration-dismiss-btn">
          GREAT, THANKS!
        </button>
      </div>
    `;

    celebrationBackdrop.addEventListener('click', (e) => {
      if (e.target === celebrationBackdrop) closeCelebration();
    });

    document.body.appendChild(celebrationBackdrop);

    const dismissBtn = document.getElementById('dailyCelebrationDismissBtn');
    if (dismissBtn) dismissBtn.addEventListener('click', closeCelebration);
  }

  // --- Modal Open/Close Controls ---
  function openModal() {
    const backdrop = document.getElementById('dailyClaimBackdrop');
    if (backdrop) {
      backdrop.classList.add('active');
      fetchStatus(); // refresh status on open
    }
  }

  function closeModal() {
    const backdrop = document.getElementById('dailyClaimBackdrop');
    if (backdrop) backdrop.classList.remove('active');
  }

  function openCelebration(amount = 0.5) {
    const backdrop = document.getElementById('dailyCelebrationBackdrop');
    if (backdrop) {
      const amtEl = backdrop.querySelector('.daily-celebration-amount');
      if (amtEl) amtEl.textContent = `+$${Number(amount).toFixed(2)}`;
      backdrop.classList.add('active');
    }
  }

  function closeCelebration() {
    const backdrop = document.getElementById('dailyCelebrationBackdrop');
    if (backdrop) backdrop.classList.remove('active');
  }

  // --- Render Days Grid ---
  function renderGrid(rewards, currentStreak, claimedToday, nextClaimDay) {
    const gridTop = document.getElementById('dailyClaimGridTop');
    const gridBottom = document.getElementById('dailyClaimGridBottom');
    if (!gridTop || !gridBottom) return;

    gridTop.innerHTML = '';
    gridBottom.innerHTML = '';

    rewards.forEach((reward, index) => {
      const isClaimed = reward.status === 'claimed';
      const isAvailable = reward.status === 'available' || (!claimedToday && reward.day === nextClaimDay);
      const isLocked = !isClaimed && !isAvailable;

      const card = document.createElement('div');
      card.className = `daily-day-card ${isClaimed ? 'claimed' : ''} ${isAvailable ? 'available' : ''} ${isLocked ? 'locked' : ''}`;

      let iconHtml = '<i class="fa-solid fa-lock"></i>';
      if (isClaimed) {
        iconHtml = '<i class="fa-solid fa-check"></i>';
      } else if (isAvailable) {
        iconHtml = '<i class="fa-solid fa-coins"></i>';
      }

      card.innerHTML = `
        <span class="daily-day-label">Day ${reward.day}</span>
        <div class="daily-day-icon-circle">
          ${iconHtml}
        </div>
        <span class="daily-day-amount">+$${Number(reward.amount || 0.5).toFixed(2)}</span>
      `;

      if (index < 4) {
        gridTop.appendChild(card);
      } else {
        gridBottom.appendChild(card);
      }
    });
  }

  // --- Render Action Area (Claim Button or Countdown) ---
  function renderActionArea(data) {
    const container = document.getElementById('dailyClaimActionArea');
    if (!container) return;

    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    if (!data.claimedToday) {
      // Claim Button Available
      const dayNum = data.nextClaimDay || 1;
      container.innerHTML = `
        <button type="button" id="dailyClaimNowBtn" class="daily-claim-action-btn">
          <i class="fa-solid fa-gift"></i>
          <span>Claim Day ${dayNum} (+$0.50 USD)</span>
        </button>
      `;

      const btn = document.getElementById('dailyClaimNowBtn');
      if (btn) {
        btn.addEventListener('click', handleClaim);
      }

      // Show floating badge
      const badge = document.getElementById('dailyClaimFloatingBadge');
      if (badge) badge.style.display = 'block';
    } else {
      // Claimed Today -> Show Countdown to Midnight
      container.innerHTML = `
        <div class="daily-claim-countdown-box">
          <div class="daily-claim-countdown-label">Next Claim Available In</div>
          <div id="dailyCountdownValue" class="daily-claim-countdown-val">--:--:--</div>
        </div>
      `;

      const badge = document.getElementById('dailyClaimFloatingBadge');
      if (badge) badge.style.display = 'none';

      startCountdown();
    }
  }

  // --- Live Countdown Timer ---
  function startCountdown() {
    function updateTimer() {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0); // Midnight
      const diff = tomorrow.getTime() - now.getTime();

      const valEl = document.getElementById('dailyCountdownValue');
      if (!valEl) return;

      if (diff <= 0) {
        valEl.textContent = '00:00:00';
        if (countdownInterval) clearInterval(countdownInterval);
        fetchStatus();
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

      valEl.textContent = `${h}:${m}:${s}`;
    }

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
  }

  // --- Fetch Check-in Status from API ---
  async function fetchStatus() {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${getApiBase()}/api/users/daily-checkin`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) return;
      const json = await res.json();
      if (!json.success || !json.data) return;

      claimState = json.data;

      // Show floating button once authenticated
      const floatingBtn = document.getElementById('dailyClaimFloatingBtn');
      if (floatingBtn) floatingBtn.style.display = 'flex';

      renderGrid(
        claimState.rewards,
        claimState.currentStreak,
        claimState.claimedToday,
        claimState.nextClaimDay
      );
      renderActionArea(claimState);
    } catch (err) {
      console.warn('Failed to fetch daily check-in status:', err);
    }
  }

  // --- Handle Claim Submission ---
  async function handleClaim() {
    if (isClaiming) return;
    const token = getToken();
    if (!token) {
      alert('Please log in to claim your daily bonus.');
      return;
    }

    const btn = document.getElementById('dailyClaimNowBtn');
    if (btn) {
      isClaiming = true;
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Claiming Bonus...</span>`;
    }

    try {
      const res = await fetch(`${getApiBase()}/api/users/daily-checkin/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.message || 'Could not claim daily reward. Please try again later.');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<i class="fa-solid fa-gift"></i> <span>Claim Day (+$0.50 USD)</span>`;
        }
        isClaiming = false;
        return;
      }

      // Success!
      closeModal();
      if (confetti) confetti.launch(150);
      openCelebration(json.data?.rewardAmount || 0.5);

      // Re-fetch status to transition to countdown state
      await fetchStatus();

      // Trigger custom event so any page listening can update user balance
      window.dispatchEvent(
        new CustomEvent('daily-claimed', {
          detail: {
            rewardAmount: json.data?.rewardAmount || 0.5,
            newBalance: json.data?.newBalance
          }
        })
      );

      // Also trigger a refresh of stats if dashboard functions exist
      if (typeof window.fetchDashboardStats === 'function') {
        window.fetchDashboardStats();
      }
      if (typeof window.fetchUserProfile === 'function') {
        window.fetchUserProfile();
      }
    } catch (err) {
      console.error('Error claiming daily bonus:', err);
      alert('Network error while claiming. Please check your connection.');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-gift"></i> <span>Claim Day (+$0.50 USD)</span>`;
      }
    } finally {
      isClaiming = false;
    }
  }

  // --- Global Expose & DOM Ready ---
  window.openDailyClaimModal = openModal;
  window.closeDailyClaimModal = closeModal;

  document.addEventListener('DOMContentLoaded', () => {
    injectDOMElements();

    // Attach click events to any element configured to open daily claim
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-open-daily-claim], .btn-daily-claim');
      if (target) {
        e.preventDefault();
        openModal();
      }
    });

    // If authenticated, fetch status immediately
    if (getToken()) {
      fetchStatus();
    }
  });
})();
