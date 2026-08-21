import { showToast } from '../core/toast.js';

/* --------------------------------------------------------------------------
   PAGE VIEW SWITCHER ENGINE WITH LOCALSTORAGE PERSISTENCE
   -------------------------------------------------------------------------- */
export function initPageViewNavigation() {
  const navBgLink = document.getElementById('nav-bg-card-link');
  const btnBack = document.getElementById('btn-back-to-personal-data');
  const viewDashboard = document.getElementById('view-dashboard');
  const viewPersonalData = document.getElementById('view-personal-data');
  const viewBgStudio = document.getElementById('view-bg-studio');
  const breadcrumb = document.querySelector('.breadcrumb');

  function toast(msg) {
    showToast(msg);
  }

  function switchView(viewName, saveToStorage = true) {
    if (saveToStorage) {
      localStorage.setItem('nahda_current_view', viewName);
    }

    // Hide all view panels
    if (viewDashboard) viewDashboard.classList.add('page-view--hidden');
    if (viewPersonalData) viewPersonalData.classList.add('page-view--hidden');
    if (viewBgStudio) viewBgStudio.classList.add('page-view--hidden');

    // Remove active styles from sidebar links
    document.querySelectorAll('.sidebar-sublink').forEach(link => link.classList.remove('sidebar-sublink--active'));
    document.querySelectorAll('.accordion-header').forEach(hdr => hdr.classList.remove('accordion-header--active'));

    document.body.classList.toggle('is-dashboard-view', viewName !== 'personal-data' && viewName !== 'bg-studio');

    if (viewName === 'bg-studio') {
      if (viewBgStudio) viewBgStudio.classList.remove('page-view--hidden');
      if (breadcrumb) {
        breadcrumb.innerHTML = `
          <span>الرئيسية</span>
          <span>/</span>
          <span>إعدادات النظام</span>
          <span>/</span>
          <span class="breadcrumb__item--active">استوديو التحكم بالخلفية</span>
        `;
      }
      if (navBgLink) navBgLink.classList.add('sidebar-sublink--active');

      // Auto open system settings accordion group
      const bgGroup = navBgLink ? navBgLink.closest('.accordion-group') : null;
      if (bgGroup) {
        bgGroup.classList.add('accordion-group--open');
        const body = bgGroup.querySelector('.accordion-body');
        if (body) body.style.maxHeight = (body.scrollHeight + 40) + 'px';
      }

      toast('تم فتح استوديو تخصيص الخلفية 🎨');
    } else if (viewName === 'personal-data') {
      if (viewPersonalData) viewPersonalData.classList.remove('page-view--hidden');
      if (breadcrumb) {
        breadcrumb.innerHTML = `
          <span>الرئيسية</span>
          <span>/</span>
          <span>إدارة البيانات</span>
          <span>/</span>
          <span class="breadcrumb__item--active">البيانات الأساسية</span>
        `;
      }
      const activeSublink = document.querySelector('.sidebar-sublink[data-view-target="personal-data"]');
      if (activeSublink) activeSublink.classList.add('sidebar-sublink--active');

      const dataGroup = activeSublink ? activeSublink.closest('.accordion-group') : null;
      if (dataGroup) {
        dataGroup.classList.add('accordion-group--open');
        const body = dataGroup.querySelector('.accordion-body');
        if (body) body.style.maxHeight = (body.scrollHeight + 40) + 'px';
      }

      toast('صفحة البيانات الأساسية المعاملة 📋');
    } else {
      // Default: Dashboard / الرئيسية
      if (viewDashboard) viewDashboard.classList.remove('page-view--hidden');
      if (breadcrumb) {
        breadcrumb.innerHTML = `
          <span class="breadcrumb__item--active">الرئيسية / لوحة التحكم</span>
        `;
      }
      const navDashLink = document.getElementById('nav-dashboard-link');
      if (navDashLink) navDashLink.classList.add('accordion-header--active');
      toast('الصفحة الرئيسية 🏠');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Make switchView globally accessible for other modules
  window.switchView = switchView;

  // Bind click handlers for elements with data-view-target
  document.querySelectorAll('[data-view-target]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-view-target');
      switchView(target);
    });
  });

  if (btnBack) {
    btnBack.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('personal-data');
    });
  }

  // Restore saved view on page load (silently, no toast)
  const savedView = localStorage.getItem('nahda_current_view') || 'dashboard';
  switchView(savedView, false);

  return switchView;
}
