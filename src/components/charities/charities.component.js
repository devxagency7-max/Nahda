/* --------------------------------------------------------------------------
   CHARITIES MANAGEMENT COMPONENT CONTROLLER
   Manages charity CRUD operations, cascading center/village dropdowns
   sourced from Beni Suef CSV data, search & filtering, and dynamic
   synchronization across the system.
   -------------------------------------------------------------------------- */
import { store } from '../../state/store.js';
import { DataService } from '../../services/data.js';
import { DOM } from '../../utils/dom.js';
import { showToast } from '../../utils/toast.js';
import { EventBus, EVENTS } from '../../core/event-bus.js';

export function initCharitiesManager() {
  // DOM Elements
  const form = DOM.qs('#charity-form');
  const editIdInput = DOM.qs('#charity-edit-id');
  const nameInput = DOM.qs('#charity-name-input');
  const centerSelect = DOM.qs('#charity-center-select');
  const centerOtherContainer = DOM.qs('#charity-center-other-container');
  const centerOtherInput = DOM.qs('#charity-center-other-input');
  const btnResetCenterSelect = DOM.qs('#btn-reset-center-select');

  const villageSelect = DOM.qs('#charity-village-select');
  const villageOtherContainer = DOM.qs('#charity-village-other-container');
  const villageOtherInput = DOM.qs('#charity-village-other-input');
  const btnResetVillageSelect = DOM.qs('#btn-reset-village-select');

  const addressInput = DOM.qs('#charity-address-input');
  const phoneInput = DOM.qs('#charity-phone-input');

  const formTitle = DOM.qs('#charity-form-title');
  const formBadge = DOM.qs('#charity-form-badge');
  const submitText = DOM.qs('#charity-submit-text');
  const btnCancelEdit = DOM.qs('#btn-cancel-edit-charity');

  const searchInput = DOM.qs('#charity-search-input');
  const centerPillsContainer = DOM.qs('#charity-center-pills');
  const tableBody = DOM.qs('#charities-table-body');
  const emptyState = DOM.qs('#charities-empty-state');
  const statTotal = DOM.qs('#stat-total-charities');
  const btnExport = DOM.qs('#btn-export-charities');

  let activeCenterFilter = 'all';
  let searchQuery = '';

  // 1. Initialize Cascading Center & Village Dropdowns from CSV Data
  initCenterAndVillageOptions();

  // 2. Initialize Center Filter Pills
  initCenterFilterPills();

  // 3. Initial Render of Charities Table & Stats
  renderCharities();

  // 4. Form Submit Handler (Add / Edit)
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // 5. Cancel Edit Button
  if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', resetFormToAddMode);
  }

  // 6. Reset Buttons for In-Place Slot Swapping
  if (btnResetCenterSelect) {
    btnResetCenterSelect.addEventListener('click', () => {
      if (centerOtherContainer) centerOtherContainer.style.display = 'none';
      if (centerOtherInput) centerOtherInput.value = '';
      if (centerSelect) {
        centerSelect.style.display = 'block';
        centerSelect.value = '';
        centerSelect.focus();
      }
      populateVillages('');
    });
  }

  if (btnResetVillageSelect) {
    btnResetVillageSelect.addEventListener('click', () => {
      if (villageOtherContainer) villageOtherContainer.style.display = 'none';
      if (villageOtherInput) villageOtherInput.value = '';
      if (villageSelect) {
        villageSelect.style.display = 'block';
        villageSelect.value = '';
        villageSelect.focus();
      }
    });
  }

  // 7. Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      renderCharities();
    });
  }

  // 8. Export CSV Handler
  if (btnExport) {
    btnExport.addEventListener('click', exportCharitiesToCSV);
  }

  // 9. Delegated Table Actions (Edit & Delete)
  if (tableBody) {
    tableBody.addEventListener('click', handleTableAction);
  }

  // 10. Listen to Reactive Store Updates via EventBus
  EventBus.on(EVENTS.CHARITIES_UPDATED, () => {
    renderCharities();
  });

  EventBus.on(EVENTS.LOCATIONS_UPDATED, () => {
    initCenterAndVillageOptions();
    initCenterFilterPills();
    renderCharities();
  });

  /* ------------------------------------------------------------------------
     HELPER FUNCTIONS
     ------------------------------------------------------------------------ */

  function initCenterAndVillageOptions() {
    if (!centerSelect || !villageSelect) return;

    const centers = DataService.getCenters();

    // Populate Centers Dropdown + أخرى
    centerSelect.innerHTML = '<option value="" selected disabled>-- اختر المركز --</option>' +
      centers.map(center => `<option value="${center}">${center}</option>`).join('') +
      '<option value="أخرى" data-is-other="true">أخرى</option>';

    // Handle Cascading Center Change
    centerSelect.addEventListener('change', () => {
      const selectedCenter = centerSelect.value;
      if (selectedCenter === 'أخرى') {
        centerSelect.style.display = 'none';
        if (centerOtherContainer) centerOtherContainer.style.display = 'block';
        if (centerOtherInput) centerOtherInput.focus();

        if (villageSelect) {
          villageSelect.style.display = 'block';
          villageSelect.innerHTML = '<option value="" selected disabled>-- اختر القرية / المنطقة --</option><option value="أخرى" data-is-other="true">أخرى</option>';
          villageSelect.disabled = false;
        }
        if (villageOtherContainer) villageOtherContainer.style.display = 'none';
      } else {
        centerSelect.style.display = 'block';
        if (centerOtherContainer) centerOtherContainer.style.display = 'none';
        if (centerOtherInput) centerOtherInput.value = '';

        populateVillages(selectedCenter);
      }
    });

    if (villageSelect) {
      villageSelect.addEventListener('change', () => {
        if (villageSelect.value === 'أخرى') {
          villageSelect.style.display = 'none';
          if (villageOtherContainer) villageOtherContainer.style.display = 'block';
          if (villageOtherInput) villageOtherInput.focus();
        } else {
          villageSelect.style.display = 'block';
          if (villageOtherContainer) villageOtherContainer.style.display = 'none';
          if (villageOtherInput) villageOtherInput.value = '';
        }
      });
    }
  }

  function populateVillages(center, selectedVillage = '') {
    if (!villageSelect) return;

    if (!center) {
      villageSelect.style.display = 'block';
      villageSelect.innerHTML = '<option value="" selected disabled>-- اختر المركز أولاً --</option>';
      villageSelect.disabled = true;
      if (villageOtherContainer) villageOtherContainer.style.display = 'none';
      if (villageOtherInput) villageOtherInput.value = '';
      return;
    }

    const villages = DataService.getVillagesByCenter(center);
    villageSelect.innerHTML = '<option value="" selected disabled>-- اختر القرية / المنطقة --</option>' +
      villages.map(v => `<option value="${v}" ${v === selectedVillage ? 'selected' : ''}>${v}</option>`).join('') +
      '<option value="أخرى" data-is-other="true">أخرى</option>';
    villageSelect.disabled = false;

    if (selectedVillage && !villages.includes(selectedVillage)) {
      villageSelect.style.display = 'none';
      villageSelect.value = 'أخرى';
      if (villageOtherContainer) villageOtherContainer.style.display = 'block';
      if (villageOtherInput) villageOtherInput.value = selectedVillage;
    } else {
      villageSelect.style.display = 'block';
      if (villageOtherContainer) villageOtherContainer.style.display = 'none';
      if (villageOtherInput) villageOtherInput.value = '';
    }
  }

  function initCenterFilterPills() {
    if (!centerPillsContainer) return;

    const centers = DataService.getCenters();
    const pillsHtml = [
      `<button type="button" class="charity-center-pill charity-center-pill--active" data-center-filter="all">الكل</button>`,
      ...centers.map(c => `<button type="button" class="charity-center-pill" data-center-filter="${c}">مركز ${c}</button>`)
    ].join('');

    centerPillsContainer.innerHTML = pillsHtml;

    centerPillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.charity-center-pill');
      if (pill) {
        centerPillsContainer.querySelectorAll('.charity-center-pill').forEach(p => p.classList.remove('charity-center-pill--active'));
        pill.classList.add('charity-center-pill--active');
        activeCenterFilter = pill.getAttribute('data-center-filter') || 'all';
        renderCharities();
      }
    });
  }

  function renderCharities() {
    const allCharities = store.charities;

    if (statTotal) {
      statTotal.textContent = allCharities.length;
    }

    // Filter Charities
    const filtered = allCharities.filter(item => {
      if (activeCenterFilter !== 'all' && item.center !== activeCenterFilter) {
        return false;
      }

      if (searchQuery) {
        const matchName = (item.name || '').toLowerCase().includes(searchQuery);
        const matchCenter = (item.center || '').toLowerCase().includes(searchQuery);
        const matchVillage = (item.village || '').toLowerCase().includes(searchQuery);
        const matchAddress = (item.address || '').toLowerCase().includes(searchQuery);
        const matchPhone = (item.phone || '').toLowerCase().includes(searchQuery);
        return matchName || matchCenter || matchVillage || matchAddress || matchPhone;
      }

      return true;
    });

    if (!tableBody) return;

    if (filtered.length === 0) {
      tableBody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tableBody.innerHTML = filtered.map((charity, index) => {
      return `
        <tr data-charity-id="${charity.id}">
          <td style="text-align: center;">
            <span class="charity-code-tag">${index + 1}</span>
          </td>
          <td>
            <div class="charity-name-cell">
              <div class="charity-avatar-icon">🏢</div>
              <div>
                <strong class="charity-table-title">${DOM.escapeHTML(charity.name)}</strong>
              </div>
            </div>
          </td>
          <td>
            <div class="charity-location-badge">
              <span class="center-name">مركز ${DOM.escapeHTML(charity.center)}</span>
              <span class="village-name">قرية ${DOM.escapeHTML(charity.village)}</span>
            </div>
          </td>
          <td>
            <div class="charity-contact-cell">
              ${charity.phone ? `<span class="charity-phone">📞 ${DOM.escapeHTML(charity.phone)}</span>` : '<span class="charity-subinfo">لا يوجد هاتف</span>'}
              ${charity.address ? `<span class="charity-address" title="${DOM.escapeHTML(charity.address)}">📍 ${DOM.escapeHTML(charity.address)}</span>` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    let center = centerSelect ? centerSelect.value : '';
    let village = villageSelect ? villageSelect.value : '';

    if (!name) {
      showToast('الرجاء إدخال اسم الجمعية ⚠️');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!center) {
      showToast('الرجاء اختيار المركز التابع للجمعية 🏛️');
      if (centerSelect) centerSelect.focus();
      return;
    }

    if (center === 'أخرى') {
      center = centerOtherInput ? centerOtherInput.value.trim() : '';
      if (!center) {
        showToast('الرجاء كتابة اسم المركز ✍️');
        if (centerOtherInput) centerOtherInput.focus();
        return;
      }
    }

    if (!village) {
      showToast('الرجاء اختيار القرية أو المنطقة 📍');
      if (villageSelect) villageSelect.focus();
      return;
    }

    if (village === 'أخرى') {
      village = villageOtherInput ? villageOtherInput.value.trim() : '';
      if (!village) {
        showToast('الرجاء كتابة اسم القرية أو المنطقة ✍️');
        if (villageOtherInput) villageOtherInput.focus();
        return;
      }
    }

    const editId = editIdInput ? editIdInput.value.trim() : '';
    const address = addressInput ? addressInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';

    const charityData = {
      name,
      governorate: 'بني سويف',
      center,
      village,
      address,
      phone
    };

    if (editId) {
      store.updateCharity(editId, charityData);
      showToast(`تم تحديث بيانات "${name}" بنجاح ✨`);
      resetFormToAddMode();
    } else {
      const newCharity = {
        id: 'charity-' + Date.now(),
        dateAdded: new Date().toISOString().split('T')[0],
        ...charityData
      };
      store.addCharity(newCharity);
      showToast(`تمت إضافة جمعية "${name}" بنجاح 🏢`);
      resetFormToAddMode();
    }
  }

  function handleTableAction(e) {
    const btn = e.target.closest('.btn-action-icon');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    const charity = store.charities.find(c => c.id === id);

    if (!charity) return;

    if (action === 'edit') {
      startEditCharity(charity);
    } else if (action === 'delete') {
      if (window.confirm(`هل أنت متأكد من حذف "${charity.name}" من سجل الجمعيات؟`)) {
        store.removeCharity(id);
        if (editIdInput && editIdInput.value === id) {
          resetFormToAddMode();
        }
        showToast(`تم حذف "${charity.name}" من السجل 🗑️`);
      }
    }
  }

  function startEditCharity(charity) {
    if (editIdInput) editIdInput.value = charity.id;
    if (nameInput) nameInput.value = charity.name || '';
    if (addressInput) addressInput.value = charity.address || '';
    if (phoneInput) phoneInput.value = charity.phone || '';

    const knownCenters = DataService.getCenters();
    if (centerSelect) {
      if (knownCenters.includes(charity.center)) {
        centerSelect.style.display = 'block';
        centerSelect.value = charity.center;
        if (centerOtherContainer) centerOtherContainer.style.display = 'none';
        if (centerOtherInput) centerOtherInput.value = '';
      } else {
        centerSelect.style.display = 'none';
        centerSelect.value = 'أخرى';
        if (centerOtherContainer) centerOtherContainer.style.display = 'block';
        if (centerOtherInput) centerOtherInput.value = charity.center || '';
      }
      populateVillages(charity.center, charity.village);
    }

    if (formTitle) formTitle.textContent = 'تعديل بيانات الجمعية';
    if (formBadge) {
      formBadge.textContent = 'وضع التعديل';
      formBadge.className = 'badge badge--warning';
    }
    if (submitText) submitText.textContent = 'حفظ التعديلات';
    if (btnCancelEdit) btnCancelEdit.style.display = 'inline-flex';

    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (nameInput) nameInput.focus();
    }
  }

  function resetFormToAddMode() {
    if (form) form.reset();
    if (editIdInput) editIdInput.value = '';
    if (centerSelect) centerSelect.style.display = 'block';
    if (centerOtherContainer) centerOtherContainer.style.display = 'none';
    if (centerOtherInput) centerOtherInput.value = '';
    if (villageSelect) {
      villageSelect.style.display = 'block';
      villageSelect.innerHTML = '<option value="" selected disabled>-- اختر المركز أولاً --</option>';
      villageSelect.disabled = true;
    }
    if (villageOtherContainer) villageOtherContainer.style.display = 'none';
    if (villageOtherInput) villageOtherInput.value = '';

    if (formTitle) formTitle.textContent = 'إضافة جمعية جديدة';
    if (formBadge) {
      formBadge.textContent = 'تسجيل جديد';
      formBadge.className = 'badge badge--primary';
    }
    if (submitText) submitText.textContent = 'إضافة الجمعية';
    if (btnCancelEdit) btnCancelEdit.style.display = 'none';
  }

  function exportCharitiesToCSV() {
    const charities = store.charities;
    if (charities.length === 0) {
      showToast('لا توجد بيانات جمعيات لتصديرها ⚠️');
      return;
    }

    const headers = ['اسم الجمعية', 'المحافظة', 'المركز', 'القرية', 'العنوان', 'رقم الهاتف'];
    const rows = charities.map(c => [
      `"${c.name || ''}"`,
      `"${c.governorate || 'بني سويف'}"`,
      `"${c.center || ''}"`,
      `"${c.village || ''}"`,
      `"${c.address || ''}"`,
      `"${c.phone || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `charities_beni_suef_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('تم تصدير ملف الجمعيات بنجاح 📥');
  }
}
