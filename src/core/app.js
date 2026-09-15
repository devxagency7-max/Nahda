/* --------------------------------------------------------------------------
   APPLICATION BOOTSTRAPPER & LIFECYCLE CONTROLLER
   Orchestrates application initialization, module bootstrapping, and cleanup.
   -------------------------------------------------------------------------- */
import { mountComponentTemplates } from './loader.js';
import { initPageViewNavigation } from './router.js';
import { initDashboardInteractivity } from '../components/dashboard/dashboard.component.js';
import { initSidebarAccordion, initSidebarCollapse, initSidebarUserProfile } from '../components/sidebar/sidebar.component.js';
import { initWorkflowTabs } from '../components/workflow/workflow.component.js';
import { initInPageBackgroundStudio } from '../components/bg-studio/bg-studio.component.js';
import { initFileUpload, initFormInteractivity } from '../components/file-upload/file-upload.component.js';
import { initFamilyMembersManager } from '../components/family-members/family-members.component.js';
import { initAttachmentsManager } from '../components/attachments/attachments.component.js';
import { initLocationCascade } from '../components/location-cascade/location-cascade.component.js';
import { initOtherOptionDropdowns } from '../components/other-dropdowns/other-dropdowns.component.js';
import { initChipFields } from '../components/chip-field/chip-field.component.js';
import { initAgricultureManager } from '../components/agriculture/agriculture.component.js';
import { initSupportManager } from '../components/support/support.component.js';
import { initFinancialManager } from '../components/financial-ledger/financial-ledger.component.js';
import { initLoginScreen } from '../components/login/login.component.js';
import { initStateDataManagement } from '../components/state-data-management/state-data-management.component.js';
import { initCharitiesManager } from '../components/charities/charities.component.js';
import { initEmployeesManager } from '../components/employees/employees.component.js';
import { initProfileComponent } from '../components/profile/profile.component.js';
import { initAllCasesComponent } from '../components/all-cases/all-cases.component.js';
import { initCaseDetailsComponent } from '../components/case-details/case-details.component.js';
import { Lifecycle } from './lifecycle.js';

export function bootstrapApp() {
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Synchronously mount modular HTML component templates into App Shell DOM
    mountComponentTemplates();

    // 2. Initialize application interactive controllers & event listeners
    initPageViewNavigation();
    initLoginScreen();
    initDashboardInteractivity();
    initSidebarAccordion();
    initSidebarCollapse();
    initSidebarUserProfile();
    initWorkflowTabs();
    initFileUpload();
    initFormInteractivity();
    initInPageBackgroundStudio();
    initFamilyMembersManager();
    initAttachmentsManager();
    initLocationCascade();
    initOtherOptionDropdowns();
    initChipFields();
    initAgricultureManager();
    initSupportManager();
    initFinancialManager();
    initStateDataManagement();
    initCharitiesManager();
    initEmployeesManager();
    initProfileComponent();
    initAllCasesComponent();
    initCaseDetailsComponent();
  });

  // Handle unload lifecycle cleanup
  window.addEventListener('beforeunload', () => {
    Lifecycle.destroy();
  });
}
