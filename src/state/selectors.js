/* --------------------------------------------------------------------------
   STATE SELECTORS (DERIVED STATE COMPUTATIONS)
   -------------------------------------------------------------------------- */
import { store } from './store.js';
import { MOCK_CASES } from '../data/mockCases.js';
import {
  hasWorkerOpinion,
  hasReviewerOpinion,
  hasManagerApproval
} from '../core/permissions.js';

export const Selectors = {
  /**
   * Calculate budget totals
   */
  getBudgetTotals() {
    const totalIncome = store.incomeItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalExpenses = store.expenseItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const netIncome = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netIncome
    };
  },

  /**
   * Get family member count badge text
   */
  getFamilyMembersCount() {
    return store.familyMembers.length;
  }
};

/* --------------------------------------------------------------------------
   CASE QUEUE SELECTORS
   بيحسبوا شغل كل دور من الحالات الفعلية بدل أرقام ثابتة، فلما المراجع أو
   المدير يسجّل قرار الأرقام بتتحرك قدامه.
   -------------------------------------------------------------------------- */

/** All cases the web knows about. Swap this for the API call when it lands. */
export function allCases() {
  return MOCK_CASES;
}

/** Cases waiting on the reviewer: worker opinion in, reviewer opinion missing. */
export function casesAwaitingReviewer() {
  return allCases().filter(c => hasWorkerOpinion(c) && !hasReviewerOpinion(c));
}

/**
 * Cases waiting on the manager: reviewer done, no final approval yet.
 * الملف المُعاد للأخصائي خرج من مسار الاعتماد — الدور فيه على الأخصائي.
 */
export function casesAwaitingManager() {
  return allCases().filter(c =>
    hasReviewerOpinion(c) &&
    c.reviewerOpinion.decision !== 'returned_to_worker' &&
    !hasManagerApproval(c));
}

/** Cases the reviewer sent back to the field social worker. */
export function casesReturnedToWorker() {
  return allCases().filter(c =>
    c.reviewerOpinion && c.reviewerOpinion.decision === 'returned_to_worker');
}

/** Cases the reviewer has already weighed in on. */
export function casesReviewedBy(name) {
  return allCases().filter(c => c.reviewerOpinion && c.reviewerOpinion.author === name);
}

/** Cases still waiting on the field social worker's opinion (mobile app). */
export function casesAwaitingWorker() {
  return allCases().filter(c => !hasWorkerOpinion(c));
}

/** Cases created by a given user (data entry clerk). */
export function casesCreatedBy(name) {
  return allCases().filter(c => c.createdBy === name);
}

/** Cases with at least one attachment not marked as satisfied. */
export function casesWithIncompleteAttachments() {
  return allCases().filter(c =>
    Array.isArray(c.attachments) &&
    c.attachments.some(att => !String(att.status || '').startsWith('مستوفاة'))
  );
}

/** Cases that reached a final decision, by outcome. */
export function casesByFinalDecision(decision) {
  return allCases().filter(c => c.managerApproval && c.managerApproval.decision === decision);
}

/** Headline counts shared across roles. */
export function caseTotals() {
  const cases = allCases();
  return {
    total: cases.length,
    accepted: cases.filter(c => c.status === 'accepted').length,
    rejected: cases.filter(c => c.status === 'rejected').length,
    pending: cases.filter(c => c.status === 'pending').length
  };
}
