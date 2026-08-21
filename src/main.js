/* --------------------------------------------------------------------------
   ENTERPRISE DASHBOARD INTERACTIVITY ENGINE (ES6 VANILLA JS)
   Handles: Accordion Navigation, Collapsible Sidebar, Step Tabs, Drag&Drop
   Upload, In-Page Background Customizer Card & Live Visual Effects,
   Family Members Manager, Financial/Needs Sections, and the "أخرى" pattern.

   Entry point: bootstraps every module on DOMContentLoaded, mirroring the
   exact same single-listener sequence the legacy app.js used to run.
   -------------------------------------------------------------------------- */
import './styles/main.css';
import { initPageViewNavigation } from './modules/navigation.js';
import { initDashboardInteractivity } from './modules/dashboard.js';
import { initSidebarAccordion, initSidebarCollapse } from './modules/sidebar.js';
import { initWorkflowTabs } from './modules/workflow.js';
import { initInPageBackgroundStudio } from './modules/bgStudio.js';
import { initFileUpload, initFormInteractivity } from './modules/fileUpload.js';
import { initFamilyMembersManager, initLocationCascade } from './modules/familyMembers.js';
import { initOtherOptionDropdowns } from './modules/otherOptionDropdowns.js';
import { initFinancialManager, initSocialClassificationChips, initAssessedNeedsManager } from './modules/dynamicSections.js';

document.addEventListener('DOMContentLoaded', () => {
  initPageViewNavigation();
  initDashboardInteractivity();
  initSidebarAccordion();
  initSidebarCollapse();
  initWorkflowTabs();
  initFileUpload();
  initFormInteractivity();
  initInPageBackgroundStudio();
  initFamilyMembersManager();
  initLocationCascade();
  initOtherOptionDropdowns();
  initFinancialManager();
  initSocialClassificationChips();
  initAssessedNeedsManager();
});
