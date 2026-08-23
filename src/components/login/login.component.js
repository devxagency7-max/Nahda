/* --------------------------------------------------------------------------
   LOGIN SCREEN COMPONENT CONTROLLER
   Manages login form submission, password toggling, and transition to the
   main dashboard.
   -------------------------------------------------------------------------- */
import { showToast } from '../../utils/toast.js';
import { store } from '../../state/store.js';
import { DOM } from '../../utils/dom.js';
import { switchView } from '../../core/router.js';
import { EventBus, EVENTS } from '../../core/event-bus.js';
import { getTimeGreeting } from '../../utils/date.js';

export function initLoginScreen() {
  const loginForm = DOM.qs('#login-form');
  const usernameInput = DOM.qs('#login-username');
  const passwordInput = DOM.qs('#login-password');
  const togglePwBtn = DOM.qs('#btn-toggle-pw');
  const submitBtn = DOM.qs('#btn-login-submit');

  // Password Visibility Toggle
  if (togglePwBtn && passwordInput) {
    togglePwBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';

      const svg = togglePwBtn.querySelector('svg');
      if (svg) {
        svg.innerHTML = isPassword
          ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`
          : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
      }
    });
  }

  // Perform User Authentication & Transition to Dashboard
  function performLogin(emailOrUsername) {
    const inputVal = (emailOrUsername || '').trim().toLowerCase();
    
    let name = 'حسن';
    let roleLabel = 'مدير النظام';
    let roleCode = 'admin';
    let email = inputVal || 'hassan@gmail.com';

    if (inputVal === 'hassanalaa@gmail.com' || inputVal === 'hassanalaa') {
      name = 'حسن علاء';
      roleLabel = 'مراجع';
      roleCode = 'reviewer';
      email = 'hassanalaa@gmail.com';
    } else if (inputVal === 'hassanalaahafez@gmail.com' || inputVal === 'hassanalaahafez') {
      name = 'حسن علاء حافظ';
      roleLabel = 'مدير';
      roleCode = 'manager';
      email = 'hassanalaahafez@gmail.com';
    } else if (inputVal === 'hassan@gmail.com' || inputVal === 'hassan') {
      name = 'حسن';
      roleLabel = 'مدير النظام';
      roleCode = 'admin';
      email = 'hassan@gmail.com';
    } else if (inputVal.includes('hassanalaahafez')) {
      name = 'حسن علاء حافظ';
      roleLabel = 'مدير';
      roleCode = 'manager';
    } else if (inputVal.includes('hassanalaa')) {
      name = 'حسن علاء';
      roleLabel = 'مراجع';
      roleCode = 'reviewer';
    } else if (inputVal) {
      name = inputVal.split('@')[0];
    }

    if (submitBtn) {
      submitBtn.classList.add('login-submit-btn--loading');
      submitBtn.innerHTML = `
        <span>جاري التحقق والدخول...</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin-icon">
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
        </svg>
      `;
    }

    setTimeout(() => {
      // Save User Credentials in Central Reactive Store
      store.setCurrentUser({
        name: name,
        roleLabel: roleLabel,
        roleCode: roleCode,
        email: email
      });

      // Update UI Header and Sidebar User Metadata
      updateUserDOM(name, roleLabel);

      // Reset submit button state
      if (submitBtn) {
        submitBtn.classList.remove('login-submit-btn--loading');
        submitBtn.innerHTML = `
          <span>تسجيل الدخول</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        `;
      }

      // Switch View to Main Dashboard
      switchView('dashboard');
      const greeting = getTimeGreeting();
      showToast(`${greeting}، ${name}! تم تسجيل الدخول بدور (${roleLabel}) بنجاح 🚀`);
    }, 350);
  }

  // Update DOM text for logged-in user across sidebar and dashboard hero
  function updateUserDOM(name, roleLabel) {
    const sidebarUserName = DOM.qs('.sidebar__footer .user-name');
    const sidebarUserRole = DOM.qs('.sidebar__footer .user-role');
    const greetingEl = DOM.qs('.dash-hero-card__greeting');
    const nameEl = DOM.qs('.dash-hero-card__name');
    const heroTitle = DOM.qs('.dash-hero-card__title');
    const greeting = getTimeGreeting();

    if (sidebarUserName) sidebarUserName.textContent = name;
    if (sidebarUserRole) sidebarUserRole.textContent = roleLabel;
    if (greetingEl) greetingEl.textContent = greeting;
    if (nameEl) nameEl.textContent = name;
    if (!greetingEl && heroTitle) {
      heroTitle.innerHTML = `<span class="dash-hero-card__greeting">${greeting}</span>، <span class="dash-hero-card__name">${name}</span> 👋`;
    }
  }

  // Login Form Submission Event Handler
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredValue = usernameInput && usernameInput.value.trim() ? usernameInput.value.trim() : 'hassan@gmail.com';
      performLogin(enteredValue);
    });
  }

  // Quick Demo Account Selection Chips Handler
  DOM.qsa('.btn-demo-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const demoEmail = chip.getAttribute('data-email');
      if (demoEmail) {
        if (usernameInput) usernameInput.value = demoEmail;
        if (passwordInput) passwordInput.value = '123456';
        performLogin(demoEmail);
      }
    });
  });

  // Listen for User Changes via EventBus
  EventBus.on(EVENTS.USER_CHANGED, (user) => {
    if (user && user.name) {
      updateUserDOM(user.name, user.roleLabel);
    }
  });

  // Apply stored user data on initial boot
  const initialUser = store.currentUser;
  if (initialUser && initialUser.name) {
    updateUserDOM(initialUser.name, initialUser.roleLabel);
  }
}
