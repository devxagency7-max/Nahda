/* --------------------------------------------------------------------------
   CENTRAL REACTIVE APPLICATION STORE
   Single source of truth for runtime application state.
   -------------------------------------------------------------------------- */
import { StorageService, STORAGE_KEYS } from '../services/storage.js';
import { EventBus, EVENTS } from '../core/event-bus.js';
import { BENI_SUEF_DATA } from '../data/beniSuefData.js';

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

class AppStore {
  constructor() {
    this.state = {
      currentView: StorageService.get(STORAGE_KEYS.CURRENT_VIEW, 'login'),
      activeStage: StorageService.get(STORAGE_KEYS.ACTIVE_STAGE, '1'),
      currentUser: StorageService.get(STORAGE_KEYS.CURRENT_USER, {
        name: 'محمد أحمد',
        roleLabel: 'مدير النظام',
        roleCode: 'admin',
        email: 'm.ahmed@nahda.org.eg',
        gender: 'ذكر',
        phone: '01012345678',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      }),
      bgSettings: Object.assign({}, defaultBgSettings, StorageService.get(STORAGE_KEYS.BG_SETTINGS, {})),
      familyMembers: StorageService.get(STORAGE_KEYS.FAMILY_MEMBERS, []),
      charities: initialCharities,
      beniSuefLocations: StorageService.get(STORAGE_KEYS.BENI_SUEF_LOCATIONS, BENI_SUEF_DATA),
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
  get beniSuefLocations() { return this.state.beniSuefLocations || BENI_SUEF_DATA; }
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
    this.setCharities(DEFAULT_CHARITIES);
  }

  setCurrentUser(user, persist = true) {
    this.state.currentUser = user;
    if (persist) {
      StorageService.set(STORAGE_KEYS.CURRENT_USER, user);
    }
    EventBus.emit(EVENTS.USER_CHANGED, user);
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
    EventBus.emit(EVENTS.WORKFLOW_STEP_CHANGED, String(stageNumber));
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
    EventBus.emit(EVENTS.WORKFLOW_RECALC_TRIGGERED);
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
