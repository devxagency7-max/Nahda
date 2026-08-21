/* --------------------------------------------------------------------------
   SIDEBAR ACCORDION ENGINE
   -------------------------------------------------------------------------- */
export function initSidebarAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  // Initialize initially open accordions
  document.querySelectorAll('.accordion-group--open').forEach(group => {
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
      document.querySelectorAll('.accordion-group').forEach(otherGroup => {
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

/* --------------------------------------------------------------------------
   SIDEBAR COLLAPSE TOGGLE
   -------------------------------------------------------------------------- */
export function initSidebarCollapse() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.sidebar__toggle');
  const sidebarNav = document.querySelector('.sidebar__nav');

  function setCollapsed(collapsed) {
    if (!sidebar) return;
    sidebar.classList.toggle('sidebar--collapsed', collapsed);
    document.body.classList.toggle('sidebar-is-collapsed', collapsed);

    const icon = toggleBtn ? toggleBtn.querySelector('svg') : null;
    if (icon) {
      icon.style.transform = collapsed ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  }

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setCollapsed(!sidebar.classList.contains('sidebar--collapsed'));
    });
  }

  // Expand the sidebar automatically when any nav button is clicked while collapsed
  if (sidebarNav && sidebar) {
    sidebarNav.addEventListener('click', () => {
      if (sidebar.classList.contains('sidebar--collapsed')) {
        setCollapsed(false);
      }
    });
  }
}
