/* --------------------------------------------------------------------------
   DYNAMIC SECTIONS ENGINE (STAGE 6 FINANCIAL, STAGE 7 CHIPS, STAGE 8 NEEDS)
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initFinancialManager();
  initSocialClassificationChips();
  initAssessedNeedsManager();
});

// --- STAGE 6: FINANCIAL INCOME & EXPENSES MANAGER ---
function initFinancialManager() {
  const btnOpenIncome = document.getElementById('btn-open-add-income');
  const btnCancelIncome = document.getElementById('btn-cancel-add-income');
  const btnSaveIncome = document.getElementById('btn-save-income');
  const inlineIncomeForm = document.getElementById('add-income-inline-form');
  const incomeList = document.getElementById('income-list-container');

  const btnOpenExpense = document.getElementById('btn-open-add-expense');
  const btnCancelExpense = document.getElementById('btn-cancel-add-expense');
  const btnSaveExpense = document.getElementById('btn-save-expense');
  const inlineExpenseForm = document.getElementById('add-expense-inline-form');
  const expenseList = document.getElementById('expense-list-container');

  const statIncome = document.getElementById('stat-total-income');
  const statExpenses = document.getElementById('stat-total-expenses');
  const statNet = document.getElementById('stat-net-income');

  let incomeItems = [];
  let expenseItems = [];

  function recalculateBudget() {
    const totalInc = incomeItems.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExp = expenseItems.reduce((acc, curr) => acc + curr.amount, 0);
    const net = totalInc - totalExp;

    if (statIncome) statIncome.textContent = `${totalInc.toLocaleString()} جنيه`;
    if (statExpenses) statExpenses.textContent = `${totalExp.toLocaleString()} جنيه`;
    if (statNet) {
      statNet.textContent = `${net.toLocaleString()} جنيه`;
      statNet.style.color = net >= 0 ? '#2563eb' : '#dc2626';
    }

    if (typeof window.updateWorkflowPercentages === 'function') {
      window.updateWorkflowPercentages();
    }
  }

  function renderIncomeList() {
    if (!incomeList) return;
    const emptyState = document.getElementById('income-empty-state');

    if (incomeItems.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      incomeList.innerHTML = '';
      if (emptyState) incomeList.appendChild(emptyState);
      return;
    }

    incomeList.innerHTML = '';
    incomeItems.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'member-card';
      card.style.marginBottom = '10px';
      card.innerHTML = `
        <div class="member-card__info">
          <div class="member-card__avatar" style="background: rgba(16, 185, 129, 0.15); color: #059669;">💰</div>
          <div>
            <h4 class="member-card__name">${item.type}</h4>
            <p class="member-card__meta">الفرد: ${item.person || 'غير محدد'} • القيمة: ${item.amount.toLocaleString()} جنيه/شهرياً</p>
          </div>
        </div>
        <button class="btn btn--ghost btn--sm btn-delete-income" data-idx="${idx}" title="حذف" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `;
      incomeList.appendChild(card);
    });

    incomeList.querySelectorAll('.btn-delete-income').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        incomeItems.splice(idx, 1);
        renderIncomeList();
        recalculateBudget();
      });
    });
  }

  function renderExpenseList() {
    if (!expenseList) return;
    const emptyState = document.getElementById('expense-empty-state');

    if (expenseItems.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      expenseList.innerHTML = '';
      if (emptyState) expenseList.appendChild(emptyState);
      return;
    }

    expenseList.innerHTML = '';
    expenseItems.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'member-card';
      card.style.marginBottom = '10px';
      card.innerHTML = `
        <div class="member-card__info">
          <div class="member-card__avatar" style="background: rgba(239, 68, 68, 0.15); color: #dc2626;">💸</div>
          <div>
            <h4 class="member-card__name">${item.type}</h4>
            <p class="member-card__meta">المبلغ: ${item.amount.toLocaleString()} جنيه/شهرياً</p>
          </div>
        </div>
        <button class="btn btn--ghost btn--sm btn-delete-expense" data-idx="${idx}" title="حذف" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `;
      expenseList.appendChild(card);
    });

    expenseList.querySelectorAll('.btn-delete-expense').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        expenseItems.splice(idx, 1);
        renderExpenseList();
        recalculateBudget();
      });
    });
  }

  if (btnOpenIncome && inlineIncomeForm) {
    btnOpenIncome.addEventListener('click', () => inlineIncomeForm.style.display = 'block');
  }
  if (btnCancelIncome && inlineIncomeForm) {
    btnCancelIncome.addEventListener('click', () => inlineIncomeForm.style.display = 'none');
  }

  if (btnSaveIncome) {
    btnSaveIncome.addEventListener('click', () => {
      const type = document.getElementById('new-income-type')?.value || 'دخل آخر';
      const person = document.getElementById('new-income-person')?.value.trim() || 'رب الأسرة';
      const amount = parseFloat(document.getElementById('new-income-amount')?.value) || 0;

      if (amount <= 0) {
        showToast('يرجى إدخال مبلغ الدخل بشكل صحيح');
        return;
      }

      incomeItems.push({ type, person, amount });
      if (inlineIncomeForm) inlineIncomeForm.style.display = 'none';
      renderIncomeList();
      recalculateBudget();
      showToast('تمت إضافة مصدر الدخل بنجاح');
    });
  }

  if (btnOpenExpense && inlineExpenseForm) {
    btnOpenExpense.addEventListener('click', () => inlineExpenseForm.style.display = 'block');
  }
  if (btnCancelExpense && inlineExpenseForm) {
    btnCancelExpense.addEventListener('click', () => inlineExpenseForm.style.display = 'none');
  }

  if (btnSaveExpense) {
    btnSaveExpense.addEventListener('click', () => {
      const type = document.getElementById('new-expense-type')?.value || 'مصروف آخر';
      const amount = parseFloat(document.getElementById('new-expense-amount')?.value) || 0;

      if (amount <= 0) {
        showToast('يرجى إدخال مبلغ المصروف بشكل صحيح');
        return;
      }

      expenseItems.push({ type, amount });
      if (inlineExpenseForm) inlineExpenseForm.style.display = 'none';
      renderExpenseList();
      recalculateBudget();
      showToast('تمت إضافة المصروف بنجاح');
    });
  }
}

// --- STAGE 7: SOCIAL CLASSIFICATION CHIPS ---
function initSocialClassificationChips() {
  const container = document.getElementById('social-classifications-chips');
  if (!container) return;

  container.querySelectorAll('.chip-btn').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      chip.classList.toggle('chip-btn--active');
      if (typeof window.updateWorkflowPercentages === 'function') {
        window.updateWorkflowPercentages();
      }
    });
  });
}

// --- STAGE 8: ASSESSED NEEDS MANAGER ---
function initAssessedNeedsManager() {
  const btnOpenNeed = document.getElementById('btn-open-add-need');
  const btnCancelNeed = document.getElementById('btn-cancel-add-need');
  const btnSaveNeed = document.getElementById('btn-save-need');
  const inlineNeedForm = document.getElementById('add-need-inline-form');
  const needsList = document.getElementById('needs-list-container');

  let needsItems = [];

  function renderNeedsList() {
    if (!needsList) return;
    const emptyState = document.getElementById('needs-empty-state');

    if (needsItems.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      needsList.innerHTML = '';
      if (emptyState) needsList.appendChild(emptyState);
      return;
    }

    needsList.innerHTML = '';
    needsItems.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'member-card';
      card.style.marginBottom = '10px';
      card.innerHTML = `
        <div class="member-card__info">
          <div class="member-card__avatar" style="background: rgba(236, 72, 153, 0.15); color: #db2777;">🎯</div>
          <div>
            <h4 class="member-card__name">${item.type} • الأولوية: ${item.priority}</h4>
            <p class="member-card__meta">${item.description ? item.description + ' • ' : ''}التكلفة التقديرية: ${item.cost ? item.cost.toLocaleString() + ' جنيه' : 'غير محددة'}</p>
            ${item.reason ? `<p class="member-card__details" style="color: var(--color-primary);">السبب: ${item.reason}</p>` : ''}
          </div>
        </div>
        <button class="btn btn--ghost btn--sm btn-delete-need" data-idx="${idx}" title="حذف" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      `;
      needsList.appendChild(card);
    });

    needsList.querySelectorAll('.btn-delete-need').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        needsItems.splice(idx, 1);
        renderNeedsList();
        if (typeof window.updateWorkflowPercentages === 'function') {
          window.updateWorkflowPercentages();
        }
      });
    });
  }

  if (btnOpenNeed && inlineNeedForm) {
    btnOpenNeed.addEventListener('click', () => inlineNeedForm.style.display = 'block');
  }
  if (btnCancelNeed && inlineNeedForm) {
    btnCancelNeed.addEventListener('click', () => inlineNeedForm.style.display = 'none');
  }

  if (btnSaveNeed) {
    btnSaveNeed.addEventListener('click', () => {
      const type = document.getElementById('new-need-type')?.value || 'دعم مالي';
      const priority = document.getElementById('new-need-priority')?.value || 'عالية';
      const description = document.getElementById('new-need-description')?.value.trim() || '';
      const reason = document.getElementById('new-need-reason')?.value.trim() || '';
      const cost = parseFloat(document.getElementById('new-need-cost')?.value) || 0;

      needsItems.push({ type, priority, description, reason, cost });
      if (inlineNeedForm) inlineNeedForm.style.display = 'none';
      renderNeedsList();
      showToast('تمت إضافة الاحتياج بنجاح');
      if (typeof window.updateWorkflowPercentages === 'function') {
        window.updateWorkflowPercentages();
      }
    });
  }
}
