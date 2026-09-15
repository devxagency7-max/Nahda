/* --------------------------------------------------------------------------
   ALL CASES VIEW COMPONENT CONTROLLER
   Manages cases listing, status filtering, search queries, and full 9-section
   case inspection modal rendering (including Social Worker Assessment & Assessed Needs).
   -------------------------------------------------------------------------- */
import { MOCK_CASES } from '../../data/mockCases.js';
import { DOM } from '../../utils/dom.js';
import { showToast } from '../../utils/toast.js';
import { openCaseDetailsPage } from '../case-details/case-details.component.js';

let activeFilter = 'all';
let searchQuery = '';

export function initAllCasesComponent() {
  const searchInput = DOM.qs('#all-cases-search-input');
  const filterBtns = DOM.qsa('.btn-case-filter');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('btn-case-filter--active'));
        btn.classList.add('btn-case-filter--active');

        activeFilter = btn.getAttribute('data-filter') || 'all';
        renderAllCasesGrid();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      renderAllCasesGrid();
    });
  }

  renderAllCasesGrid();
}

export function setCasesFilter(filterName) {
  activeFilter = filterName || 'all';
  const filterBtns = DOM.qsa('.btn-case-filter');
  filterBtns.forEach(btn => {
    const f = btn.getAttribute('data-filter');
    btn.classList.toggle('btn-case-filter--active', f === activeFilter);
  });
  renderAllCasesGrid();
}

export function renderAllCasesGrid() {
  const casesGrid = DOM.qs('#all-cases-grid');
  if (!casesGrid) return;

  const filtered = MOCK_CASES.filter(c => {
    const matchesFilter = activeFilter === 'all' || c.status === activeFilter;
    const matchesSearch = !searchQuery || 
      c.name.toLowerCase().includes(searchQuery) || 
      c.nid.includes(searchQuery) ||
      c.village.toLowerCase().includes(searchQuery) ||
      c.center.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    // Check if searchQuery looks like a national ID (digits only, up to 14)
    const isNidSearch = /^\d+$/.test(searchQuery) && searchQuery.length >= 1;

    casesGrid.innerHTML = `
      <div class="glass-card" style="padding: 40px; text-align: center; grid-column: 1 / -1;">
        <span style="font-size: 36px; display: block; margin-bottom: 12px;">🔍</span>
        <h3 style="font-size: 18px; font-weight: 800; color: #000; margin: 0 0 6px;">لم يتم العثور على حالات مطابقة</h3>
        <p style="font-size: 13px; color: var(--text-secondary); margin: 0 0 16px;">جرب تغيير معيار التصفية أو البحث عن اسم/رقم قومي آخر.</p>
        ${isNidSearch ? `
          <button type="button" class="btn btn--primary btn--sm btn-register-new-case-nid" data-prefill-nid="${DOM.escapeHTML(searchQuery)}" style="font-weight: 800; font-size: 14px; padding: 10px 24px; gap: 8px; display: inline-flex; align-items: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            تسجيل حالة جديدة بالرقم القومي: ${DOM.escapeHTML(searchQuery)}
          </button>
        ` : ''}
      </div>
    `;

    // Attach click handler for register new case button
    const registerBtn = casesGrid.querySelector('.btn-register-new-case-nid');
    if (registerBtn) {
      registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const prefillNid = registerBtn.getAttribute('data-prefill-nid');
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
    }

    return;
  }

  casesGrid.innerHTML = filtered.map(c => `
    <div class="glass-card case-item-card">
      <div class="case-item-card__header">
        <div>
          <span class="dash-status-pill ${c.statusClass}" style="margin-bottom: 6px; display: inline-block;">${c.statusLabel}</span>
          <h3 class="case-item-card__name">${DOM.escapeHTML(c.name)}</h3>
        </div>
        <span class="badge" style="background: rgba(255,255,255,0.7); color: var(--color-primary); font-weight: 800;">${c.id}</span>
      </div>

      <!-- Outer Card Properties (الاسم - الرقم القومي - عدد أفراد الأسرة) -->
      <div class="case-item-card__details">
        <div class="case-item-detail-row">
          <span class="detail-label">🪪 الرقم القومي:</span>
          <span class="detail-val" style="font-family: monospace; font-weight: 800; font-size: 14px;">${c.nid}</span>
        </div>
        <div class="case-item-detail-row">
          <span class="detail-label">👨‍👩‍👧‍👦 عدد أفراد الأسرة:</span>
          <span class="detail-val" style="font-weight: 800;">${c.familyMembersCount} أفراد</span>
        </div>
        <div class="case-item-detail-row">
          <span class="detail-label">🏢 الجمعية والموقع:</span>
          <span class="detail-val" style="font-size: 12px;">${DOM.escapeHTML(c.charity)} (${c.center} — ${c.village})</span>
        </div>
      </div>

      <button type="button" class="btn btn--primary btn--full btn-open-case-detail" data-case-id="${c.id}" style="margin-top: 16px; font-weight: 800;">
        <span>فتح فحص وتقييم الحالة بالكامل 📂</span>
      </button>
    </div>
  `).join('');

  // Attach dynamic click handlers to open full page case details
  casesGrid.querySelectorAll('.btn-open-case-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const caseId = btn.getAttribute('data-case-id');
      if (caseId && openCaseDetailsPage) {
        openCaseDetailsPage(caseId);
      }
    });
  });
}

/**
 * Render the full 9-section ordered cards inspection modal for a case.
 */
function openFullCaseModal(c) {
  const modal = DOM.qs('#case-detail-modal');
  const codeEl = DOM.qs('#modal-case-code');
  const nameEl = DOM.qs('#modal-case-name');
  const bodyEl = DOM.qs('#modal-case-body');

  if (!modal || !bodyEl) return;

  if (codeEl) codeEl.textContent = `${c.id} — ${c.statusLabel}`;
  if (nameEl) nameEl.textContent = c.name;

  bodyEl.innerHTML = `
    <!-- Card 1: البيانات الشخصية والأساسية -->
    <div class="glass-card case-section-card">
      <div class="case-section-card__title">
        <span>👤 1. البيانات الشخصية والأساسية</span>
      </div>
      <div class="case-section-grid">
        <div><strong>الاسم الرباعي:</strong> ${DOM.escapeHTML(c.name)}</div>
        <div><strong>الرقم القومي:</strong> <span style="font-family: monospace;">${c.nid}</span></div>
        <div><strong>رقم الهاتف:</strong> ${c.phone}</div>
        <div><strong>عدد أفراد الأسرة:</strong> ${c.familyMembersCount} أفراد</div>
        <div><strong>الحالة الاجتماعية:</strong> ${DOM.escapeHTML(c.demographics.maritalStatus)}</div>
        <div><strong>الوضع الصحي:</strong> ${DOM.escapeHTML(c.demographics.healthStatus)}</div>
        <div style="grid-column: 1 / -1;"><strong>العنوان تفصيلياً:</strong> ${DOM.escapeHTML(c.demographics.address)}</div>
      </div>
    </div>

    <!-- Card 2: المرفقات والوثائق -->
    <div class="glass-card case-section-card">
      <div class="case-section-card__title">
        <span>📄 2. المرفقات والوثائق الثبوتية الرسمية</span>
      </div>
      <div class="case-attachments-list">
        ${c.attachments.map(att => `
          <div class="case-attachment-item">
            <span>📎 ${DOM.escapeHTML(att.title)}</span>
            <span class="badge" style="background: rgba(255,255,255,0.8); font-weight: 700;">${att.status}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Card 3: بيانات السكن والظروف المعيشية -->
    <div class="glass-card case-section-card">
      <div class="case-section-card__title">
        <span>🏠 3. بيانات السكن وحالة العقار</span>
      </div>
      <div class="case-section-grid">
        <div><strong>حالة الملكية:</strong> ${DOM.escapeHTML(c.housing.ownership)}</div>
        <div><strong>طبيعة البناء والمنزل:</strong> ${DOM.escapeHTML(c.housing.buildingType)}</div>
        <div><strong>عدد الغرف:</strong> ${DOM.escapeHTML(c.housing.roomsCount)}</div>
        <div><strong>دورة المياه والصرف:</strong> ${DOM.escapeHTML(c.housing.sanitation)}</div>
      </div>
    </div>

    <!-- Card 4: الخدمات والمرافق -->
    <div class="glass-card case-section-card">
      <div class="case-section-card__title">
        <span>⚡ 4. الخدمات والمرافق العامة</span>
      </div>
      <div class="case-section-grid">
        <div><strong>مصدر الكهرباء:</strong> ${DOM.escapeHTML(c.utilities.electricity)}</div>
        <div><strong>مياه الشرب:</strong> ${DOM.escapeHTML(c.utilities.water)}</div>
        <div><strong>الغاز والبوتاجاز:</strong> ${DOM.escapeHTML(c.utilities.gas)}</div>
      </div>
    </div>

    <!-- Card 5: الحيازة الزراعية والمواشي -->
    <div class="glass-card case-section-card">
      <div class="case-section-card__title">
        <span>🌾 5. الحيازة الزراعية والمواشي</span>
      </div>
      <div class="case-section-grid">
        <div><strong>المساحة الزراعية:</strong> ${DOM.escapeHTML(c.agriculture.holdingArea)}</div>
        <div><strong>المواشي والأغنام:</strong> ${DOM.escapeHTML(c.agriculture.livestock)}</div>
      </div>
    </div>

    <!-- Card 6: الدخل والمصروفات والوضع المالي -->
    <div class="glass-card case-section-card">
      <div class="case-section-card__title">
        <span>💰 6. الدخل والمصروفات والوضع المالي</span>
      </div>
      <div class="case-section-grid">
        <div><strong>إجمالي الدخل الشهري:</strong> ${c.financial.totalIncome} ج.م</div>
        <div><strong>معاش تكافل/تأمينات:</strong> ${c.financial.pensions} ج.م</div>
        <div><strong>مصروفات الإيجار:</strong> ${c.financial.rentExpense} ج.م</div>
        <div><strong>العلاج والأدوية الشهري:</strong> ${c.financial.medicalExpense} ج.م</div>
        <div style="grid-column: 1 / -1; font-size: 15px; font-weight: 800; color: #059669;">
          صافي المتبقي للأسرة شهرياً: ${c.financial.netBalance} ج.م فقط
        </div>
      </div>
    </div>

    <!-- Card 7: التصنيف الاجتماعي ودرجة الاستحقاق -->
    <div class="glass-card case-section-card">
      <div class="case-section-card__title">
        <span>📊 7. التصنيف الاجتماعي ودرجة الاستحقاق</span>
      </div>
      <div class="case-section-grid">
        <div><strong>الفئة الاجتماعية:</strong> ${DOM.escapeHTML(c.classification.category)}</div>
        <div><strong>مؤشر الفقر والاحتياج:</strong> ${DOM.escapeHTML(c.classification.povertyIndex)}</div>
        <div><strong>المستوى المستحق:</strong> ${DOM.escapeHTML(c.classification.eligibilityTier)}</div>
      </div>
    </div>

    <!-- Card 8: رأي وتوصية الأخصائي الاجتماعي (يُسجَّل من تطبيق الأخصائي) -->
    <div class="glass-card case-section-card" style="border: 1.5px solid rgba(13, 148, 136, 0.4); background: rgba(240, 253, 250, 0.9);">
      <div class="case-section-card__title" style="color: #0f766e;">
        <span>🏠 8. رأي الأخصائي الاجتماعي الميداني</span>
      </div>
      ${c.workerOpinion && c.workerOpinion.notes ? `
        <p style="font-size: 14px; line-height: 1.7; color: #134e4a; margin: 0; font-weight: 600;">
          "${DOM.escapeHTML(c.workerOpinion.notes)}"
        </p>
      ` : `
        <p style="font-size: 14px; color: #475569; margin: 0; font-weight: 700;">لم يسجّل الأخصائي الميداني رأيه بعد.</p>
      `}
    </div>

    <!-- Card 9: الدعم المباشر والاحتياجات المقترحة -->
    <div class="glass-card case-section-card" style="border: 1.5px solid rgba(16, 185, 129, 0.4); background: rgba(236, 253, 245, 0.9);">
      <div class="case-section-card__title" style="color: #047857;">
        <span>🤝 9. الدعم المباشر والاحتياجات المقترحة للحالة</span>
      </div>
      ${c.assessedNeeds.length > 0 ? `
        <div style="display: grid; gap: 12px;">
          ${c.assessedNeeds.map(need => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #ffffff; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.3);">
              <div>
                <strong style="color: #065f46; display: block;">${DOM.escapeHTML(need.title)}</strong>
                <span style="font-size: 12px; color: #047857;">الكمية/القيمة: ${DOM.escapeHTML(need.amount)}</span>
              </div>
              <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #065f46; font-weight: 800;">${DOM.escapeHTML(need.urgency)}</span>
            </div>
          `).join('')}
        </div>
      ` : `
        <p style="font-size: 13px; color: #991b1b; margin: 0; font-weight: 700;">لا يوجد دعم مالي أو عيني مقترح (الحالة غير مستحقة).</p>
      `}
    </div>
  `;

  modal.style.display = 'flex';
  showToast(`تم فتح التقرير الشامل للحالة (${c.id}) 📋`);
}
