/* --------------------------------------------------------------------------
   STATE DATA MANAGEMENT PAGE VIEW COMPONENT («إدارة بيانات الحالة»)
   Full Page View Component with glass card layout, live search, 10-step filters,
   and Option CRUD (Add / Edit / Delete options) for all protocol dropdowns.
   -------------------------------------------------------------------------- */
import { DOM } from '../../utils/dom.js';
import { showToast } from '../../utils/toast.js';
import { store } from '../../state/store.js';
import { EventBus, EVENTS } from '../../core/event-bus.js';

export function initStateDataManagement() {
  const viewContainer = DOM.qs('#view-state-mgmt');
  const gridContainer = DOM.qs('#state-mgmt-grid');
  const searchInput = DOM.qs('#state-mgmt-search');
  const tabsContainer = DOM.qs('#state-mgmt-tabs');

  if (!viewContainer || !gridContainer) return;

  let activeStepFilter = 'all';

  const stepTitlesMap = {
    '1': 'الأساسية والأفراد',
    '2': 'المرفقات',
    '3': 'السكن',
    '4': 'المرافق والتجهيزات',
    '5': 'الحيازة الزراعية',
    '6': 'الدخل والمصروفات',
    '7': 'التصنيف والأولوية',
    '8': 'الاحتياجات',
    '9': 'التقييمات وتوصية الباحث',
    '10': 'الدعم والتوصيات'
  };

  /**
   * Render manageable Regions, Centers & Villages Glass Card
   */
  function renderLocationsCard(searchTerm) {
    const locsData = store.beniSuefLocations || {};
    const centers = Object.keys(locsData);

    let totalVillages = 0;
    centers.forEach(c => totalVillages += (locsData[c] || []).length);

    const card = document.createElement('div');
    card.className = 'glass-card state-page-field-card';
    card.style.gridColumn = '1 / -1';
    card.style.padding = '22px 24px';
    card.style.marginBottom = '20px';
    card.style.border = '1px solid rgba(16, 185, 129, 0.3)';
    card.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.65), rgba(240, 253, 244, 0.5))';

    let centersHtml = '';
    let visibleCentersCount = 0;

    centers.forEach(center => {
      const villages = locsData[center] || [];

      if (searchTerm) {
        const matchCenter = center.toLowerCase().includes(searchTerm);
        const matchVillage = villages.some(v => v.toLowerCase().includes(searchTerm));
        if (!matchCenter && !matchVillage) return;
      }

      visibleCentersCount++;

      let villagesHtml = villages.map(village => {
        return `
          <span class="location-village-chip" data-center="${DOM.escapeHTML(center)}" data-village="${DOM.escapeHTML(village)}">
            <span>📍 ${DOM.escapeHTML(village)}</span>
            <button type="button" class="btn-location-village-edit" title="تعديل اسم القرية">✏️</button>
            <button type="button" class="btn-location-village-delete" title="حذف القرية">🗑️</button>
          </span>
        `;
      }).join('');

      centersHtml += `
        <div class="location-center-box" data-center="${DOM.escapeHTML(center)}">
          <div class="location-center-header">
            <div class="location-center-title-group">
              <span class="location-center-icon">🏢</span>
              <strong class="location-center-name">مركز ${DOM.escapeHTML(center)}</strong>
              <span class="badge badge--success" style="font-size: 11px;">${villages.length} قرية/منطقة</span>
            </div>
            <div class="location-center-actions">
              <button type="button" class="btn btn--secondary btn--sm btn-add-village-to-center" data-center="${DOM.escapeHTML(center)}">
                <span>➕ إضافة قرية</span>
              </button>
              <button type="button" class="btn-opt-action btn-center-edit" data-center="${DOM.escapeHTML(center)}" title="تعديل اسم المركز">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button type="button" class="btn-opt-action btn-center-delete" data-center="${DOM.escapeHTML(center)}" title="حذف المركز بالكامل">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="location-villages-grid">
            ${villagesHtml || '<span style="font-size: 12px; color: #94a3b8; font-style: italic;">لا توجد قرى مسجلة بهذا المركز</span>'}
          </div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="glass-card__header" style="justify-content: space-between; flex-wrap: wrap; gap: 14px; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid rgba(16, 185, 129, 0.25);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(16, 185, 129, 0.15); color: #059669; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">📍</div>
          <div>
            <h3 class="glass-card__title" style="font-size: 17px; font-weight: 800; color: #065f46; margin: 0;">إدارة التقسيم الجغرافي للمراكز والقرى (محافظة بني سويف)</h3>
            <p style="font-size: 12px; color: #047857; margin: 3px 0 0; font-weight: 600;">تحكم شامل بالمراكز والقرى — تتحدث البيانات تلقائياً وفورياً في كافة القوائم ومحركات البحث بالمنظومة</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span class="badge badge--success" style="font-size: 12px; padding: 6px 12px;">${centers.length} مراكز | ${totalVillages} قرية</span>
          <button type="button" class="btn btn--primary btn--sm" id="btn-add-new-center-action">
            <span>➕ إضافة مركز جديد</span>
          </button>
          <button type="button" class="btn btn--secondary btn--sm" id="btn-reset-locations-action" title="استعادة التقسيم الجغرافي الافتراضي من الكود">
            <span>🔄 استعادة التقسيم الافتراضي</span>
          </button>
        </div>
      </div>

      <div class="location-centers-container" style="display: flex; flex-direction: column; gap: 16px;">
        ${centersHtml || '<div style="text-align: center; padding: 40px; color: #64748b;">لا توجد مراكز مطابقة لنتيجة البحث</div>'}
      </div>
    `;

    // Click Event Handler
    card.addEventListener('click', (e) => {
      if (e.target.closest('#btn-add-new-center-action')) {
        const centerName = prompt('أدخل اسم المركز الجديد المراد إضافته لمحافظة بني سويف:');
        if (centerName && centerName.trim()) {
          const clean = centerName.trim();
          store.addCenter(clean);
          showToast(`تمت إضافة مركز "${clean}" بنجاح 📍`);
          renderPageView();
        }
        return;
      }

      if (e.target.closest('#btn-reset-locations-action')) {
        if (confirm('هل أنت متأكد من استعادة التقسيم الجغرافي الافتراضي لكافة المراكز والقرى من الكود؟')) {
          store.resetBeniSuefLocations();
          showToast('تمت استعادة التقسيم الجغرافي الافتراضي لبني سويف 🔄');
          renderPageView();
        }
        return;
      }

      const btnAddVillage = e.target.closest('.btn-add-village-to-center');
      if (btnAddVillage) {
        const center = btnAddVillage.dataset.center;
        const villageName = prompt(`إضافة قرية جديدة لـ (${center}):`);
        if (villageName && villageName.trim()) {
          const clean = villageName.trim();
          store.addVillage(center, clean);
          showToast(`تمت إضافة قرية "${clean}" لـ ${center} 📍`);
          renderPageView();
        }
        return;
      }

      const btnEditCenter = e.target.closest('.btn-center-edit');
      if (btnEditCenter) {
        const oldCenter = btnEditCenter.dataset.center;
        const newCenter = prompt(`تعديل اسم مركز (${oldCenter}):`, oldCenter);
        if (newCenter && newCenter.trim() && newCenter.trim() !== oldCenter) {
          const clean = newCenter.trim();
          store.updateCenter(oldCenter, clean);
          showToast(`تم تعديل اسم المركز إلى "${clean}" بنجاح ✨`);
          renderPageView();
        }
        return;
      }

      const btnDeleteCenter = e.target.closest('.btn-center-delete');
      if (btnDeleteCenter) {
        const center = btnDeleteCenter.dataset.center;
        if (confirm(`هل أنت متأكد من حذف مركز (${center}) بكافة القرى التابعة له؟`)) {
          store.deleteCenter(center);
          showToast(`تم حذف مركز (${center}) 🗑️`);
          renderPageView();
        }
        return;
      }

      const btnEditVillage = e.target.closest('.btn-location-village-edit');
      if (btnEditVillage) {
        const chip = btnEditVillage.closest('.location-village-chip');
        const center = chip.dataset.center;
        const oldVillage = chip.dataset.village;

        const newVillage = prompt(`تعديل اسم قرية (${oldVillage}) بـمركز ${center}:`, oldVillage);
        if (newVillage && newVillage.trim() && newVillage.trim() !== oldVillage) {
          const clean = newVillage.trim();
          store.updateVillage(center, oldVillage, clean);
          showToast(`تم تحديث اسم القرية إلى "${clean}" ✨`);
          renderPageView();
        }
        return;
      }

      const btnDeleteVillage = e.target.closest('.btn-location-village-delete');
      if (btnDeleteVillage) {
        const chip = btnDeleteVillage.closest('.location-village-chip');
        const center = chip.dataset.center;
        const village = chip.dataset.village;

        if (confirm(`هل أنت متأكد من حذف قرية (${village}) من مركز ${center}؟`)) {
          store.deleteVillage(center, village);
          showToast(`تم حذف قرية (${village}) 🗑️`);
          renderPageView();
        }
        return;
      }
    });

    return { card, visibleCentersCount };
  }

  /**
   * Collect all <select> elements from personal data view protocol
   */
  function collectProtocolDropdowns() {
    const personalDataView = DOM.qs('#view-personal-data');
    if (!personalDataView) return [];

    const selects = Array.from(personalDataView.querySelectorAll('select'));
    const items = [];

    selects.forEach(select => {
      const stepPane = select.closest('.step-pane');
      let stepNum = '1';
      if (stepPane && stepPane.id) {
        const match = stepPane.id.match(/\d+/);
        if (match) stepNum = match[0];
      }

      let labelText = '';
      if (select.id) {
        const label = personalDataView.querySelector(`label[for="${select.id}"]`);
        if (label) {
          const spanText = label.querySelector('span:not(.form-label__required)');
          labelText = spanText ? spanText.textContent.trim() : label.textContent.replace('*', '').trim();
        }
      }

      if (!labelText) {
        const formGroup = select.closest('.form-group');
        if (formGroup) {
          const label = formGroup.querySelector('.form-label');
          if (label) {
            const spanText = label.querySelector('span:not(.form-label__required)');
            labelText = spanText ? spanText.textContent.trim() : label.textContent.replace('*', '').trim();
          }
        }
      }

      if (!labelText) labelText = select.id || 'حقل منسدل';

      const isNoOther = select.dataset.noOther === 'true' || select.id === 'gender' || select.id === 'religion';

      items.push({
        element: select,
        id: select.id || `select-${Math.random().toString(36).substring(2, 7)}`,
        label: labelText,
        stepNum: stepNum,
        stepTitle: stepTitlesMap[stepNum] || `الخطوة ${stepNum}`,
        value: select.value,
        isNoOther: isNoOther,
        options: Array.from(select.options).map(opt => ({
          value: opt.value,
          text: opt.textContent.trim(),
          disabled: opt.disabled,
          selected: opt.selected,
          isOther: opt.dataset.isOther === 'true' || opt.value === 'أخرى'
        }))
      });
    });

    return items;
  }

  /**
   * Render dynamic field control cards inside the Page View grid
   */
  function renderPageView() {
    gridContainer.innerHTML = '';
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visibleCount = 0;

    // Render Locations Card when step filter is 'all' or 'locations'
    if (activeStepFilter === 'all' || activeStepFilter === 'locations') {
      const { card, visibleCentersCount } = renderLocationsCard(searchTerm);
      if (visibleCentersCount > 0 || activeStepFilter === 'locations') {
        gridContainer.appendChild(card);
        visibleCount++;
      }
    }

    // If locations tab is active exclusively, skip protocol dropdowns
    if (activeStepFilter === 'locations') {
      return;
    }

    const items = collectProtocolDropdowns();

    items.forEach(item => {
      if (activeStepFilter !== 'all' && item.stepNum !== activeStepFilter) return;

      if (searchTerm) {
        const matchLabel = item.label.toLowerCase().includes(searchTerm);
        const matchId = item.id.toLowerCase().includes(searchTerm);
        const matchStep = item.stepTitle.toLowerCase().includes(searchTerm);
        const matchOptions = item.options.some(o => o.text.toLowerCase().includes(searchTerm));
        if (!matchLabel && !matchId && !matchStep && !matchOptions) return;
      }

      visibleCount++;

      const card = document.createElement('div');
      card.className = 'glass-card state-page-field-card';
      card.style.padding = '18px 20px';
      card.style.marginBottom = '0';
      card.dataset.step = item.stepNum;
      card.dataset.selectId = item.id;

      // Generate Options List HTML with Edit/Delete Buttons
      let optionsListHtml = '';
      item.options.forEach((opt) => {
        if (!opt.value && opt.disabled) return; // Skip empty placeholder

        optionsListHtml += `
          <div class="option-item-row" data-option-val="${DOM.escapeHTML(opt.value)}">
            <span class="option-item-text">${DOM.escapeHTML(opt.text)}</span>
            <div class="option-item-actions">
              <button type="button" class="btn-opt-action btn-opt-edit" title="تعديل اسم الخيار">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button type="button" class="btn-opt-action btn-opt-delete" title="حذف الخيار">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        `;
      });

      // Generate Select Options
      let selectOptsHtml = '';
      item.options.forEach(opt => {
        const isSel = item.element.value === opt.value;
        selectOptsHtml += `<option value="${DOM.escapeHTML(opt.value)}" ${opt.disabled ? 'disabled' : ''} ${isSel ? 'selected' : ''}>${DOM.escapeHTML(opt.text)}</option>`;
      });

      card.innerHTML = `
        <div class="glass-card__header" style="padding-bottom: 10px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0, 0, 0, 0.06);">
          <h3 class="glass-card__title" style="font-size: 15px; font-weight: 800; margin: 0; color: #0f172a;">${DOM.escapeHTML(item.label)}</h3>
        </div>

        <div style="display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
          <!-- Current Active Selection -->
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" style="font-size: 11.5px; font-weight: 700; color: #64748b; margin-bottom: 6px;">اختيار القيمة الحالية في البروتوكول:</label>
            <div class="form-select-wrapper">
              <select class="form-select page-card-select" data-target-id="${DOM.escapeHTML(item.id)}" style="font-size: 13px; padding: 8px 34px 8px 12px;">
                ${selectOptsHtml}
              </select>
              <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          <!-- Options CRUD Container -->
          <div class="options-crud-section">
            <div class="options-crud-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 11.5px; font-weight: 800; color: #334155;">إدارة اختيارات القائمة (${item.options.filter(o => o.value).length})</span>
              ${item.isNoOther ? '<span class="badge badge--neutral" style="font-size: 10px; padding: 2px 6px;">خيارات ثابته</span>' : ''}
            </div>
            <div class="options-list-container">
              ${optionsListHtml || '<div style="font-size: 12px; color: #94a3b8; text-align: center; padding: 10px;">لا توجد اختيارات مخصصة بعد</div>'}
            </div>

            <!-- Add Option Form -->
            <div class="add-option-row">
              <input type="text" class="form-input add-opt-input" placeholder="+ إضافة خيار جديد للقائمة..." style="padding: 7px 10px; font-size: 12px;">
              <button type="button" class="btn btn--primary btn-add-opt" style="padding: 7px 14px; font-size: 12px; font-weight: 700;">إضافة</button>
            </div>
          </div>
        </div>
      `;

      // 1. Bind Selection Change
      const pageSelect = card.querySelector('.page-card-select');
      pageSelect.addEventListener('change', () => {
        const val = pageSelect.value;
        item.element.value = val;
        item.element.dispatchEvent(new Event('change', { bubbles: true }));
      });

      // 2. Bind Option Delete Action
      card.querySelectorAll('.btn-opt-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const row = btn.closest('.option-item-row');
          const optVal = row.dataset.optionVal;

          const targetOpt = Array.from(item.element.options).find(o => o.value === optVal);
          if (targetOpt) {
            targetOpt.remove();
            item.element.dispatchEvent(new Event('change', { bubbles: true }));
            showToast(`تم حذف الخيار "${optVal}" من القائمة 🗑️`);
            renderPageView();
          }
        });
      });

      // 3. Bind Option Edit Action
      card.querySelectorAll('.btn-opt-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const row = btn.closest('.option-item-row');
          const optVal = row.dataset.optionVal;
          const targetOpt = Array.from(item.element.options).find(o => o.value === optVal);

          if (targetOpt) {
            const newName = prompt(`تعديل اسم الخيار "${optVal}":`, optVal);
            if (newName && newName.trim() && newName.trim() !== optVal) {
              const cleanName = newName.trim();
              targetOpt.value = cleanName;
              targetOpt.textContent = cleanName;
              item.element.dispatchEvent(new Event('change', { bubbles: true }));
              showToast(`تم تعديل اسم الخيار إلى "${cleanName}" ✏️`);
              renderPageView();
            }
          }
        });
      });

      // 4. Bind Add New Option Action
      const addOptInput = card.querySelector('.add-opt-input');
      const addOptBtn = card.querySelector('.btn-add-opt');

      function executeAddOption() {
        const newOptVal = addOptInput.value.trim();
        if (!newOptVal) {
          showToast('يرجى كتابة اسم الخيار المراد إضافته');
          addOptInput.focus();
          return;
        }

        const exists = Array.from(item.element.options).some(o => o.value === newOptVal);
        if (exists) {
          showToast('هذا الخيار موجود بالفعل في القائمة');
          return;
        }

        const newOpt = document.createElement('option');
        newOpt.value = newOptVal;
        newOpt.textContent = newOptVal;

        const otherOpt = Array.from(item.element.options).find(o => o.dataset.isOther === 'true' || o.value === 'أخرى');
        if (otherOpt) {
          item.element.insertBefore(newOpt, otherOpt);
        } else {
          item.element.appendChild(newOpt);
        }

        item.element.value = newOptVal;
        item.element.dispatchEvent(new Event('change', { bubbles: true }));
        showToast(`تمت إضافة الخيار الجديد "${newOptVal}" بنجاح ➕`);
        renderPageView();
      }

      addOptBtn.addEventListener('click', executeAddOption);
      addOptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeAddOption();
        }
      });

      gridContainer.appendChild(card);
    });

    if (visibleCount === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-secondary);">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <p style="font-weight: 700; font-size: 16px;">لا توجد حقول منسدلة تطابق كلمات البحث أو التصفية</p>
        </div>
      `;
    }
  }

  // Observer to re-render when switching to this view
  const observer = new MutationObserver(() => {
    if (!viewContainer.classList.contains('page-view--hidden')) {
      renderPageView();
    }
  });

  observer.observe(viewContainer, { attributes: true, attributeFilter: ['class'] });

  if (searchInput) searchInput.addEventListener('input', renderPageView);

  if (tabsContainer) {
    tabsContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.state-mgmt-tab');
      if (!tab) return;

      tabsContainer.querySelectorAll('.state-mgmt-tab').forEach(t => t.classList.remove('state-mgmt-tab--active'));
      tab.classList.add('state-mgmt-tab--active');

      activeStepFilter = tab.dataset.stepFilter || 'all';
      renderPageView();
    });
  }

  // Listen for locations changes to keep page view updated
  EventBus.on(EVENTS.LOCATIONS_UPDATED, () => renderPageView());

  // Initial Render if active
  renderPageView();
}
