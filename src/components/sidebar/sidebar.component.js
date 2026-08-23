/* --------------------------------------------------------------------------
   SIDEBAR COMPONENT
   Handles accordion navigation groups and sidebar collapse state.
   -------------------------------------------------------------------------- */
import { DOM } from '../../utils/dom.js';
import { store } from '../../state/store.js';
import { EventBus, EVENTS } from '../../core/event-bus.js';

export function initSidebarAccordion() {
  const accordionHeaders = DOM.qsa('.accordion-header');

  // Initialize initially open accordions
  DOM.qsa('.accordion-group--open').forEach(group => {
    const body = group.querySelector('.accordion-body');
    if (body) body.style.maxHeight = (body.scrollHeight + 40) + 'px';
  });

  accordionHeaders.forEach(header => {
    header.addEventListener('click', (e) => {
      // If header is a direct link (e.g. <a> anchor), don't treat as expandable accordion header
      if (header.tagName === 'A' || header.id === 'nav-bg-card-link') {
        return;
      }

      e.preventDefault();
      const group = header.closest('.accordion-group');
      if (!group) return;
      const body = group.querySelector('.accordion-body');
      if (!body) return;

      const isOpen = group.classList.contains('accordion-group--open');

      // Close all other accordions for clean single navigation
      DOM.qsa('.accordion-group').forEach(otherGroup => {
        if (otherGroup !== group && otherGroup.classList.contains('accordion-group--open')) {
          otherGroup.classList.remove('accordion-group--open');
          const otherBody = otherGroup.querySelector('.accordion-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      // Toggle current accordion
      if (isOpen) {
        group.classList.remove('accordion-group--open');
        body.style.maxHeight = null;
      } else {
        group.classList.add('accordion-group--open');
        body.style.maxHeight = (body.scrollHeight + 40) + 'px';
      }
    });
  });
}

export function initSidebarCollapse() {
  const sidebar = DOM.qs('.sidebar');
  const toggleBtn = DOM.qs('.sidebar__toggle');
  const sidebarNav = DOM.qs('.sidebar__nav');

  function setCollapsed(collapsed, save = true) {
    if (!sidebar) return;
    sidebar.classList.toggle('sidebar--collapsed', collapsed);
    document.body.classList.toggle('sidebar-is-collapsed', collapsed);

    const icon = toggleBtn ? toggleBtn.querySelector('svg') : null;
    if (icon) {
      icon.style.transform = collapsed ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    if (save) {
      try {
        localStorage.setItem('nahda_sidebar_collapsed', collapsed ? 'true' : 'false');
      } catch (e) {}
    }

    // Trigger resize event for dynamic layout reflow
    window.dispatchEvent(new Event('resize'));
  }

  // Restore saved sidebar collapsed preference
  try {
    const isSavedCollapsed = localStorage.getItem('nahda_sidebar_collapsed') === 'true';
    if (isSavedCollapsed) {
      setCollapsed(true, false);
    }
  } catch (e) {}

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setCollapsed(!sidebar.classList.contains('sidebar--collapsed'));
    });
  }

  // Expand the sidebar automatically when any nav button is clicked while collapsed
  if (sidebarNav && sidebar) {
    sidebarNav.addEventListener('click', (e) => {
      if (e.target.closest('.accordion-header') || e.target.closest('.sidebar-sublink')) {
        if (sidebar.classList.contains('sidebar--collapsed')) {
          setCollapsed(false);
        }
      }
    });
  }
}

export function initSidebarUserProfile() {
  const avatarImg = DOM.qs('#sidebar-user-avatar');
  const nameEl = DOM.qs('#sidebar-user-name');
  const roleEl = DOM.qs('#sidebar-user-role');

  function update() {
    const user = store.currentUser;
    if (!user) return;
    if (avatarImg && user.avatar) avatarImg.src = user.avatar;
    if (nameEl && user.name) nameEl.textContent = user.name;
    if (roleEl && user.roleLabel) roleEl.textContent = user.roleLabel;
  }

  update();
  EventBus.on(EVENTS.USER_CHANGED, update);
}
