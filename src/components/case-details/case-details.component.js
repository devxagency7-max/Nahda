/* --------------------------------------------------------------------------
   CASE DETAILS PAGE VIEW COMPONENT CONTROLLER
   Renders full 10-section glassmorphic cards flow on the main page canvas.
   Includes Reviewer Decision Panel (Accept/Reject/Return to Social Worker/Forward).
   -------------------------------------------------------------------------- */
import { MOCK_CASES } from '../../data/mockCases.js';
import { DOM } from '../../utils/dom.js';
import { showToast } from '../../utils/toast.js';
import { store } from '../../state/store.js';

let currentActiveCase = MOCK_CASES[0];

export function initCaseDetailsComponent() {
  // Bind globally for page router / navigation hooks
  window.openCaseDetailsPage = openCaseDetailsPage;
}

export function openCaseDetailsPage(caseId) {
  const targetCase = MOCK_CASES.find(c => c.id === caseId) || MOCK_CASES[0];
  currentActiveCase = targetCase;

  const codeEl = DOM.qs('#case-detail-code');
  const pillEl = DOM.qs('#case-detail-status-pill');
  const nameEl = DOM.qs('#case-detail-name');
  const subinfoEl = DOM.qs('#case-detail-subinfo');
  const stackEl = DOM.qs('#case-details-stack');

  if (codeEl) codeEl.textContent = targetCase.id;
  if (pillEl) {
    pillEl.className = `dash-status-pill ${targetCase.statusClass}`;
    pillEl.textContent = targetCase.statusLabel;
  }
  if (nameEl) nameEl.textContent = targetCase.name;
  if (subinfoEl) {
    subinfoEl.textContent = `الرقم القومي: ${targetCase.nid} — ${targetCase.charity} (${targetCase.center} — ${targetCase.village})`;
  }

  if (stackEl) {
    renderCaseDetailsCards(stackEl, targetCase);
  }

  if (window.switchView) {
    window.switchView('case-details');
  }
}

function renderCaseDetailsCards(container, c) {
  container.innerHTML = `
    <!-- Card 1: البيانات الشخصية والأساسية -->
    <div class="glass-card case-page-card">
      <div class="case-page-card__title">
        <span>👤 1. البيانات الشخصية والأساسية</span>
      </div>
      <div class="case-page-grid">
        <div><strong>الاسم الرباعي:</strong> ${DOM.escapeHTML(c.name)}</div>
        <div><strong>الرقم القومي:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: 800;">${c.nid}</span></div>
        <div><strong>رقم الهاتف المحمول:</strong> ${c.phone}</div>
        <div><strong>عدد أفراد الأسرة:</strong> ${c.familyMembersCount} أفراد</div>
        <div><strong>الحالة الاجتماعية:</strong> ${DOM.escapeHTML(c.demographics.maritalStatus)}</div>
        <div><strong>الوضع الصحي والبدني:</strong> ${DOM.escapeHTML(c.demographics.healthStatus)}</div>
        <div><strong>طبيعة العمل والدخل:</strong> ${DOM.escapeHTML(c.demographics.employmentStatus)}</div>
        <div style="grid-column: 1 / -1;"><strong>العنوان تفصيلياً:</strong> ${DOM.escapeHTML(c.demographics.address)}</div>
      </div>
    </div>

    <!-- Card 2: المرفقات والوثائق الرسمية -->
    <div class="glass-card case-page-card">
      <div class="case-page-card__title">
        <span>📄 2. المرفقات والوثائق الثبوتية الرسمية</span>
      </div>
      <div class="case-page-attachments">
        ${c.attachments.map(att => `
          <div class="case-page-att-item">
            <span>📎 ${DOM.escapeHTML(att.title)}</span>
            <span class="badge" style="background: rgba(255,255,255,0.85); font-weight: 800;">${att.status}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Card 3: بيانات السكن والظروف المعيشية -->
    <div class="glass-card case-page-card">
      <div class="case-page-card__title">
        <span>🏠 3. بيانات السكن وحالة العقار والظروف المعيشية</span>
      </div>
      <div class="case-page-grid">
        <div><strong>حالة الملكية:</strong> ${DOM.escapeHTML(c.housing.ownership)}</div>
        <div><strong>طبيعة ومادة البناء:</strong> ${DOM.escapeHTML(c.housing.buildingType)}</div>
        <div><strong>عدد الغرف:</strong> ${DOM.escapeHTML(c.housing.roomsCount)}</div>
        <div><strong>حالة دورة المياه والصرف:</strong> ${DOM.escapeHTML(c.housing.sanitation)}</div>
      </div>
    </div>

    <!-- Card 4: الخدمات والمرافق -->
    <div class="glass-card case-page-card">
      <div class="case-page-card__title">
        <span>⚡ 4. الخدمات والمرافق العامة</span>
      </div>
      <div class="case-page-grid">
        <div><strong>مصدر الكهرباء:</strong> ${DOM.escapeHTML(c.utilities.electricity)}</div>
        <div><strong>وصلة مياه الشرب:</strong> ${DOM.escapeHTML(c.utilities.water)}</div>
        <div><strong>مصدر الغاز والطهي:</strong> ${DOM.escapeHTML(c.utilities.gas)}</div>
      </div>
    </div>

    <!-- Card 5: الحيازة الزراعية والمواشي -->
    <div class="glass-card case-page-card">
      <div class="case-page-card__title">
        <span>🌾 5. الحيازة الزراعية والمواشي والأصول</span>
      </div>
      <div class="case-page-grid">
        <div><strong>المساحة والحيازة الزراعية:</strong> ${DOM.escapeHTML(c.agriculture.holdingArea)}</div>
        <div><strong>المواشي ورؤوس الأغنام:</strong> ${DOM.escapeHTML(c.agriculture.livestock)}</div>
      </div>
    </div>

    <!-- Card 6: الدخل والمصروفات والوضع المالي -->
    <div class="glass-card case-page-card">
      <div class="case-page-card__title">
        <span>💰 6. الدخل والمصروفات والوضع المالي والصافي</span>
      </div>
      <div class="case-page-grid">
        <div><strong>إجمالي الدخل الشهري:</strong> ${c.financial.totalIncome} ج.م</div>
        <div><strong>معاش تكافل/تأمينات:</strong> ${c.financial.pensions} ج.م</div>
        <div><strong>مصروفات الإيجار:</strong> ${c.financial.rentExpense} ج.م</div>
        <div><strong>العلاج والأدوية الشهري:</strong> ${c.financial.medicalExpense} ج.م</div>
        <div style="grid-column: 1 / -1; font-size: 16px; font-weight: 800; color: #059669; background: rgba(16, 185, 129, 0.1); padding: 10px 14px; border-radius: 10px;">
          صافي المتبقي المعيشي للأسرة شهرياً: ${c.financial.netBalance} ج.م فقط
        </div>
      </div>
    </div>

    <!-- Card 7: التصنيف الاجتماعي ودرجة الاستحقاق -->
    <div class="glass-card case-page-card">
      <div class="case-page-card__title">
        <span>📊 7. التصنيف الاجتماعي ومستوى الاستحقاق الرقمي</span>
      </div>
      <div class="case-page-grid">
        <div><strong>الفئة الاجتماعية:</strong> ${DOM.escapeHTML(c.classification.category)}</div>
        <div><strong>مؤشر الفقر والاحتياج:</strong> ${DOM.escapeHTML(c.classification.povertyIndex)}</div>
        <div><strong>المستوى المستحق:</strong> ${DOM.escapeHTML(c.classification.eligibilityTier)}</div>
      </div>
    </div>

    <!-- Card 8: تقرير ورأي الأخصائي الاجتماعي الميداني -->
    <div class="glass-card case-page-card" style="border: 1.5px solid rgba(37, 99, 235, 0.4); background: rgba(239, 246, 255, 0.95);">
      <div class="case-page-card__title" style="color: #1d4ed8;">
        <span>✍️ 8. تقرير ورأي الأخصائي الاجتماعي الميداني</span>
      </div>
      <p style="font-size: 15px; line-height: 1.8; color: #1e3a8a; margin: 0; font-weight: 600; padding: 12px; background: rgba(255,255,255,0.7); border-radius: 12px;">
        "${DOM.escapeHTML(c.workerAssessment)}"
      </p>
    </div>

    <!-- Card 9: الدعم المباشر والاحتياجات المقترحة -->
    <div class="glass-card case-page-card" style="border: 1.5px solid rgba(16, 185, 129, 0.4); background: rgba(236, 253, 245, 0.95);">
      <div class="case-page-card__title" style="color: #047857;">
        <span>🤝 9. الدعم المباشر والاحتياجات المقترحة للحالة</span>
      </div>
      ${c.assessedNeeds.length > 0 ? `
        <div style="display: grid; gap: 12px;">
          ${c.assessedNeeds.map(need => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #ffffff; border-radius: 14px; border: 1px solid rgba(16, 185, 129, 0.3);">
              <div>
                <strong style="color: #065f46; display: block; font-size: 15px;">${DOM.escapeHTML(need.title)}</strong>
                <span style="font-size: 13px; color: #047857;">الكمية/القيمة: ${DOM.escapeHTML(need.amount)}</span>
              </div>
              <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #065f46; font-weight: 800; font-size: 13px;">${DOM.escapeHTML(need.urgency)}</span>
            </div>
          `).join('')}
        </div>
      ` : `
        <p style="font-size: 14px; color: #991b1b; margin: 0; font-weight: 700;">لا يوجد دعم مالي أو عيني مقترح (الحالة غير مستحقة).</p>
      `}
    </div>

    <!-- Card 10: لوحة قرار ورأي المراجع وإحالة الحالة (REVIEWER ACTION PANEL) -->
    <div class="glass-card case-page-card reviewer-decision-panel" style="border: 2px solid rgba(37, 99, 235, 0.5); background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(239, 246, 255, 0.95) 100%);">
      <div class="case-page-card__title" style="color: #1d4ed8; font-size: 17px; display: flex; align-items: center; justify-content: space-between;">
        <span>⚖️ 10. إقرار ورأي المراجع وإحالة المعاملة</span>
        <span class="badge" style="background: #2563eb; color: #fff; font-size: 12px; font-weight: 800;">لوحة المراجع والمشرف</span>
      </div>

      <form id="reviewer-decision-form" style="display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Decision Options Selection -->
        <div>
          <label style="display: block; font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 10px;">حدد القرار والتوجيه النهائي للملف المعروض:</label>
          
          <div class="reviewer-options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
            
            <label class="reviewer-option-card reviewer-option-card--accept">
              <input type="radio" name="reviewer_decision" value="accepted" ${c.status === 'accepted' ? 'checked' : ''} required>
              <div class="option-content">
                <span class="option-title">🟢 قبول الحالة وتخصيص الدعم</span>
                <span class="option-desc">اعتماد الملف وتوجيه الدعم المالي والعيني</span>
              </div>
            </label>

            <label class="reviewer-option-card reviewer-option-card--reject">
              <input type="radio" name="reviewer_decision" value="rejected" ${c.status === 'rejected' ? 'checked' : ''}>
              <div class="option-content">
                <span class="option-title">🔴 رفض الحالة لعدم الاستحقاق</span>
                <span class="option-desc">إغلاق الملف وتصنيف غير مستحق</span>
              </div>
            </label>

            <label class="reviewer-option-card reviewer-option-card--return">
              <input type="radio" name="reviewer_decision" value="returned_to_worker">
              <div class="option-content">
                <span class="option-title">🟡 إعادة للأخصائي استيفاء</span>
                <span class="option-desc">إعادة الملف للأخصائي لمزيد من البحث بالميدان</span>
              </div>
            </label>

            <label class="reviewer-option-card reviewer-option-card--forward">
              <input type="radio" name="reviewer_decision" value="forwarded">
              <div class="option-content">
                <span class="option-title">🔵 تحويل للمراجعة النهائية / المدير</span>
                <span class="option-desc">رفع الملف للمدير لاعتماد الاستثناء أو القرار</span>
              </div>
            </label>

          </div>
        </div>

        <!-- Reviewer Notes & Opinion Textarea -->
        <div>
          <label for="reviewer-notes" style="display: block; font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">رأي وملاحظات المراجع المكتوبة والتوصية النصية:</label>
          <textarea id="reviewer-notes" class="dash-search-input" rows="3" placeholder="أدخل رأيك وتوصياتك كمراجع هنا تفصيلياً..." dir="rtl" style="height: auto; padding: 12px; font-size: 14px; font-family: inherit; width: 100%; box-sizing: border-box;">${c.reviewerNotes ? DOM.escapeHTML(c.reviewerNotes) : ''}</textarea>
        </div>

        <!-- Submit Action Button -->
        <button type="submit" class="btn btn--primary btn--lg" style="height: 50px; font-size: 15px; font-weight: 800; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">
          <span>اعتماد القرار وتوجيه المعاملة 🚀</span>
        </button>
      </form>
    </div>
  `;

  // Bind submit event for reviewer decision form
  const form = container.querySelector('#reviewer-decision-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const selectedDecision = form.querySelector('input[name="reviewer_decision"]:checked')?.value;
      const notesVal = container.querySelector('#reviewer-notes')?.value.trim();

      if (!selectedDecision) {
        showToast('الرجاء تحديد قرار المراجع قبل الحفظ ⚠️');
        return;
      }

      c.reviewerNotes = notesVal;

      let decisionText = '';
      if (selectedDecision === 'accepted') {
        c.status = 'accepted';
        c.statusLabel = '🟢 حالة مقبولة';
        c.statusClass = 'dash-status-pill--success';
        decisionText = 'تم قبول الحالة وتخصيص الدعم المالي والعيني 🟢';
      } else if (selectedDecision === 'rejected') {
        c.status = 'rejected';
        c.statusLabel = '🔴 حالة مرفوضة';
        c.statusClass = 'dash-status-pill--danger';
        decisionText = 'تم رفض الحالة لعدم الاستحقاق 🔴';
      } else if (selectedDecision === 'returned_to_worker') {
        c.status = 'pending';
        c.statusLabel = '🟡 معادة للأخصائي لاستكمال المستندات';
        c.statusClass = 'dash-status-pill--warning';
        decisionText = 'تم إعادة الحالة للأخصائي الاجتماعي لاستكمال البحث والمستندات 🟡';
      } else if (selectedDecision === 'forwarded') {
        c.status = 'pending';
        c.statusLabel = '🔵 محالة للمدير والاعتماد النهائي';
        c.statusClass = 'dash-status-pill--info';
        decisionText = 'تم تحويل الحالة للمدير والمراجعة النهائية 🔵';
      }

      // Update header live
      const pillEl = DOM.qs('#case-detail-status-pill');
      if (pillEl) {
        pillEl.className = `dash-status-pill ${c.statusClass}`;
        pillEl.textContent = c.statusLabel;
      }

      showToast(`تم تسجيل رأي وقرار المراجع: ${decisionText}`);
    });
  }
}
