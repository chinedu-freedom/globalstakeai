// shadcn-select.js - Ultra Modern Shadcn UI Select Component System
(function () {
  'use strict';

  // Toggle dropdown open/close
  window.toggleShadcnSelect = function (wrapper) {
    const el = typeof wrapper === 'string' ? document.getElementById(wrapper) : wrapper;
    if (!el) return;

    const content = el.querySelector('.shadcn-select-content');
    const chevron = el.querySelector('.select-chevron');
    const trigger = el.querySelector('.shadcn-select-trigger');
    if (!content) return;

    const isHidden = content.classList.contains('hidden');

    // Close all other open shadcn selects first
    document.querySelectorAll('.shadcn-select-content').forEach(c => {
      if (c !== content && !c.classList.contains('hidden')) {
        closeSelectElement(c.closest('.shadcn-select'));
      }
    });

    if (isHidden) {
      content.classList.remove('hidden');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'true');
        trigger.classList.add('ring-2', 'ring-[#00ff00]/40', 'border-[#00ff00]');
      }
      // Micro-animation in next frame
      requestAnimationFrame(() => {
        content.classList.remove('opacity-0', 'scale-95', '-translate-y-1');
        content.classList.add('opacity-100', 'scale-100', 'translate-y-0');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      });
    } else {
      closeSelectElement(el);
    }
  };

  // Close specific select
  function closeSelectElement(wrapper) {
    if (!wrapper) return;
    const content = wrapper.querySelector('.shadcn-select-content');
    const chevron = wrapper.querySelector('.select-chevron');
    const trigger = wrapper.querySelector('.shadcn-select-trigger');
    if (!content || content.classList.contains('hidden')) return;

    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.classList.remove('ring-2', 'ring-[#00ff00]/40');
    }
    content.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
    content.classList.add('opacity-0', 'scale-95', '-translate-y-1');
    if (chevron) chevron.style.transform = 'rotate(0deg)';

    setTimeout(() => {
      content.classList.add('hidden');
    }, 150);
  }

  window.closeShadcnSelect = closeSelectElement;

  // Choose option from custom dropdown
  window.chooseShadcnOption = function (wrapper, value, text) {
    const el = typeof wrapper === 'string' ? document.getElementById(wrapper) : wrapper;
    if (!el) return;

    const select = el.querySelector('select');
    const triggerText = el.querySelector('.select-value-text');

    if (select) {
      const prevVal = select.value;
      select.value = value;
      // Trigger native change and input events so all forms and framework listeners react
      if (prevVal !== value) {
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    if (triggerText) {
      triggerText.textContent = text;
    }

    // Update active checkmarks
    el.querySelectorAll('.shadcn-select-item').forEach(item => {
      const isSelected = item.getAttribute('data-value') === String(value);
      item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      const check = item.querySelector('.item-check');
      if (check) {
        if (isSelected) {
          check.classList.remove('hidden');
        } else {
          check.classList.add('hidden');
        }
      }
    });

    closeSelectElement(el);
  };

  // Auto-enhance native <select> elements to Shadcn Select
  window.enhanceSelectToShadcn = function (select) {
    if (!select || select.dataset.shadcnEnhanced === 'true') return;
    if (select.dataset.noShadcn === 'true') return;

    select.dataset.shadcnEnhanced = 'true';
    select.style.display = 'none';

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'shadcn-select relative w-full';
    if (select.id) {
      wrapper.id = select.id + '-shadcn-wrapper';
    }

    // Place wrapper in DOM
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    const options = Array.from(select.options);
    const selectedOption = select.options[select.selectedIndex] || options[0] || { text: 'Select an option', value: '' };

    // Trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'shadcn-select-trigger w-full flex items-center justify-between bg-[#0a0f0c] border border-[#00ff00] text-white text-[13px] font-semibold rounded-xl py-3.5 px-4 shadow-[0_0_15px_rgba(0,255,0,0.15)] hover:border-[#00ff00] focus:outline-none transition-all duration-200 cursor-pointer text-left';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    trigger.innerHTML = `
      <span class="select-value-text truncate flex items-center gap-2">${selectedOption.text}</span>
      <i class="fas fa-chevron-down text-[11px] text-[#00ff00] transition-transform duration-200 ease-in-out select-chevron ml-2 shrink-0"></i>
    `;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      window.toggleShadcnSelect(wrapper);
    });

    wrapper.appendChild(trigger);

    // Dropdown content panel
    const content = document.createElement('div');
    content.className = 'shadcn-select-content absolute left-0 right-0 mt-2 bg-[#0a0f0c] border border-[#00ff00] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.95),0_0_20px_rgba(0,255,0,0.25)] p-1.5 z-[100] hidden opacity-0 scale-95 -translate-y-1 transition-all duration-150 origin-top overflow-hidden max-h-60 overflow-y-auto no-scrollbar';
    content.setAttribute('role', 'listbox');

    options.forEach(opt => {
      const isSelected = opt.value === select.value || opt.selected;
      const item = document.createElement('div');
      item.className = 'shadcn-select-item group relative flex items-center w-full py-2.5 pl-8 pr-3 text-xs font-semibold rounded-lg text-white hover:bg-[#00ff00] hover:text-black cursor-pointer transition-colors';
      item.setAttribute('role', 'option');
      item.setAttribute('data-value', opt.value);
      item.setAttribute('aria-selected', isSelected ? 'true' : 'false');

      item.innerHTML = `
        <i class="fas fa-check text-[#00ff00] group-hover:text-black text-xs absolute left-2.5 item-check ${isSelected ? '' : 'hidden'}"></i>
        <span class="truncate">${opt.text}</span>
      `;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        window.chooseShadcnOption(wrapper, opt.value, opt.text);
      });

      content.appendChild(item);
    });

    wrapper.appendChild(content);

    // Synchronize if select is updated externally
    select.addEventListener('change', () => {
      const curOpt = select.options[select.selectedIndex];
      if (curOpt) {
        const textSpan = trigger.querySelector('.select-value-text');
        if (textSpan) textSpan.textContent = curOpt.text;

        content.querySelectorAll('.shadcn-select-item').forEach(item => {
          const isMatch = item.getAttribute('data-value') === String(select.value);
          item.setAttribute('aria-selected', isMatch ? 'true' : 'false');
          const check = item.querySelector('.item-check');
          if (check) check.classList.toggle('hidden', !isMatch);
        });
      }
    });
  };

  window.initShadcnSelects = function () {
    document.querySelectorAll('select:not([data-shadcn-enhanced="true"])').forEach(select => {
      // Ignore google translate hidden combo
      if (select.classList.contains('goog-te-combo')) return;
      window.enhanceSelectToShadcn(select);
    });
  };

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.shadcn-select')) {
      document.querySelectorAll('.shadcn-select').forEach(wrapper => {
        closeSelectElement(wrapper);
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.shadcn-select').forEach(wrapper => {
        closeSelectElement(wrapper);
      });
    }
  });

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initShadcnSelects);
  } else {
    window.initShadcnSelects();
  }
})();
