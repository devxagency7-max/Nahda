import { showToast } from '../core/toast.js';
import { onWorkflowRecalc } from '../core/state.js';

/* --------------------------------------------------------------------------
   WORKFLOW CONNECTED TABS NAVIGATION (10 STEPS LIVE PERCENTAGE ENGINE)
   -------------------------------------------------------------------------- */
export function initWorkflowTabs() {
  const toggleBtn = document.getElementById('workflow-toggle-btn');
  const toggleText = document.getElementById('workflow-toggle-text');
  const roadWrapper = document.getElementById('workflow-road-wrapper');
  const workflowCard = document.getElementById('workflow-nav-card');
  const stepNodes = document.querySelectorAll('.workflow-tab');

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
      const el = document.getElementById(id);
      if (el && el.value.trim() !== '') s1Count++;
    });
    const pct1 = Math.round((s1Count / s1Fields.length) * 100);

    // 2. المرفقات
    const s2Doc = document.getElementById('case-doc-upload');
    const s2Type = document.getElementById('case-doc-type');
    const pct2 = (s2Doc && s2Doc.files && s2Doc.files.length > 0) ? 100 : (s2Type && s2Type.value !== '' ? 50 : 0);

    // 3. السكن
    const s3Fields = ['housing-tenure', 'building-type', 'rooms-count', 'roof-condition', 'housing-floor', 'housing-entrance', 'bathroom-type', 'bathroom-condition'];
    let s3Count = 0;
    s3Fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.value.trim() !== '') s3Count++;
    });
    const pct3 = Math.round((s3Count / s3Fields.length) * 100);

    // 4. المرافق والتجهيزات
    const s4Fields = ['utility-electricity', 'utility-water', 'utility-sanitation', 'utility-water-motor', 'utility-fridge', 'utility-washer', 'utility-oven', 'utility-cooking', 'utility-computer', 'utility-tv', 'utility-freezer', 'utility-transport', 'utility-internet'];
    let s4Count = 0;
    s4Fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.value.trim() !== '') s4Count++;
    });
    const pct4 = Math.round((s4Count / s4Fields.length) * 100);

    // 5. الحيازة الزراعية
    const agriEl = document.getElementById('agri-tenure');
    const agriCrop = document.getElementById('agri-crop-type');
    const pct5 = (agriEl && agriEl.value.trim() !== '') ? 100 : (agriCrop && agriCrop.value.trim() !== '' ? 50 : 0);

    // 6. الدخل والمصروفات
    const incCards = document.querySelectorAll('#income-list-container .member-card');
    const expCards = document.querySelectorAll('#expense-list-container .member-card');
    const pct6 = (incCards.length > 0 || expCards.length > 0) ? 100 : 0;

    // 7. التصنيف
    const activeChips = document.querySelectorAll('#social-classifications-chips .chip-btn--active');
    const povertyEl = document.getElementById('poverty-degree');
    const priorityEl = document.getElementById('priority-level');
    const pct7 = (activeChips.length > 0 || (povertyEl && povertyEl.value !== '') || (priorityEl && priorityEl.value !== '')) ? 100 : 0;

    // 8. الاحتياجات
    const needCards = document.querySelectorAll('#needs-list-container .member-card');
    const pct8 = (needCards.length > 0) ? 100 : 0;

    // 9. التقييمات
    const briefOp = document.getElementById('researcher-brief-opinion');
    const opEl = document.getElementById('researcher-opinion');
    const pct9 = ((briefOp && briefOp.value !== '') || (opEl && opEl.value.trim() !== '')) ? 100 : 0;

    // 10. الدعم
    const supType = document.getElementById('support-type');
    const supBen = document.getElementById('support-beneficiary');
    const supAmt = document.getElementById('proposed-amount');
    const pct10 = ((supType && supType.value !== '') || (supBen && supBen.value.trim() !== '') || (supAmt && supAmt.value.trim() !== '')) ? 100 : 0;

    const percentages = [pct1, pct2, pct3, pct4, pct5, pct6, pct7, pct8, pct9, pct10];

    // Update Percentage Nodes UI (show step number only — no % text)
    percentages.forEach((pct, idx) => {
      const stepNum = idx + 1;
      const tabEl = document.getElementById(`step-node-${stepNum}`);

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

    // Update overall node styles only (road line is static)
    const sum = percentages.reduce((acc, curr) => acc + curr, 0);
    const overall = Math.round(sum / 10);
    // Road line is purely decorative and static - no dynamic drawing
  }

  // Attach live listeners via delegation on the personal-data view (verified
  // equivalent: no code ever dynamically creates a new .form-input/.form-select
  // element — every such element is static HTML, only shown/hidden — so a
  // delegated input/change listener fires for exactly the same element set
  // as the old per-element querySelectorAll('.form-input, .form-select') binding)
  const personalDataView = document.getElementById('view-personal-data');
  function handleDelegatedRecalc(e) {
    if (e.target.matches('.form-input, .form-select')) {
      calculatePercentages();
    }
  }
  if (personalDataView) {
    personalDataView.addEventListener('input', handleDelegatedRecalc);
    personalDataView.addEventListener('change', handleDelegatedRecalc);
  } else {
    // Fallback: preserve old behavior exactly if the view container is missing
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
      input.addEventListener('input', calculatePercentages);
      input.addEventListener('change', calculatePercentages);
    });
  }

  function activateStep(step, scroll = true) {
    stepNodes.forEach(n => n.classList.remove('workflow-tab--active'));
    const targetNode = document.getElementById(`step-node-${step}`) || document.querySelector(`.workflow-tab[data-step="${step}"]`);
    if (targetNode) targetNode.classList.add('workflow-tab--active');

    document.querySelectorAll('#view-personal-data .step-pane').forEach(pane => {
      pane.style.display = 'none';
    });

    const activePane = document.getElementById(`step-pane-${step}`);
    if (activePane) {
      activePane.style.display = 'block';
      if (scroll && workflowCard) {
        workflowCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    try {
      localStorage.setItem('nahda_active_stage', String(step));
    } catch (e) {}
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

  // Restore active step tab from localStorage
  const savedStep = localStorage.getItem('nahda_active_stage');
  if (savedStep) {
    activateStep(savedStep, false);
  }

  // Initial calculation
  calculatePercentages();
  onWorkflowRecalc(calculatePercentages);
}
