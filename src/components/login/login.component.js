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
import { ROLES, ROLE_LABELS, SOCIAL_WORKER_ROLE } from '../../core/permissions.js';

// الحساب الافتراضي لأي مدخل غير معروف — أقل دور في الهرم
const FALLBACK_ACCOUNT = {
  name: 'حسن',
  roleCode: ROLES.DATA_ENTRY,
  email: 'hassan@gmail.com'
};

/**
 * Match the typed email/username against the staff roster held in the store.
 * Matching is done on the email local part so "hassanalaa" works as well as
 * the full address. Unknown input logs in as the default data-entry account.
 *
 * الأخصائي الميداني موجود في جدول الموظفين لأن الويب بيسند له الحالات، لكنه
 * مايسجلش دخول هنا — شغله كله من تطبيق الموبايل المنفصل.
 */
function resolveAccount(inputVal) {
  if (!inputVal) return { ...FALLBACK_ACCOUNT };

  const employees = store.employees || [];
  const match = employees.find(emp => {
    const empEmail = (emp.email || '').toLowerCase();
    if (!empEmail) return false;
    return empEmail === inputVal || empEmail.split('@')[0] === inputVal;
  });

  if (match && match.roleCode === SOCIAL_WORKER_ROLE) {
    return { blocked: true, name: match.name };
  }

  if (match) {
    return { name: match.name, roleCode: match.roleCode, email: match.email };
  }

  // Unrecognised account: keep whatever was typed, lowest privileges.
  return {
    name: inputVal.split('@')[0],
    roleCode: ROLES.DATA_ENTRY,
    email: inputVal.includes('@') ? inputVal : `${inputVal}@nahda.org.eg`
  };
}

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

    // Resolve the account against the staff roster; anything unrecognised
    // falls back to the least-privileged role (مدخل بيانات).
    const account = resolveAccount(inputVal);

    // حساب أخصائي ميداني — شغله من التطبيق، مش من الويب
    if (account.blocked) {
      showToast(`${account.name} أخصائي ميداني — الدخول من تطبيق الأخصائي وليس من الويب 📱`);
      return;
    }

    const name = account.name;
    const roleCode = account.roleCode;
    const roleLabel = ROLE_LABELS[roleCode] || 'موظف';
    const email = account.email;

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
      updateUserDOM(name);

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

  // Update the dashboard hero greeting for the logged-in user.
  // بيانات الشريط الجانبي وإظهار أقسامه مسؤولية initSidebarUserProfile.
  function updateUserDOM(name) {
    const greetingEl = DOM.qs('.dash-hero-card__greeting');
    const nameEl = DOM.qs('.dash-hero-card__name');
    const heroTitle = DOM.qs('.dash-hero-card__title');
    const greeting = getTimeGreeting();

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
      updateUserDOM(user.name);
    }
  });

  // Apply stored user data on initial boot
  const initialUser = store.currentUser;
  if (initialUser && initialUser.name) {
    updateUserDOM(initialUser.name);
  }
}
