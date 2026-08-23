/* --------------------------------------------------------------------------
   WORKFLOW COMPONENT
   Handles 10-step connected workflow tabs navigation, step pane display,
   and live percentage calculation engine.
   -------------------------------------------------------------------------- */
import { showToast } from '../../utils/toast.js';
import { onWorkflowRecalc } from '../../core/state.js';
import { store } from '../../state/store.js';
import { DOM } from '../../utils/dom.js';
import { parseEgyptianNationalId, normalizeNumerals } from '../../utils/nationalId.js';

export function initWorkflowTabs() {
  const toggleBtn = DOM.qs('#workflow-toggle-btn');
  const toggleText = DOM.qs('#workflow-toggle-text');
  const roadWrapper = DOM.qs('#workflow-road-wrapper');
  const workflowCard = DOM.qs('#workflow-nav-card');
  const stepNodes = DOM.qsa('.workflow-tab');

  // National ID Auto Extraction Controls
  const nationalIdInput = DOM.qs('#national-id');
  const ageInput = DOM.qs('#current-age');
  const genderSelect = DOM.qs('#gender');
  const govInput = DOM.qs('#governorate');
  const errorMsgEl = DOM.qs('#national-id-error');
  const successMsgEl = DOM.qs('#national-id-success');

  function handleNationalIdExtraction() {
    if (!nationalIdInput) return;

    const rawVal = nationalIdInput.value;
    const cleanVal = normalizeNumerals(rawVal);

    // Keep input field value normalized
    if (rawVal !== cleanVal) {
      nationalIdInput.value = cleanVal;
    }

    if (cleanVal.length === 0) {
      if (errorMsgEl) errorMsgEl.style.display = 'none';
      if (successMsgEl) successMsgEl.style.display = 'none';
      nationalIdInput.style.borderColor = '';
      clearDerivedFields();
      calculatePercentages();
      return;
    }

    if (cleanVal.length < 14) {
      if (errorMsgEl) errorMsgEl.style.display = 'none';
      if (successMsgEl) successMsgEl.style.display = 'none';
      nationalIdInput.style.borderColor = '';
      return;
    }

    // 14 Digits Entered: Run Egyptian National ID Parser
    const result = parseEgyptianNationalId(cleanVal);

    if (result.valid) {
      if (errorMsgEl) errorMsgEl.style.display = 'none';
      if (successMsgEl) successMsgEl.style.display = 'block';
      nationalIdInput.style.borderColor = '#0d9488';

      // Auto Populate Extracted Data
      if (ageInput) {
        ageInput.value = result.age;
      }
      if (genderSelect) {
        genderSelect.value = result.genderAr;
      }
      if (govInput) {
        govInput.value = result.governorateAr;
      }

      showToast(`تم استخراج (السن: ${result.age} سنة، المحافظة: ${result.governorateAr}، النوع: ${result.genderAr}) تلقائياً`);
    } else {
      if (successMsgEl) successMsgEl.style.display = 'none';
      if (errorMsgEl) {
        errorMsgEl.textContent = result.error || 'الرقم القومي غير صحيح';
        errorMsgEl.style.display = 'block';
      }
      nationalIdInput.style.borderColor = '#ef4444';
      clearDerivedFields();
    }

    calculatePercentages();
  }

  function clearDerivedFields() {
    if (ageInput) ageInput.value = '';
    if (genderSelect) genderSelect.value = '';
    if (govInput) govInput.value = '';
  }

  if (nationalIdInput) {
    nationalIdInput.addEventListener('input', handleNationalIdExtraction);
    nationalIdInput.addEventListener('change', handleNationalIdExtraction);
    nationalIdInput.addEventListener('blur', handleNationalIdExtraction);
    if (nationalIdInput.value.trim().length === 14) {
      handleNationalIdExtraction();
    }
  }

  // Toggle Collapse / Expand
  if (toggleBtn && roadWrapper) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      const arrow = toggleBtn.querySelector('.workflow-toggle-btn__arrow');

      if (isExpanded) {
        roadWrapper.classList.add('workflow-road-wrapper--collapsed');
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (toggleText) toggleText.textContent = 'عرض جميع الخطوات (10)';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      } else {
        roadWrapper.classList.remove('workflow-road-wrapper--collapsed');
        toggleBtn.setAttribute('aria-expanded', 'true');
        if (toggleText) toggleText.textContent = 'طي الخطوات';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      }
    });
  }

  function calculatePercentages() {
    // 1. البيانات الأساسية وأفراد الأسرة
    const s1Fields = ['case-name', 'national-id', 'head-relation', 'district', 'village', 'address'];
    let s1Count = 0;
    s1Fields.forEach(id => {
      const el = DOM.qs(`#${id}`);
      if (el && el.value.trim() !== '') s1Count++;
    });
    const pct1 = Math.round((s1Count / s1Fields.length) * 100);

    // 2. المرفقات
    const s2Doc = DOM.qs('#case-doc-upload');
    const s2Type = DOM.qs('#case-doc-type');
    const pct2 = (s2Doc && s2Doc.files && s2Doc.files.length > 0) ? 100 : (s2Type && s2Type.value !== '' ? 50 : 0);

    // 3. السكن
    const s3Fields = ['housing-tenure', 'building-type', 'rooms-count', 'roof-condition', 'housing-floor', 'housing-entrance', 'bathroom-type', 'bathroom-condition'];
    let s3Count = 0;
    s3Fields.forEach(id => {
      const el = DOM.qs(`#${id}`);
      if (el && el.value.trim() !== '') s3Count++;
    });
    const pct3 = Math.round((s3Count / s3Fields.length) * 100);

    // 4. المرافق والتجهيزات
    const s4Fields = ['utility-electricity', 'utility-water', 'utility-sanitation', 'utility-water-motor', 'utility-fridge', 'utility-washer', 'utility-oven', 'utility-cooking', 'utility-computer', 'utility-tv', 'utility-freezer', 'utility-transport', 'utility-internet'];
    let s4Count = 0;
    s4Fields.forEach(id => {
      const el = DOM.qs(`#${id}`);
      if (el && el.value.trim() !== '') s4Count++;
    });
    const pct4 = Math.round((s4Count / s4Fields.length) * 100);

    // 5. الحيازة الزراعية
    const agriEl = DOM.qs('#agri-tenure');
    const agriCrop = DOM.qs('#agri-crop-type');
    const pct5 = (agriEl && agriEl.value.trim() !== '') ? 100 : (agriCrop && agriCrop.value.trim() !== '' ? 50 : 0);

    // 6. الدخل والمصروفات
    const incCards = DOM.qsa('#income-list-container .member-card');
    const expCards = DOM.qsa('#expense-list-container .member-card');
    const pct6 = (incCards.length > 0 || expCards.length > 0) ? 100 : 0;

    // 7. التصنيف
    const activeChips = DOM.qsa('#social-classifications-chips .chip-btn--active');
    const povertyEl = DOM.qs('#poverty-degree');
    const priorityEl = DOM.qs('#priority-level');
    const pct7 = (activeChips.length > 0 || (povertyEl && povertyEl.value !== '') || (priorityEl && priorityEl.value !== '')) ? 100 : 0;

    // 8. الاحتياجات
    const needCards = DOM.qsa('#needs-list-container .member-card');
    const pct8 = (needCards.length > 0) ? 100 : 0;

    // 9. التقييمات
    const briefOp = DOM.qs('#researcher-brief-opinion');
    const opEl = DOM.qs('#researcher-opinion');
    const pct9 = ((briefOp && briefOp.value !== '') || (opEl && opEl.value.trim() !== '')) ? 100 : 0;

    // 10. الدعم
    const supType = DOM.qs('#support-type');
    const supBen = DOM.qs('#support-beneficiary');
    const supAmt = DOM.qs('#proposed-amount');
    const pct10 = ((supType && supType.value !== '') || (supBen && supBen.value.trim() !== '') || (supAmt && supAmt.value.trim() !== '')) ? 100 : 0;

    const percentages = [pct1, pct2, pct3, pct4, pct5, pct6, pct7, pct8, pct9, pct10];

    // Update Percentage Nodes UI (show step number only — no % text)
    percentages.forEach((pct, idx) => {
      const stepNum = idx + 1;
      const tabEl = DOM.qs(`#step-node-${stepNum}`);

      if (tabEl) {
        tabEl.classList.remove('workflow-tab--completed', 'workflow-tab--partial', 'workflow-tab--empty');
        if (pct === 100) {
          tabEl.classList.add('workflow-tab--completed');
        } else if (pct > 0) {
          tabEl.classList.add('workflow-tab--partial');
        } else {
          tabEl.classList.add('workflow-tab--empty');
        }
      }
    });
  }

  // Attach live listeners via delegation on the personal-data view container
  const personalDataView = DOM.qs('#view-personal-data');
  function handleDelegatedRecalc(e) {
    if (e.target.matches('.form-input, .form-select')) {
      calculatePercentages();
    }
  }
  if (personalDataView) {
    personalDataView.addEventListener('input', handleDelegatedRecalc);
    personalDataView.addEventListener('change', handleDelegatedRecalc);
  } else {
    DOM.qsa('.form-input, .form-select').forEach(input => {
      input.addEventListener('input', calculatePercentages);
      input.addEventListener('change', calculatePercentages);
    });
  }

  function activateStep(step, scroll = true) {
    stepNodes.forEach(n => n.classList.remove('workflow-tab--active'));
    const targetNode = DOM.qs(`#step-node-${step}`) || DOM.qs(`.workflow-tab[data-step="${step}"]`);
    if (targetNode) targetNode.classList.add('workflow-tab--active');

    DOM.qsa('#view-personal-data .step-pane').forEach(pane => {
      pane.style.display = 'none';
    });

    const activePane = DOM.qs(`#step-pane-${step}`);
    if (activePane) {
      activePane.style.display = 'block';
      if (scroll && workflowCard) {
        workflowCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    store.setActiveStage(step, true);
  }

  // Attach click listeners on step nodes to show only selected step pane
  stepNodes.forEach((node) => {
    node.addEventListener('click', () => {
      const step = node.getAttribute('data-step');
      activateStep(step, true);
      const label = node.querySelector('.workflow-tab__label')?.textContent || `مرحلة ${step}`;
      showToast(`تم فتح مرحلة: ${label}`);
    });
  });

  // Restore active step tab from store / localStorage
  const savedStep = store.activeStage;
  if (savedStep) {
    activateStep(savedStep, false);
  }

  // Initial calculation & event bus listener
  calculatePercentages();
  onWorkflowRecalc(calculatePercentages);
}
