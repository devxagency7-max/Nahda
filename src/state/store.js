/* --------------------------------------------------------------------------
   CENTRAL REACTIVE APPLICATION STORE
   Single source of truth for runtime application state.
   -------------------------------------------------------------------------- */
import { StorageService, STORAGE_KEYS } from '../services/storage.js';
import { EventBus, EVENTS } from '../core/event-bus.js';
import { BENI_SUEF_DATA } from '../data/beniSuefData.js';
import { DEFAULT_EMPLOYEES } from '../data/mockEmployees.js';

const defaultBgSettings = {
  type: 'image',
  val: 'assets/background.jpg',
  blur: 20,
  brightness: 89,
  contrast: 98,
  saturate: 140,
  overlay: 22
};

let initialCharities = StorageService.get(STORAGE_KEYS.CHARITIES, []);
if (Array.isArray(initialCharities) && initialCharities.some(c => c.code && c.code.startsWith('CH-10'))) {
  initialCharities = [];
  StorageService.set(STORAGE_KEYS.CHARITIES, []);
}

const ROLE_HIERARCHY = {
  manager: 1,
  reviewer: 2,
  social_worker: 3,
  data_entry: 4
};

// أدوار تسجيل الدخول في الويب. الأخصائي الميداني مستبعد عمدًا: هو موظف في
// الجدول (الويب بيسند له حالات) لكن شغله من تطبيق الموبايل المنفصل.
const WEB_LOGIN_ROLES = ['manager', 'reviewer', 'data_entry'];

// ترحيل الجلسات القديمة: دور admin (مدير النظام) اتشال، وجلسات الأخصائي
// مابقتش تتفتح من الويب — الاتنين بيرجعوا لأقل دور بدل ما يفضلوا شغالين.
function migrateStoredUser(user) {
  if (!user || !WEB_LOGIN_ROLES.includes(user.roleCode)) {
    return {
      name: 'حسن',
      roleLabel: 'مدخل بيانات',
      roleCode: 'data_entry',
      email: 'hassan@gmail.com',
      gender: 'ذكر',
      phone: '01055667788',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    };
  }
  return user;
}

let initialEmployees = StorageService.get(STORAGE_KEYS.EMPLOYEES, DEFAULT_EMPLOYEES);
if (Array.isArray(initialEmployees)) {
  initialEmployees = initialEmployees.filter(e => e.roleCode !== 'supervisor');
  initialEmployees.sort((a, b) => (ROLE_HIERARCHY[a.roleCode] || 99) - (ROLE_HIERARCHY[b.roleCode] || 99));
  StorageService.set(STORAGE_KEYS.EMPLOYEES, initialEmployees);
}

class AppStore {
  constructor() {
    this.state = {
      currentView: StorageService.get(STORAGE_KEYS.CURRENT_VIEW, 'login'),
      activeStage: StorageService.get(STORAGE_KEYS.ACTIVE_STAGE, '1'),
      currentUser: migrateStoredUser(StorageService.get(STORAGE_KEYS.CURRENT_USER, null)),
      bgSettings: Object.assign({}, defaultBgSettings, StorageService.get(STORAGE_KEYS.BG_SETTINGS, {})),
      familyMembers: StorageService.get(STORAGE_KEYS.FAMILY_MEMBERS, []),
      charities: initialCharities,
      employees: initialEmployees,
      beniSuefLocations: StorageService.get(STORAGE_KEYS.BENI_SUEF_LOCATIONS, BENI_SUEF_DATA),
      agriculture: StorageService.get(STORAGE_KEYS.AGRICULTURE, null),
      visitedStages: StorageService.get(STORAGE_KEYS.VISITED_STAGES, []),
      incomeItems: [],
      expenseItems: [],
      assessedNeeds: [],
      searchMode: 'nid'
    };
  }

  // Getters
  get currentView() { return this.state.currentView; }
  get activeStage() { return this.state.activeStage; }
  get currentUser() { return this.state.currentUser; }
  get bgSettings() { return this.state.bgSettings; }
  get familyMembers() { return this.state.familyMembers; }
  get charities() { return this.state.charities || []; }
  get employees() { return this.state.employees || []; }
  get beniSuefLocations() { return this.state.beniSuefLocations || BENI_SUEF_DATA; }
  get agriculture() { return this.state.agriculture; }
  get visitedStages() { return Array.isArray(this.state.visitedStages) ? this.state.visitedStages : []; }
  get incomeItems() { return this.state.incomeItems; }
  get expenseItems() { return this.state.expenseItems; }
  get assessedNeeds() { return this.state.assessedNeeds; }
  get searchMode() { return this.state.searchMode; }

  // User Profile Actions
  setCurrentUser(userData, persist = true) {
    this.state.currentUser = Object.assign({}, this.state.currentUser, userData);
    if (persist) {
      StorageService.set(STORAGE_KEYS.CURRENT_USER, this.state.currentUser);
    }
    EventBus.emit(EVENTS.USER_CHANGED, this.state.currentUser);
  }

  // Location Actions
  setBeniSuefLocations(locations, persist = true) {
    this.state.beniSuefLocations = locations;
    if (persist) {
      StorageService.set(STORAGE_KEYS.BENI_SUEF_LOCATIONS, locations);
    }
    EventBus.emit(EVENTS.LOCATIONS_UPDATED, locations);
  }

  addCenter(centerName) {
    if (!centerName) return;
    const locs = { ...this.beniSuefLocations };
    if (!locs[centerName]) {
      locs[centerName] = [];
      this.setBeniSuefLocations(locs);
    }
  }

  updateCenter(oldName, newName) {
    if (!oldName || !newName || oldName === newName) return;
    const locs = { ...this.beniSuefLocations };
    if (locs[oldName]) {
      locs[newName] = locs[oldName];
      delete locs[oldName];
      this.setBeniSuefLocations(locs);
    }
  }

  deleteCenter(centerName) {
    if (!centerName) return;
    const locs = { ...this.beniSuefLocations };
    if (locs[centerName]) {
      delete locs[centerName];
      this.setBeniSuefLocations(locs);
    }
  }

  addVillage(centerName, villageName) {
    if (!centerName || !villageName) return;
    const locs = { ...this.beniSuefLocations };
    if (!locs[centerName]) locs[centerName] = [];
    if (!locs[centerName].includes(villageName)) {
      locs[centerName] = [...locs[centerName], villageName];
      this.setBeniSuefLocations(locs);
    }
  }

  updateVillage(centerName, oldVillage, newVillage) {
    if (!centerName || !oldVillage || !newVillage || oldVillage === newVillage) return;
    const locs = { ...this.beniSuefLocations };
    if (locs[centerName]) {
      locs[centerName] = locs[centerName].map(v => v === oldVillage ? newVillage : v);
      this.setBeniSuefLocations(locs);
    }
  }

  deleteVillage(centerName, villageName) {
    if (!centerName || !villageName) return;
    const locs = { ...this.beniSuefLocations };
    if (locs[centerName]) {
      locs[centerName] = locs[centerName].filter(v => v !== villageName);
      this.setBeniSuefLocations(locs);
    }
  }

  resetBeniSuefLocations() {
    this.setBeniSuefLocations(BENI_SUEF_DATA);
  }

  // Actions
  setCharities(charities, persist = true) {
    this.state.charities = charities;
    if (persist) {
      StorageService.set(STORAGE_KEYS.CHARITIES, charities);
    }
    EventBus.emit(EVENTS.CHARITIES_UPDATED, charities);
  }

  addCharity(charity) {
    const updated = [charity, ...this.state.charities];
    this.setCharities(updated);
  }

  updateCharity(id, updatedData) {
    const updated = this.state.charities.map(c => c.id === id ? { ...c, ...updatedData } : c);
    this.setCharities(updated);
  }

  removeCharity(id) {
    const updated = this.state.charities.filter(c => c.id !== id);
    this.setCharities(updated);
  }

  resetCharities() {
    // No seeded charities dataset exists; reset clears the list.
    this.setCharities([]);
  }

  // Employee Management Actions
  setEmployees(employees, persist = true) {
    this.state.employees = employees;
    if (persist) {
      StorageService.set(STORAGE_KEYS.EMPLOYEES, employees);
    }
    EventBus.emit(EVENTS.EMPLOYEES_UPDATED, employees);
  }

  addEmployee(employee) {
    const updated = [...this.state.employees, employee];
    updated.sort((a, b) => (ROLE_HIERARCHY[a.roleCode] || 99) - (ROLE_HIERARCHY[b.roleCode] || 99));
    this.setEmployees(updated);
  }

  updateEmployee(id, updatedData) {
    const updated = this.state.employees.map(e => e.id === id ? { ...e, ...updatedData } : e);
    updated.sort((a, b) => (ROLE_HIERARCHY[a.roleCode] || 99) - (ROLE_HIERARCHY[b.roleCode] || 99));
    this.setEmployees(updated);
  }

  removeEmployee(id) {
    const updated = this.state.employees.filter(e => e.id !== id);
    this.setEmployees(updated);
  }

  resetEmployees() {
    this.setEmployees(DEFAULT_EMPLOYEES);
  }

  // Actions
  setCurrentView(viewName, persist = true) {
    this.state.currentView = viewName;
    if (persist) {
      StorageService.set(STORAGE_KEYS.CURRENT_VIEW, viewName);
    }
    EventBus.emit(EVENTS.VIEW_CHANGED, viewName);
  }

  setActiveStage(stageNumber, persist = true) {
    this.state.activeStage = String(stageNumber);
    if (persist) {
      StorageService.set(STORAGE_KEYS.ACTIVE_STAGE, String(stageNumber));
    }
    this.markStageVisited(stageNumber);
    EventBus.emit(EVENTS.WORKFLOW_STEP_CHANGED, String(stageNumber));
  }

  // تتبّع المراحل اللي المستخدم فتحها فعلًا — علشان نفرّق بين "مرحلة مُجاب
  // عنها بـ (لا)" و "مرحلة لسه محدش شافها" في حساب نسب الإكمال.
  markStageVisited(stageNumber) {
    const key = String(stageNumber);
    const visited = this.visitedStages;
    if (visited.includes(key)) return;
    this.state.visitedStages = [...visited, key];
    StorageService.set(STORAGE_KEYS.VISITED_STAGES, this.state.visitedStages);
  }

  isStageVisited(stageNumber) {
    return this.visitedStages.includes(String(stageNumber));
  }

  setAgriculture(data) {
    this.state.agriculture = data;
    StorageService.set(STORAGE_KEYS.AGRICULTURE, data);
    EventBus.emit(EVENTS.AGRICULTURE_UPDATED, data);
  }

  updateBgSettings(newSettings) {
    this.state.bgSettings = Object.assign({}, this.state.bgSettings, newSettings);
    StorageService.set(STORAGE_KEYS.BG_SETTINGS, this.state.bgSettings);
    EventBus.emit(EVENTS.BG_SETTINGS_CHANGED, this.state.bgSettings);
  }

  resetBgSettings() {
    this.state.bgSettings = Object.assign({}, defaultBgSettings);
    StorageService.set(STORAGE_KEYS.BG_SETTINGS, this.state.bgSettings);
    EventBus.emit(EVENTS.BG_SETTINGS_CHANGED, this.state.bgSettings);
  }

  setFamilyMembers(members) {
    this.state.familyMembers = members;
    StorageService.set(STORAGE_KEYS.FAMILY_MEMBERS, members);
    EventBus.emit(EVENTS.FAMILY_MEMBERS_UPDATED, members);
    EventBus.emit(EVENTS.WORKFLOW_RECALC_TRIGGERED);
  }

  addFamilyMember(member) {
    const updated = [...this.state.familyMembers, member];
    this.setFamilyMembers(updated);
  }

  removeFamilyMember(index) {
    const updated = [...this.state.familyMembers];
    updated.splice(index, 1);
    this.setFamilyMembers(updated);
  }

  setFinancialItems(incomeItems, expenseItems) {
    this.state.incomeItems = incomeItems;
    this.state.expenseItems = expenseItems;
    EventBus.emit(EVENTS.FINANCIAL_DATA_UPDATED, { incomeItems, expenseItems });
  }

  setAssessedNeeds(needs) {
    this.state.assessedNeeds = needs;
    EventBus.emit(EVENTS.ASSESSED_NEEDS_UPDATED, needs);
    EventBus.emit(EVENTS.WORKFLOW_RECALC_TRIGGERED);
  }

  setSearchMode(mode) {
    this.state.searchMode = mode;
  }
}

export const store = new AppStore();
