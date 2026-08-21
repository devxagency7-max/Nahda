/* --------------------------------------------------------------------------
   TRANSITIONAL ENTRY POINT
   Migration in progress: exposes the new core/data modules as globals so
   the legacy js/*.js <script> tags keep working unmodified while modules
   are migrated into src/ one at a time. Removed once migration completes.
   -------------------------------------------------------------------------- */
import { showToast } from './core/toast.js';
import { onWorkflowRecalc, triggerWorkflowRecalc } from './core/state.js';
import { BENI_SUEF_DATA } from './data/beniSuefData.js';

window.showToast = showToast;
window.__onWorkflowRecalc = onWorkflowRecalc;
window.__triggerWorkflowRecalc = triggerWorkflowRecalc;
window.BENI_SUEF_DATA = BENI_SUEF_DATA;
