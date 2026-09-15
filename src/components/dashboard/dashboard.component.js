/* --------------------------------------------------------------------------
   HOMEPAGE DASHBOARD COMPONENT
   Handles live Arabic date, multi-criteria central search, region autocomplete,
   date range presets, search execution, and expandable recent cases section.
   -------------------------------------------------------------------------- */
import { showToast } from '../../utils/toast.js';
import { DataService } from '../../services/data.js';
import { DOM } from '../../utils/dom.js';
import { getTimeGreeting, getFormattedArabicDate } from '../../utils/date.js';
import { store } from '../../state/store.js';
import { EventBus, EVENTS } from '../../core/event-bus.js';
import { setCasesFilter } from '../all-cases/all-cases.component.js';
import { MOCK_CASES } from '../../data/mockCases.js';
import { normalizeNumerals } from '../../utils/nationalId.js';
import { isRole, ROLES } from '../../core/permissions.js';
import {
  caseTotals,
  casesAwaitingReviewer,
  casesAwaitingManager,
  casesReviewedBy,
  casesCreatedBy,
  casesReturnedToWorker,
  casesWithIncompleteAttachments
} from '../../state/selectors.js';

export function updateDashboardHero() {
  const dateEl = DOM.qs('#dash-current-date');
  if (dateEl) {
    dateEl.textContent = getFormattedArabicDate();
  }

  const greetingEl = DOM.qs('.dash-hero-card__greeting');
  const nameEl = DOM.qs('.dash-hero-card__name');
  const heroTitle = DOM.qs('.dash-hero-card__title');
  const heroDesc = DOM.qs('.dash-hero-card__desc');
  const currentUser = store.currentUser || {};
  const currentUserName = currentUser.name || 'حسن';
  const greeting = getTimeGreeting();

  if (greetingEl) {
    greetingEl.textContent = greeting;
  }
  if (nameEl) {
    nameEl.textContent = currentUserName;
  }
  if (!greetingEl && heroTitle) {
    heroTitle.innerHTML = `<span class="dash-hero-card__greeting">${greeting}</span>، <span class="dash-hero-card__name">${currentUserName}</span>`;
  }
  if (heroDesc) {
    heroDesc.innerHTML = `مرحباً بك في لوحة تحكم منظومة النهضة`;
  }
}

/* --------------------------------------------------------------------------
   ROLE-AWARE KPI CARDS
   كل دور بيشوف شغله هو: مدخل البيانات حالاته اللي أدخلها، المراجع اللي مستنية
   مراجعته، والمدير اللي مستنية اعتماده زائد نظرة شاملة على الفريق. الأرقام
   محسوبة من الحالات الفعلية، فبتتحرك لحظة ما يتسجّل قرار.
   -------------------------------------------------------------------------- */

const ICONS = {
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"></path><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>',
  clock: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
  check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
  cross: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>',
  alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
  building: '<path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-3"></path>',
  scale: '<path d="M12 3v18"></path><path d="M5 7h14"></path><path d="M6 7l-3 7h6z"></path><path d="M18 7l-3 7h6z"></path>'
};

const TONES = {
  neutral: { icon: 'rgba(100, 116, 139, 0.15)', text: '#475569', border: '' },
  blue:    { icon: 'rgba(37, 99, 235, 0.15)',   text: '#2563eb', border: 'rgba(37, 99, 235, 0.3)' },
  amber:   { icon: 'rgba(217, 119, 6, 0.15)',   text: '#b45309', border: 'rgba(217, 119, 6, 0.3)' },
  green:   { icon: 'rgba(16, 185, 129, 0.15)',  text: '#047857', border: 'rgba(16, 185, 129, 0.3)' },
  red:     { icon: 'rgba(225, 29, 72, 0.15)',   text: '#be123c', border: 'rgba(225, 29, 72, 0.3)' }
};

/**
 * Build one stat card.
 * @param {{title:string, value:number|string, icon:string, tone?:string,
 *          target?:string, hint?:string}} spec
 */
function statCard(spec) {
  const tone = TONES[spec.tone || 'neutral'];
  const clickable = Boolean(spec.target);
  return `
    <div class="glass-card dash-stat-card"${clickable ? ` data-cases-target="${spec.target}" style="cursor: pointer;${tone.border ? ` border: 1px solid ${tone.border};` : ''}" title="${DOM.escapeHTML(spec.hint || '')}"` : (tone.border ? ` style="border: 1px solid ${tone.border};"` : '')}>
      <div class="glass-card__icon" style="background: ${tone.icon}; color: ${tone.text};">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">${ICONS[spec.icon] || ICONS.file}</svg>
      </div>
      <div class="dash-stat-card__content">
        <span class="dash-stat-card__title">${DOM.escapeHTML(spec.title)}</span>
        <div class="dash-stat-card__val-row" style="display: flex; align-items: center; margin-top: 4px;">
          <span class="dash-stat-card__val" style="color: ${tone.text};">${spec.value}</span>
        </div>
      </div>
    </div>
  `;
}

/** بطاقة "إجمالي الحالات" — مشتركة بين كل الأدوار ومنفذ الوصول لسجل الحالات. */
function totalCasesCard(totals) {
  return {
    title: 'إجمالي الحالات', value: totals.total, icon: 'users', tone: 'blue',
    target: 'all', hint: 'انتقال لسجل كافة الحالات'
  };
}

/** Card specs for the current role, most actionable first. */
function kpiSpecsForRole() {
  const totals = caseTotals();
  const user = store.currentUser || {};

  if (isRole(ROLES.REVIEWER)) {
    const awaiting = casesAwaitingReviewer().length;
    return [
      { title: 'بانتظار مراجعتك', value: awaiting, icon: 'inbox', tone: 'amber',
        target: 'pending', hint: 'الحالات التي سجّل الأخصائي رأيه فيها وتنتظر مراجعتك' },
      totalCasesCard(totals),
      { title: 'أعدتها للأخصائي', value: casesReturnedToWorker().length, icon: 'alert', tone: 'amber',
        target: 'pending', hint: 'الحالات التي أرجعتها للأخصائي لاستكمال البحث' },
      { title: 'راجعتها', value: casesReviewedBy(user.name).length, icon: 'scale', tone: 'blue',
        target: 'all', hint: 'الحالات التي سجّلت رأيك فيها' },
      { title: 'مقبولة', value: totals.accepted, icon: 'check', tone: 'green',
        target: 'accepted', hint: 'عرض الحالات المقبولة' },
      { title: 'مرفوضة', value: totals.rejected, icon: 'cross', tone: 'red',
        target: 'rejected', hint: 'عرض الحالات المرفوضة' }
    ];
  }

  if (isRole(ROLES.MANAGER)) {
    return [
      { title: 'بانتظار اعتمادك', value: casesAwaitingManager().length, icon: 'inbox', tone: 'amber',
        target: 'pending', hint: 'الحالات التي أنهى المراجع رأيه فيها وتنتظر قرارك النهائي' },
      totalCasesCard(totals),
      { title: 'مقبولة', value: totals.accepted, icon: 'check', tone: 'green',
        target: 'accepted', hint: 'عرض الحالات المقبولة' },
      { title: 'مرفوضة', value: totals.rejected, icon: 'cross', tone: 'red',
        target: 'rejected', hint: 'عرض الحالات المرفوضة' },
      { title: 'فريق العمل', value: (store.employees || []).length, icon: 'users', tone: 'neutral' },
      { title: 'الجمعيات المعتمدة', value: (store.charities || []).length, icon: 'building', tone: 'neutral' }
    ];
  }

  // Data entry (and any unrecognised role): their own intake work
  return [
    { title: 'حالات أدخلتها', value: casesCreatedBy(user.name).length, icon: 'file', tone: 'blue',
      target: 'all', hint: 'الحالات التي سجّلتها بنفسك' },
    totalCasesCard(totals),
    { title: 'ناقصة المستندات', value: casesWithIncompleteAttachments().length, icon: 'alert', tone: 'amber',
      target: 'all', hint: 'حالات بها مرفقات غير مستوفاة' },
    { title: 'قيد المراجعة', value: totals.pending, icon: 'clock', tone: 'amber',
      target: 'pending', hint: 'عرض الحالات قيد المراجعة' },
    { title: 'الجمعيات المعتمدة', value: (store.charities || []).length, icon: 'building', tone: 'neutral' }
  ];
}

export function updateDashboardKPIs() {
  const kpisGrid = DOM.qs('.dash-stats-grid');
  if (!kpisGrid) return;

  // المراجع والمدير شغلهم يبدأ من قائمة القرارات، فبطاقاتهم فوق شريط البحث.
  // مدخل البيانات شغله يبدأ من البحث، فبطاقاته تحته.
  // ملاحظة: الـ loader بيستبدل عناصر الـ mount بـ outerHTML، فالترتيب بيتم
  // على شبكة البطاقات نفسها لا على #dash-kpis-mount (اللي مابيفضلش موجود).
  const searchEl = DOM.qs('.dash-search-standalone');
  if (searchEl && searchEl.parentNode === kpisGrid.parentNode) {
    const decisionFirst = isRole(ROLES.REVIEWER) || isRole(ROLES.MANAGER);
    if (decisionFirst) {
      if (searchEl.previousElementSibling !== kpisGrid) {
        searchEl.parentNode.insertBefore(kpisGrid, searchEl);
      }
    } else if (searchEl.nextElementSibling !== kpisGrid) {
      searchEl.parentNode.insertBefore(kpisGrid, searchEl.nextSibling);
    }
  }

  kpisGrid.innerHTML = kpiSpecsForRole().map(statCard).join('');

  // Bind click handlers to cards to switch view to 'all-cases'
  kpisGrid.querySelectorAll('[data-cases-target]').forEach(card => {
    card.addEventListener('click', () => {
      const filter = card.getAttribute('data-cases-target');
      if (window.switchView) {
        window.switchView('all-cases');
      }
      setCasesFilter(filter);
    });
  });
}

/* --------------------------------------------------------------------------
   ROLE-AWARE WORK QUEUE ("أحدث الحالات")
   بدل قائمة ثابتة، كل دور بيشوف الحالات اللي محتاجة تدخّله هو.
   -------------------------------------------------------------------------- */

const AVATAR_TONES = ['emerald', 'blue', 'amber', 'rose', 'violet'];

/** First letters of the first two words, used as an avatar monogram. */
function initialsOf(name) {
  const parts = String(name || '').trim().split(/\s+/).slice(0, 2);
  return parts.map(w => w.charAt(0)).join('') || '؟';
}

/** Which cases this role should act on, plus how to title the section. */
function recentQueueForRole() {
  const user = store.currentUser || {};

  if (isRole(ROLES.REVIEWER)) {
    return {
      title: 'حالات بانتظار مراجعتك',
      empty: 'لا توجد حالات تنتظر مراجعتك حالياً — أنجزت كل ما لديك ✅',
      cases: casesAwaitingReviewer()
    };
  }

  if (isRole(ROLES.MANAGER)) {
    return {
      title: 'حالات بانتظار اعتمادك النهائي',
      empty: 'لا توجد حالات تنتظر اعتمادك حالياً — كل الملفات محسومة ✅',
      cases: casesAwaitingManager()
    };
  }

  const mine = casesCreatedBy(user.name);
  return {
    title: 'الحالات التي أدخلتها',
    empty: 'لم تسجّل أي حالة بعد — ابدأ بإضافة حالة جديدة من البيانات الأساسية 📝',
    cases: mine.length ? mine : []
  };
}

/** Render one case row in the work queue. */
function recentCaseRow(c, index) {
  const tone = AVATAR_TONES[index % AVATAR_TONES.length];
  return `
    <div class="dash-case-row">
      <div class="dash-case-row__user">
        <div class="dash-case-row__avatar dash-case-row__avatar--${tone}">${DOM.escapeHTML(initialsOf(c.name))}</div>
        <div class="dash-case-row__meta">
          <span class="dash-case-row__name">${DOM.escapeHTML(c.name)}</span>
          <span class="dash-case-row__nid">الرقم القومي: ${DOM.escapeHTML(c.nid)}</span>
        </div>
      </div>

      <div class="dash-case-row__details">
        <div class="dash-case-row__info-item">
          <span class="info-label">الجمعية:</span>
          <span class="info-val">${DOM.escapeHTML(c.charity)}</span>
        </div>
        <div class="dash-case-row__info-item">
          <span class="info-label">الموقع:</span>
          <span class="info-val">${DOM.escapeHTML(c.center)} — ${DOM.escapeHTML(c.village)}</span>
        </div>
      </div>

      <div class="dash-case-row__status">
        <span class="dash-status-pill ${c.statusClass}">${DOM.escapeHTML(c.statusLabel)}</span>
        <button type="button" class="btn btn--secondary btn--sm btn-open-recent-case" data-case-id="${DOM.escapeHTML(c.id)}">عرض الملف والتقرير</button>
      </div>
    </div>
  `;
}

export function updateRecentCases() {
  const listEl = DOM.qs('#dash-recent-list');
  if (!listEl) return;

  const titleEl = DOM.qs('#dash-recent-title');
  const countEl = DOM.qs('#dash-recent-count');
  const queue = recentQueueForRole();

  if (titleEl) titleEl.textContent = queue.title;
  if (countEl) {
    countEl.textContent = queue.cases.length ? `${queue.cases.length} حالة` : 'لا يوجد';
  }

  listEl.innerHTML = queue.cases.length
    ? queue.cases.map(recentCaseRow).join('')
    : `
      <div style="padding: 28px 20px; text-align: center; color: #475569;">
        <div style="font-size: 32px; margin-bottom: 10px;">📭</div>
        <p style="margin: 0; font-size: 14px; font-weight: 700;">${DOM.escapeHTML(queue.empty)}</p>
      </div>
    `;

  // Rows are re-rendered, so rebind their open buttons
  listEl.querySelectorAll('.btn-open-recent-case').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.getAttribute('data-case-id');
      if (window.openCaseDetailsPage) {
        window.openCaseDetailsPage(caseId);
      }
    });
  });
}

export function initDashboardInteractivity() {
  // Update Live Arabic Date, Dynamic Time-Based Greeting, KPIs & work queue
  updateDashboardHero();
  updateDashboardKPIs();
  updateRecentCases();

  // Listen to user and view changes to keep hero, KPIs & queue updated
  EventBus.on(EVENTS.USER_CHANGED, () => {
    updateDashboardHero();
    updateDashboardKPIs();
    updateRecentCases();
  });
  EventBus.on(EVENTS.VIEW_CHANGED, (view) => {
    if (view === 'dashboard') {
      updateDashboardHero();
      updateDashboardKPIs();
      updateRecentCases();
    }
  });

  // أي قرار يتسجّل على حالة بيحرّك أرقام الدور وقائمة شغله فورًا
  EventBus.on(EVENTS.CASE_UPDATED, () => {
    updateDashboardKPIs();
    updateRecentCases();
  });

  // Multi-Criteria Search Elements
  const searchTabs = DOM.qsa('.dash-search-tab');
  const searchInput = DOM.qs('#dash-search-input');
  const searchCounter = DOM.qs('#dash-search-counter');
  const searchHint = DOM.qs('#dash-search-hint');
  const searchBoxText = DOM.qs('#search-box-text');
  const searchBoxCharity = DOM.qs('#search-box-charity');
  const searchBoxRegion = DOM.qs('#search-box-region');
  const searchBoxDate = DOM.qs('#search-box-date');

  const charitySelect = DOM.qs('#dash-charity-select');
  const regionInput = DOM.qs('#dash-region-input');
  const regionSuggestions = DOM.qs('#dash-region-suggestions');

  const dashDateFrom = DOM.qs('#dash-date-from');
  const dashDateTo = DOM.qs('#dash-date-to');
  const datePresetBtns = DOM.qsa('.btn-date-preset');

  const btnSearch = DOM.qs('#btn-dash-search');
  const resultsContainer = DOM.qs('#dash-search-results');
  const resultsTitle = DOM.qs('#dash-results-title');
  const resultsCount = DOM.qs('#dash-results-count');
  const resultsList = DOM.qs('#dash-results-list');
  const btnClearSearch = DOM.qs('#btn-clear-search');

  let currentSearchMode = 'nid';

  function getInitials(name) {
    if (!name) return 'حا';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return parts[0].substring(0, 2);
  }

  function getAvatarColor(status) {
    if (status === 'accepted') return 'dash-case-row__avatar--emerald';
    if (status === 'rejected') return 'dash-case-row__avatar--purple';
    if (status === 'pending') return 'dash-case-row__avatar--amber';
    return 'dash-case-row__avatar--blue';
  }

  // Dynamic Charity Select Sync
  function updateDashboardCharitySelect() {
    if (!charitySelect) return;
    const charities = store.charities;
    const currentVal = charitySelect.value;
    
    charitySelect.innerHTML = '<option value="" selected>اختر الجمعية لعرض الحالات</option>' +
      charities.map(c => `<option value="${DOM.escapeHTML(c.id)}">${DOM.escapeHTML(c.name)} — ${DOM.escapeHTML(c.center)} (${DOM.escapeHTML(c.village)})</option>`).join('') +
      '<option value="أخرى" data-is-other="true">أخرى</option>';

    if (currentVal) {
      charitySelect.value = currentVal;
    }
  }

  updateDashboardCharitySelect();
  EventBus.on(EVENTS.CHARITIES_UPDATED, () => updateDashboardCharitySelect());

  // Initialize Region Autocomplete Options & Date Presets
  initRegionSearchAutocomplete();
  initDateRangePresets();

  function initRegionSearchAutocomplete() {
    if (!regionInput || !regionSuggestions) return;

    function buildAutocompleteOptions() {
      const beniSuefData = DataService.getBeniSuefLocations();
      const options = [];

      // 1. Governorate Option
      options.push({
        text: 'محافظة بني سويف',
        type: 'gov',
        center: 'بني سويف',
        village: ''
      });

      // 2. Centers and Villages Options
      Object.keys(beniSuefData).forEach(center => {
        options.push({
          text: `مركز ${center}`,
          type: 'center',
          center: center,
          village: ''
        });

        (beniSuefData[center] || []).forEach(village => {
          options.push({
            text: `قرية ${village} (مركز ${center})`,
            type: 'village',
            center: center,
            village: village
          });
        });
      });

      return options;
    }

    // Handle typing autocomplete popup with delegated event listener
    regionInput.addEventListener('input', () => {
      const val = regionInput.value.trim().toLowerCase();
      if (!val) {
        regionSuggestions.style.display = 'none';
        return;
      }

      const allOptions = buildAutocompleteOptions();
      const matches = allOptions.filter(opt =>
        opt.text.toLowerCase().includes(val) ||
        opt.village.toLowerCase().includes(val) ||
        opt.center.toLowerCase().includes(val)
      ).slice(0, 10);

      if (matches.length === 0) {
        regionSuggestions.style.display = 'none';
        return;
      }

      regionSuggestions.innerHTML = matches.map(opt => `
        <div class="search-autocomplete-item" data-value="${DOM.escapeHTML(opt.text)}">
          <span>${DOM.escapeHTML(opt.text)}</span>
          <span class="center-badge">${opt.type === 'gov' ? 'محافظة' : (opt.type === 'center' ? 'مركز' : 'قرية')}</span>
        </div>
      `).join('');

      regionSuggestions.style.display = 'block';
    });

    // Single delegated click listener on suggestions container
    regionSuggestions.addEventListener('click', (e) => {
      const item = e.target.closest('.search-autocomplete-item');
      if (item) {
        const val = item.getAttribute('data-value');
        if (val) {
          regionInput.value = val;
          regionSuggestions.style.display = 'none';
          executeSearch('region', val);
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!regionInput.contains(e.target) && !regionSuggestions.contains(e.target)) {
        regionSuggestions.style.display = 'none';
      }
    });
  }

  function initDateRangePresets() {
    if (!dashDateFrom || !dashDateTo || datePresetBtns.length === 0) return;

    function formatDate(d) {
      return d.toISOString().split('T')[0];
    }

    datePresetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        datePresetBtns.forEach(b => b.classList.remove('btn-date-preset--active'));
        btn.classList.add('btn-date-preset--active');

        const preset = btn.getAttribute('data-preset');
        const today = new Date();

        if (preset === 'today') {
          dashDateFrom.value = formatDate(today);
          dashDateTo.value = formatDate(today);
        } else if (preset === 'week') {
          const past = new Date(today);
          past.setDate(past.getDate() - 7);
          dashDateFrom.value = formatDate(past);
          dashDateTo.value = formatDate(today);
        } else if (preset === 'month') {
          const past = new Date(today);
          past.setDate(past.getDate() - 30);
          dashDateFrom.value = formatDate(past);
          dashDateTo.value = formatDate(today);
        } else if (preset === 'year') {
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          dashDateFrom.value = formatDate(startOfYear);
          dashDateTo.value = formatDate(today);
        }
      });
    });
  }

  // Helper to update live National ID character count & normalization
  function updateNidCounter() {
    if (!searchInput) return;

    if (currentSearchMode !== 'nid') {
      if (searchCounter) searchCounter.style.display = 'none';
      if (searchHint) searchHint.style.display = 'none';
      searchInput.classList.remove('dash-search-input--error');
      searchInput.style.borderColor = '';
      return;
    }

    const rawVal = searchInput.value;
    const cleanVal = normalizeNumerals(rawVal);
    if (rawVal !== cleanVal) {
      searchInput.value = cleanVal;
    }

    if (cleanVal.length === 0) {
      if (searchCounter) searchCounter.style.display = 'none';
      if (searchHint) searchHint.style.display = 'none';
      searchInput.classList.remove('dash-search-input--error');
      searchInput.style.borderColor = '';
      return;
    }

    if (searchCounter) {
      searchCounter.style.display = 'inline-flex';
      if (cleanVal.length === 14) {
        searchCounter.className = 'dash-search-counter dash-search-counter--complete';
        searchCounter.innerHTML = '✓ 14 رقم';
        searchInput.classList.remove('dash-search-input--error');
        searchInput.style.borderColor = '#10b981';
        if (searchHint) searchHint.style.display = 'none';
      } else {
        searchCounter.className = 'dash-search-counter dash-search-counter--incomplete';
        searchCounter.textContent = `${cleanVal.length} / 14`;
        searchInput.style.borderColor = '';
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      updateNidCounter();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (btnSearch) {
          btnSearch.click();
        }
      }
    });
  }

  if (regionInput) {
    regionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (btnSearch) {
          btnSearch.click();
        }
      }
    });
  }

  // Clear / Reset Search
  function clearSearchResults() {
    if (resultsContainer) resultsContainer.classList.add('dash-search-results--hidden');
    if (searchInput) {
      searchInput.value = '';
      searchInput.classList.remove('dash-search-input--error');
      searchInput.style.borderColor = '';
    }
    if (searchCounter) searchCounter.style.display = 'none';
    if (searchHint) searchHint.style.display = 'none';
    if (regionInput) regionInput.value = '';
    if (charitySelect) charitySelect.value = '';
    if (dashDateFrom) dashDateFrom.value = '';
    if (dashDateTo) dashDateTo.value = '';

    const kpisMount = DOM.qs('#dash-kpis-mount');
    const recentCasesMount = DOM.qs('#dash-recent-cases-mount');
    if (kpisMount) kpisMount.classList.remove('dash-content-hidden');
    if (recentCasesMount) recentCasesMount.classList.remove('dash-content-hidden');

    showToast('تم إلغاء البحث والعودة للوحة التحكم');
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', clearSearchResults);
  }

  // Switch Search Modes Tabs
  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchTabs.forEach(t => t.classList.remove('dash-search-tab--active'));
      tab.classList.add('dash-search-tab--active');

      currentSearchMode = tab.getAttribute('data-search-mode');

      // Reset error states and counter on tab switch
      if (searchCounter) searchCounter.style.display = 'none';
      if (searchHint) searchHint.style.display = 'none';
      if (searchInput) {
        searchInput.classList.remove('dash-search-input--error');
        searchInput.style.borderColor = '';
      }

      // Hide all search input boxes
      if (searchBoxText) searchBoxText.classList.add('dash-search-input-box--hidden');
      if (searchBoxCharity) searchBoxCharity.classList.add('dash-search-input-box--hidden');
      if (searchBoxRegion) searchBoxRegion.classList.add('dash-search-input-box--hidden');
      if (searchBoxDate) searchBoxDate.classList.add('dash-search-input-box--hidden');

      if (currentSearchMode === 'charity') {
        if (searchBoxCharity) searchBoxCharity.classList.remove('dash-search-input-box--hidden');
      } else if (currentSearchMode === 'region') {
        if (searchBoxRegion) searchBoxRegion.classList.remove('dash-search-input-box--hidden');
        if (regionInput) regionInput.focus();
      } else if (currentSearchMode === 'date') {
        if (searchBoxDate) searchBoxDate.classList.remove('dash-search-input-box--hidden');
        if (dashDateFrom) dashDateFrom.focus();
      } else {
        if (searchBoxText) searchBoxText.classList.remove('dash-search-input-box--hidden');

        if (searchInput) {
          if (currentSearchMode === 'nid') {
            searchInput.placeholder = 'أدخل الرقم القومي (14 رقم)...';
            searchInput.maxLength = 14;
            searchInput.value = '';
            updateNidCounter();
          } else if (currentSearchMode === 'phone') {
            searchInput.placeholder = 'أدخل رقم الهاتف المحمول...';
            searchInput.maxLength = 11;
            searchInput.value = '';
          }
          searchInput.focus();
        }
      }

      if (resultsContainer) resultsContainer.classList.add('dash-search-results--hidden');
    });
  });

  // Handle Charity Dropdown Change Event
  if (charitySelect) {
    charitySelect.addEventListener('change', () => {
      const selectedVal = charitySelect.value;
      const selectedText = charitySelect.options[charitySelect.selectedIndex]?.text;
      if (selectedVal && selectedText) {
        executeSearch('charity', selectedText);
      }
    });
  }

  // Handle Manual Search Button Click
  if (btnSearch) {
    btnSearch.addEventListener('click', () => {
      if (currentSearchMode === 'charity') {
        const selectedText = charitySelect ? charitySelect.options[charitySelect.selectedIndex]?.text : '';
        if (!charitySelect || !charitySelect.value) {
          showToast('يرجى اختيار الجمعية من القائمة');
          return;
        }
        executeSearch('charity', selectedText);
      } else if (currentSearchMode === 'region') {
        const query = regionInput ? regionInput.value.trim() : '';
        if (!query) {
          showToast('يرجى إدخال اسم المركز أو القرية');
          return;
        }
        executeSearch('region', query);
      } else if (currentSearchMode === 'date') {
        const dateFrom = dashDateFrom ? dashDateFrom.value : '';
        const dateTo = dashDateTo ? dashDateTo.value : '';
        if (!dateFrom && !dateTo) {
          showToast('يرجى تحديد يوم أو نطاق زمني');
          return;
        }
        executeSearch('date', { from: dateFrom, to: dateTo });
      } else {
        const rawQuery = searchInput ? searchInput.value.trim() : '';
        if (!rawQuery) {
          showToast(currentSearchMode === 'nid' ? 'يرجى إدخال الرقم القومي (14 رقماً)' : 'يرجى إدخال رقم الهاتف');
          if (searchInput) searchInput.focus();
          return;
        }

        if (currentSearchMode === 'nid') {
          const cleanNid = normalizeNumerals(rawQuery);
          // Strict validation: do not search unless exactly 14 digits
          if (cleanNid.length !== 14) {
            showToast(`الرقم القومي يجب أن يتكون من 14 رقماً (تم إدخال ${cleanNid.length} فقط)`);
            if (searchInput) {
              searchInput.classList.add('dash-search-input--error');
              searchInput.focus();
            }
            if (searchHint) {
              searchHint.style.display = 'flex';
              searchHint.innerHTML = `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>يجب أن يتكون الرقم القومي من 14 رقماً بالضبط (متبقي ${14 - cleanNid.length} أرقام)</span>
              `;
            }
            return;
          }
          if (searchHint) searchHint.style.display = 'none';
          if (searchInput) searchInput.classList.remove('dash-search-input--error');
          executeSearch('nid', cleanNid);
        } else {
          executeSearch(currentSearchMode, rawQuery);
        }
      }
    });
  }

  function executeSearch(mode, query) {
    if (!resultsContainer || !resultsList) return;

    // Strict guard for National ID search: NEVER search unless exactly 14 digits
    if (mode === 'nid') {
      const cleanId = normalizeNumerals(query);
      if (cleanId.length !== 14) {
        showToast('الرقم القومي يجب أن يتكون من 14 رقماً');
        return;
      }
      query = cleanId;
    }

    let searchLabel = 'الرقم القومي';
    let matches = [];

    if (mode === 'phone') {
      searchLabel = 'رقم الهاتف';
      matches = MOCK_CASES.filter(c => c.phone && (c.phone.includes(query) || query.includes(c.phone)));
    } else if (mode === 'charity') {
      searchLabel = 'الجمعية';
      matches = MOCK_CASES.filter(c => c.charity && (c.charity.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(c.charity.toLowerCase())));
    } else if (mode === 'region') {
      searchLabel = 'المركز والقرية';
      const clean = query.replace(/(محافظة|مدينة|مركز|قرية)/g, '').trim().toLowerCase();
      matches = MOCK_CASES.filter(c =>
        (c.village && (c.village.toLowerCase().includes(clean) || clean.includes(c.village.toLowerCase()))) ||
        (c.center && (c.center.toLowerCase().includes(clean) || clean.includes(c.center.toLowerCase())))
      );
    } else if (mode === 'date') {
      const { from, to } = query;
      if (from && to && from === to) {
        searchLabel = `تاريخ التسجيل (يوم ${from})`;
      } else if (from && to) {
        searchLabel = `تاريخ التسجيل (من ${from} إلى ${to})`;
      } else if (from) {
        searchLabel = `تاريخ التسجيل (من ${from})`;
      } else {
        searchLabel = `تاريخ التسجيل (حتى ${to})`;
      }
      matches = MOCK_CASES.filter(c => {
        if (!c.registrationDate) return false;
        if (from && c.registrationDate < from) return false;
        if (to && c.registrationDate > to) return false;
        return true;
      });
    } else {
      searchLabel = 'الرقم القومي';
      matches = MOCK_CASES.filter(c => c.nid && normalizeNumerals(c.nid) === query);
    }

    // Hide rest of content on the home page (Scenario 1)
    const kpisMount = DOM.qs('#dash-kpis-mount');
    const recentCasesMount = DOM.qs('#dash-recent-cases-mount');
    if (kpisMount) kpisMount.classList.add('dash-content-hidden');
    if (recentCasesMount) recentCasesMount.classList.add('dash-content-hidden');

    // Update Toolbar Details
    if (resultsTitle) {
      resultsTitle.textContent = `نتائج الاستعلام (${searchLabel})`;
    }
    if (resultsCount) {
      if (matches.length > 0) {
        resultsCount.textContent = `${matches.length} سجل مطابقة`;
      } else {
        resultsCount.textContent = 'لا توجد نتائج';
      }
    }

    // Render Matching Cases or Clean Empty State
    if (matches.length > 0) {
      resultsList.innerHTML = matches.map(c => `
        <div class="dash-case-row dash-search-case-card">
          <div class="dash-case-row__user">
            <div class="dash-case-row__avatar ${getAvatarColor(c.status)}">${getInitials(c.name)}</div>
            <div class="dash-case-row__meta">
              <span class="dash-case-row__name">${DOM.escapeHTML(c.name)}</span>
              <span class="dash-case-row__nid">الرقم القومي: ${DOM.escapeHTML(c.nid)}</span>
            </div>
          </div>

          <div class="dash-case-row__details">
            <div class="dash-case-row__info-item">
              <span class="info-label">الجمعية:</span>
              <span class="info-val">${DOM.escapeHTML(c.charity)}</span>
            </div>
            <div class="dash-case-row__info-item">
              <span class="info-label">الموقع:</span>
              <span class="info-val">${DOM.escapeHTML(c.center)} — ${DOM.escapeHTML(c.village)}</span>
            </div>
            <div class="dash-case-row__info-item">
              <span class="info-label">الهاتف:</span>
              <span class="info-val">${DOM.escapeHTML(c.phone)}</span>
            </div>
            ${mode === 'date' ? `
            <div class="dash-case-row__info-item">
              <span class="info-label">تاريخ التسجيل:</span>
              <span class="info-val">${DOM.escapeHTML(c.registrationDate || '—')}</span>
            </div>
            ` : ''}
          </div>

          <div class="dash-case-row__status">
            <span class="dash-status-pill ${c.statusClass}">${DOM.escapeHTML(c.statusLabel)}</span>
            <button type="button" class="btn btn--primary btn--sm btn-open-search-case" data-case-id="${DOM.escapeHTML(c.id)}">
              عرض الملف والتقرير
            </button>
          </div>
        </div>
      `).join('');
    } else {
      resultsList.innerHTML = `
        <div class="dash-search-empty-state">
          <div class="dash-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <div class="dash-empty-content">
            <h4 class="dash-empty-title">لا توجد سجلات مطابقة</h4>
            <p class="dash-empty-desc">لم يتم العثور على أي حالة مسجلة تطابق استعلامك الحالي.</p>
          </div>
          ${mode === 'nid' ? `
          <button type="button" class="btn btn--primary btn--sm dash-btn-add-case" data-view-target="personal-data" data-prefill-nid="${DOM.escapeHTML(query)}">
            تسجيل حالة جديدة بالرقم القومي: ${DOM.escapeHTML(query)}
          </button>
          ` : `
          <button type="button" class="btn btn--primary btn--sm dash-btn-add-case" data-view-target="personal-data">
            تسجيل حالة جديدة
          </button>
          `}
        </div>
      `;
    }

    resultsContainer.classList.remove('dash-search-results--hidden');
    showToast('تم تنفيذ الاستعلام بنجاح');

    // Attach click handlers to open case details
    resultsList.querySelectorAll('.btn-open-search-case').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const caseId = btn.getAttribute('data-case-id');
        if (caseId && window.openCaseDetailsPage) {
          window.openCaseDetailsPage(caseId);
        }
      });
    });

    // Attach click handlers for add case button
    resultsList.querySelectorAll('.dash-btn-add-case').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const prefillNid = btn.getAttribute('data-prefill-nid');
        if (window.switchView) {
          window.switchView('personal-data');
        }
        // Prefill national ID after view switch (use setTimeout to ensure DOM is ready)
        if (prefillNid) {
          setTimeout(() => {
            const nidInput = DOM.qs('#national-id');
            if (nidInput) {
              nidInput.value = prefillNid;
              nidInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }, 100);
        }
      });
    });

    // Scroll smoothly to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Expandable / Collapsible Recent Cases Card Toggle
  const btnToggleRecent = DOM.qs('#btn-toggle-recent');
  const recentCard = DOM.qs('#dash-recent-card');

  if (btnToggleRecent && recentCard) {
    btnToggleRecent.addEventListener('click', () => {
      const isCollapsed = recentCard.classList.contains('dash-recent-section--collapsed');

      if (isCollapsed) {
        recentCard.classList.remove('dash-recent-section--expanded');
        recentCard.classList.add('dash-recent-section--expanded');
        btnToggleRecent.setAttribute('aria-expanded', 'true');
        showToast('تم توسيع قائمة أحدث الحالات');
      } else {
        recentCard.classList.remove('dash-recent-section--expanded');
        recentCard.classList.add('dash-recent-section--collapsed');
        btnToggleRecent.setAttribute('aria-expanded', 'false');
        showToast('تم طي قائمة أحدث الحالات');
      }
    });
  }
}
