/* --------------------------------------------------------------------------
   FINANCIAL LEDGER COMPONENT (STAGE 6)
   Handles income and expense sources, total calculation, net budget status,
   and DOM list updates.
   -------------------------------------------------------------------------- */
import { showToast } from '../../utils/toast.js';
import { triggerWorkflowRecalc } from '../../core/state.js';
import { store } from '../../state/store.js';
import { DOM } from '../../utils/dom.js';

export function initFinancialManager() {
  const btnOpenIncome = DOM.qs('#btn-open-add-income');
  const btnCancelIncome = DOM.qs('#btn-cancel-add-income');
  const btnSaveIncome = DOM.qs('#btn-save-income');
  const inlineIncomeForm = DOM.qs('#add-income-inline-form');
  const incomeList = DOM.qs('#income-list-container');

  const btnOpenExpense = DOM.qs('#btn-open-add-expense');
  const btnCancelExpense = DOM.qs('#btn-cancel-add-expense');
  const btnSaveExpense = DOM.qs('#btn-save-expense');
  const inlineExpenseForm = DOM.qs('#add-expense-inline-form');
  const expenseList = DOM.qs('#expense-list-container');

  const statIncome = DOM.qs('#stat-total-income');
  const statExpenses = DOM.qs('#stat-total-expenses');
  const statNet = DOM.qs('#stat-net-income');

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

    store.setFinancialItems(incomeItems, expenseItems);
    triggerWorkflowRecalc();
  }

  function renderIncomeList() {
    if (!incomeList) return;
    const emptyState = DOM.qs('#income-empty-state');

    if (incomeItems.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      DOM.clear(incomeList);
      if (emptyState) incomeList.appendChild(emptyState);
      return;
    }

    DOM.clear(incomeList);
    incomeItems.forEach((item, idx) => {
      const card = DOM.createElement('div', {
        className: 'member-card',
        style: { marginBottom: '10px' }
      });
      card.innerHTML = `
        <div class="member-card__info">
          <div class="member-card__avatar" style="background: rgba(16, 185, 129, 0.15); color: #059669;">💰</div>
          <div>
            <h4 class="member-card__name">${DOM.escapeHTML(item.type)}</h4>
            <p class="member-card__meta">الفرد: ${DOM.escapeHTML(item.person || 'غير محدد')} • القيمة: ${item.amount.toLocaleString()} جنيه/شهرياً</p>
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
    const emptyState = DOM.qs('#expense-empty-state');

    if (expenseItems.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      DOM.clear(expenseList);
      if (emptyState) expenseList.appendChild(emptyState);
      return;
    }

    DOM.clear(expenseList);
    expenseItems.forEach((item, idx) => {
      const card = DOM.createElement('div', {
        className: 'member-card',
        style: { marginBottom: '10px' }
      });
      card.innerHTML = `
        <div class="member-card__info">
          <div class="member-card__avatar" style="background: rgba(239, 68, 68, 0.15); color: #dc2626;">💸</div>
          <div>
            <h4 class="member-card__name">${DOM.escapeHTML(item.type)}</h4>
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
      const type = DOM.qs('#new-income-type')?.value || 'دخل آخر';
      const person = DOM.qs('#new-income-person')?.value.trim() || 'رب الأسرة';
      const amount = parseFloat(DOM.qs('#new-income-amount')?.value) || 0;

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
      const type = DOM.qs('#new-expense-type')?.value || 'مصروف آخر';
      const amount = parseFloat(DOM.qs('#new-expense-amount')?.value) || 0;

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
