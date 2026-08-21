/* --------------------------------------------------------------------------
   WORKFLOW PERCENTAGE RECALCULATION SIGNAL
   Replaces the old window.updateWorkflowPercentages global. workflow.js
   subscribes its calculatePercentages once at init; any module that needs
   to trigger a recalc (family members, financial/needs sections) calls
   triggerWorkflowRecalc() unconditionally — a no-op if nothing has
   subscribed yet, matching the old typeof-guard's effective behavior.
   -------------------------------------------------------------------------- */
let recalcHandler = null;

export function onWorkflowRecalc(fn) {
  recalcHandler = fn;
}

export function triggerWorkflowRecalc() {
  if (typeof recalcHandler === 'function') {
    recalcHandler();
  }
}
