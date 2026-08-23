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
  const roleLabel = currentUser.roleLabel || 'مدير النظام';
  const greeting = getTimeGreeting();

  if (greetingEl) {
    greetingEl.textContent = greeting;
  }
  if (nameEl) {
    nameEl.textContent = currentUserName;
  }
  if (!greetingEl && heroTitle) {
    heroTitle.innerHTML = `<span class="dash-hero-card__greeting">${greeting}</span>، <span class="dash-hero-card__name">${currentUserName}</span> 👋`;
  }
  if (heroDesc) {
    heroDesc.innerHTML = `مرحباً بك في لوحة تحكم منظومة النهضة — الدور الحالي: <strong style="color: var(--color-primary); padding: 2px 8px; background: rgba(37,99,235,0.1); border-radius: 6px;">${roleLabel}</strong> — متابعة البيانات والحالات ومؤشرات الأداء اليومية`;
  }
}

export function updateDashboardKPIs() {
  const kpisGrid = DOM.qs('.dash-stats-grid');
  const kpisMount = DOM.qs('#dash-kpis-mount');
  const searchMount = DOM.qs('#dash-search-mount');
  if (!kpisGrid) return;

  const currentUser = store.currentUser || {};
  const isReviewer = currentUser.roleCode === 'reviewer' || currentUser.roleLabel === 'مراجع' || currentUser.email === 'hassanalaa@gmail.com';

  // Dynamic layout re-ordering based on user role
  if (kpisMount && searchMount && searchMount.parentNode) {
    if (isReviewer) {
      // Reviewer role ONLY: 4 stat cards ABOVE search bar
      if (searchMount.previousElementSibling !== kpisMount) {
        searchMount.parentNode.insertBefore(kpisMount, searchMount);
      }
    } else {
      // Non-reviewer roles: 4 stat cards BELOW search bar
      if (searchMount.nextElementSibling !== kpisMount) {
        searchMount.parentNode.insertBefore(kpisMount, searchMount.nextSibling);
      }
    }
  }

  if (isReviewer) {
    kpisGrid.innerHTML = `
      <!-- Card 1: إجمالي الحالات -->
      <div class="glass-card dash-stat-card" data-cases-target="all" style="cursor: pointer;" title="انتقال لسجل كافة الحالات">
        <div class="glass-card__icon" style="background: rgba(37, 99, 235, 0.15); color: #2563eb;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="dash-stat-card__content">
          <span class="dash-stat-card__title">إجمالي الحالات</span>
          <div class="dash-stat-card__val-row" style="display: flex; align-items: center; margin-top: 4px;">
            <span class="dash-stat-card__val">1,450</span>
          </div>
        </div>
      </div>

      <!-- Card 2: الحالات قيد المراجعة -->
      <div class="glass-card dash-stat-card" data-cases-target="pending" style="border: 1px solid rgba(217, 119, 6, 0.3); cursor: pointer;" title="عرض الحالات قيد المراجعة">
        <div class="glass-card__icon" style="background: rgba(217, 119, 6, 0.15); color: #d97706;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="dash-stat-card__content">
          <span class="dash-stat-card__title">الحالات قيد المراجعة</span>
          <div class="dash-stat-card__val-row" style="display: flex; align-items: center; margin-top: 4px;">
            <span class="dash-stat-card__val" style="color: #b45309;">156</span>
          </div>
        </div>
      </div>

      <!-- Card 3: الحالات المقبولة -->
      <div class="glass-card dash-stat-card" data-cases-target="accepted" style="border: 1px solid rgba(16, 185, 129, 0.3); cursor: pointer;" title="عرض الحالات المقبولة">
        <div class="glass-card__icon" style="background: rgba(16, 185, 129, 0.15); color: #059669;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="dash-stat-card__content">
          <span class="dash-stat-card__title">الحالات المقبولة</span>
          <div class="dash-stat-card__val-row" style="display: flex; align-items: center; margin-top: 4px;">
            <span class="dash-stat-card__val" style="color: #047857;">980</span>
          </div>
        </div>
      </div>

      <!-- Card 4: الحالات المرفوضة -->
      <div class="glass-card dash-stat-card" data-cases-target="rejected" style="border: 1px solid rgba(225, 29, 72, 0.3); cursor: pointer;" title="عرض الحالات المرفوضة">
        <div class="glass-card__icon" style="background: rgba(225, 29, 72, 0.15); color: #e11d48;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <div class="dash-stat-card__content">
          <span class="dash-stat-card__title">الحالات المرفوضة</span>
          <div class="dash-stat-card__val-row" style="display: flex; align-items: center; margin-top: 4px;">
            <span class="dash-stat-card__val" style="color: #be123c;">314</span>
          </div>
        </div>
      </div>
    `;
  } else {
    kpisGrid.innerHTML = `
      <!-- Card 1: حالات اليوم -->
      <div class="glass-card dash-stat-card" data-cases-target="all" style="cursor: pointer;">
        <div class="glass-card__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </div>
        <div class="dash-stat-card__content">
          <span class="dash-stat-card__title">حالات اليوم</span>
          <div class="dash-stat-card__val-row" style="display: flex; align-items: center; margin-top: 4px;">
            <span class="dash-stat-card__val">24</span>
          </div>
        </div>
      </div>

      <!-- Card 2: إجمالي الحالات -->
      <div class="glass-card dash-stat-card" data-cases-target="all" style="cursor: pointer;">
        <div class="glass-card__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="dash-stat-card__content">
          <span class="dash-stat-card__title">إجمالي الحالات</span>
          <div class="dash-stat-card__val-row" style="display: flex; align-items: center; margin-top: 4px;">
            <span class="dash-stat-card__val">1,450</span>
          </div>
        </div>
      </div>

      <!-- Card 3: الجمعيات الشريكة -->
      <div class="glass-card dash-stat-card">
        <div class="glass-card__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M3 21h18"></path>
            <path d="M5 21V7l8-4v18"></path>
            <path d="M19 21V11l-6-3"></path>
          </svg>
        </div>
        <div class="dash-stat-card__content">
          <span class="dash-stat-card__title">الجمعيات المعتمدة</span>
          <div class="dash-stat-card__val-row" style="display: flex; align-items: center; margin-top: 4px;">
            <span class="dash-stat-card__val">38</span>
          </div>
        </div>
      </div>

      <!-- Card 4: قيد المراجعة -->
      <div class="glass-card dash-stat-card" data-cases-target="pending" style="cursor: pointer;">
        <div class="glass-card__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="dash-stat-card__content">
          <span class="dash-stat-card__title">قيد المراجعة</span>
          <div class="dash-stat-card__val-row" style="display: flex; align-items: center; margin-top: 4px;">
            <span class="dash-stat-card__val">156</span>
          </div>
        </div>
      </div>
    `;
  }

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

export function initDashboardInteractivity() {
  // Update Live Arabic Date, Dynamic Time-Based Greeting & KPIs
  updateDashboardHero();
  updateDashboardKPIs();

  // Listen to user and view changes to keep hero & KPIs updated
  EventBus.on(EVENTS.USER_CHANGED, () => {
    updateDashboardHero();
    updateDashboardKPIs();
  });
  EventBus.on(EVENTS.VIEW_CHANGED, (view) => {
    if (view === 'dashboard') {
      updateDashboardHero();
      updateDashboardKPIs();
    }
  });

  // Multi-Criteria Search Elements
  const searchTabs = DOM.qsa('.dash-search-tab');
  const searchInput = DOM.qs('#dash-search-input');
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
  const resultsContent = DOM.qs('#dash-results-content');

  let currentSearchMode = 'nid';

  // Dynamic Charity Select Sync
  function updateDashboardCharitySelect() {
    if (!charitySelect) return;
    const charities = store.charities;
    const currentVal = charitySelect.value;
    
    charitySelect.innerHTML = '<option value="" selected>-- اختر الجمعية لعرض الحالات والبيانات --</option>' +
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
        village: '',
        icon: '🏛️'
      });

      // 2. Centers and Villages Options
      Object.keys(beniSuefData).forEach(center => {
        options.push({
          text: `مدينة / مركز ${center}`,
          type: 'center',
          center: center,
          village: '',
          icon: '🏢'
        });

        (beniSuefData[center] || []).forEach(village => {
          options.push({
            text: `قرية ${village} (مركز ${center})`,
            type: 'village',
            center: center,
            village: village,
            icon: '📍'
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
          <span>${opt.icon} ${DOM.escapeHTML(opt.text)}</span>
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

  // Switch Search Modes Tabs
  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchTabs.forEach(t => t.classList.remove('dash-search-tab--active'));
      tab.classList.add('dash-search-tab--active');

      currentSearchMode = tab.getAttribute('data-search-mode');

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
            searchInput.placeholder = 'ادخل الرقم القومي المكون من 14 رقم للبحث السريع...';
            searchInput.maxLength = 14;
            searchInput.value = '';
          } else if (currentSearchMode === 'phone') {
            searchInput.placeholder = 'ادخل رقم التليفون المحمول (مثال: 010...)...';
            searchInput.maxLength = 11;
            searchInput.value = '';
          }
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
          showToast('الرجاء اختيار جمعية من القائمة المنسدلة 🏢');
          return;
        }
        executeSearch('charity', selectedText);
      } else if (currentSearchMode === 'region') {
        const query = regionInput ? regionInput.value.trim() : '';
        if (!query) {
          showToast('الرجاء اختيار أو كتابة اسم المنطقة/القرية/المحافظة للبحث 📍');
          return;
        }
        executeSearch('region', query);
      } else if (currentSearchMode === 'date') {
        const dateFrom = dashDateFrom ? dashDateFrom.value : '';
        const dateTo = dashDateTo ? dashDateTo.value : '';
        if (!dateFrom && !dateTo) {
          showToast('الرجاء تحديد تاريخ البداية أو تاريخ النهاية لخصائص النطاق الزمني 📅');
          return;
        }
        let rangeStr = '';
        if (dateFrom && dateTo) rangeStr = `الفترة من ${dateFrom} إلى ${dateTo}`;
        else if (dateFrom) rangeStr = `من تاريخ ${dateFrom}`;
        else rangeStr = `حتى تاريخ ${dateTo}`;
        executeSearch('date', rangeStr);
      } else {
        const query = searchInput ? searchInput.value.trim() : '';
        if (!query) {
          showToast('الرجاء إدخال رقم قومي أو تليفون للبحث 🔍');
          return;
        }
        executeSearch(currentSearchMode, query);
      }
    });
  }

  function executeSearch(mode, query) {
    if (!resultsContainer || !resultsContent) return;

    let searchLabel = 'الرقم القومي';
    if (mode === 'phone') searchLabel = 'رقم التليفون';
    else if (mode === 'charity') searchLabel = 'الجمعية';
    else if (mode === 'region') searchLabel = 'المنطقة والقرية';
    else if (mode === 'date') searchLabel = 'تاريخ البحث';

    resultsContent.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
        <div>
          <span style="font-size: var(--font-size-xs); color: var(--text-secondary);">نتائج الاستعلام عن (${searchLabel}): <strong>${DOM.escapeHTML(query)}</strong></span>
          <h4 style="font-size: var(--font-size-md); font-weight: 800; color: #000000; margin: 4px 0 0;">تم العثور على السجلات والبيانات التابعة للبحث</h4>
        </div>
        <button type="button" class="btn btn--primary btn--sm" data-view-target="personal-data">عرض الملفات »</button>
      </div>
    `;

    resultsContainer.classList.remove('dash-search-results--hidden');
    showToast(`تم تنفيذ البحث بـ (${searchLabel}) بنجاح ⚡`);

    // Re-bind dynamic navigation buttons inside search result box
    resultsContainer.querySelectorAll('[data-view-target="personal-data"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const activeSublink = DOM.qs('.sidebar-sublink[data-view-target="personal-data"]');
        if (activeSublink) activeSublink.click();
      });
    });
  }

  // Handle Recent Cases View Details Clicks
  DOM.qsa('.btn-open-recent-case').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const caseId = btn.getAttribute('data-case-id');
      if (caseId && window.openCaseDetailsPage) {
        window.openCaseDetailsPage(caseId);
      }
    });
  });

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
        showToast('تم توسيع أحدث الحالات لعرض كامل البيانات 📂');
      } else {
        recentCard.classList.remove('dash-recent-section--expanded');
        recentCard.classList.add('dash-recent-section--collapsed');
        btnToggleRecent.setAttribute('aria-expanded', 'false');
        showToast('تم طي كارت أحدث الحالات (الوضع المصغر) 📁');
      }
    });
  }
}
