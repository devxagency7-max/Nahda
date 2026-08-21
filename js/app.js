/**
 * ENTERPRISE DASHBOARD INTERACTIVITY ENGINE (ES6 VANILLA JS)
 * Handles: Accordion Navigation, Collapsible Sidebar, Step Tabs, Drag&Drop Upload,
 * In-Page Background Customizer Card & Live Visual Effects (Blur, Brightness, Contrast, Saturation)
 *
 * Entry point: bootstraps all modules loaded before this file, and hosts the
 * shared showToast() helper used across them.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageViewNavigation();
  initDashboardInteractivity();
  initSidebarAccordion();
  initSidebarCollapse();
  initWorkflowTabs();
  initFileUpload();
  initFormInteractivity();
  initInPageBackgroundStudio();
  initFamilyMembersManager();
  initLocationCascade();
  initOtherOptionDropdowns();
});

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('toast--visible');

  setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 3200);
}
