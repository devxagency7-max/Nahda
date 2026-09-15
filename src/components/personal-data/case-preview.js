/* --------------------------------------------------------------------------
   LIVE CASE PREVIEW
   بيقرأ محطات الإدخال الثمانية ويبني منها كائن حالة مؤقت، عشان المستخدم
   يشوف الملف بشكله النهائي قبل ما يرسله — والحقول الفاضية تبان ناقصة بدل
   ما تختفي.

   عند الربط بالباك إند: استبدل collectCaseFromForm() بجلب الحالة المحفوظة.
   -------------------------------------------------------------------------- */
import { DOM } from '../../utils/dom.js';
import { store } from '../../state/store.js';

/** قيمة حقل نصي/منسدل، أو '' لو فاضي أو غير موجود. */
function val(id) {
  const el = DOM.qs(`#${id}`);
  return el && el.value ? el.value.trim() : '';
}

/** رقم من حقل، أو 0. */
function num(id) {
  const n = Number(val(id));
  return Number.isFinite(n) ? n : 0;
}

/** هل الاختيار "نعم"؟ يقبل قيم select و radio. */
function isYes(id) {
  const v = val(id);
  return v === 'نعم' || v === 'yes' || v === 'true';
}

/**
 * قراءة حقل chips واحد: القيم المختارة، زائد نص "أخرى" لو مكتوب.
 * @returns {string} القيم مفصولة بفاصلة، أو '' لو مفيش اختيار
 */
function chips(fieldName) {
  const field = DOM.qs(`.chip-field[data-field="${fieldName}"]`);
  if (!field) return '';

  const picked = [...field.querySelectorAll('.chip-btn--active')]
    .map(b => b.dataset.value)
    .filter(Boolean);

  const otherInput = field.querySelector('.chip-field__other');
  const otherText = otherInput && otherInput.value ? otherInput.value.trim() : '';

  // "أخرى" تُستبدل بنصها حتى لا يظهر الخيار مجردًا بلا تفاصيل
  const out = picked.map(v => (v === 'أخرى' && otherText ? otherText : v));
  return out.join('، ');
}

/** هل الجهاز/المرفق مختار ضمن حقل chips؟ */
function chipHas(fieldName, value) {
  const field = DOM.qs(`.chip-field[data-field="${fieldName}"]`);
  if (!field) return false;
  return [...field.querySelectorAll('.chip-btn--active')].some(b => b.dataset.value === value);
}

/** بنود الدخل والمصروفات كما هي معروضة في المحطة 6. */
function readFinancialRows(selector) {
  return [...DOM.qsa(selector)].map(row => ({
    label: (row.querySelector('[data-item-label]')?.textContent || '').trim(),
    amount: Number(row.querySelector('[data-item-amount]')?.textContent.replace(/[^\d.-]/g, '') || 0),
    period: (row.querySelector('[data-item-period]')?.textContent || '').trim()
  })).filter(r => r.label);
}

/**
 * يبني كائن حالة من الحالة الحالية لشاشة الإدخال.
 * الحقول غير المستوفاة تُترك فارغة عمدًا — صفحة التفاصيل هي التي تعلّمها كناقصة.
 */
export function collectCaseFromForm() {
  const members = store.familyMembers || [];
  const agri = store.agriculture || {};

  const incomeItems = readFinancialRows('#income-items-list .financial-item');
  const expenseItems = readFinancialRows('#expense-items-list .financial-item');
  const totalIncome = incomeItems.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenseItems.reduce((s, i) => s + i.amount, 0);

  const supportTypes = [...DOM.qsa('.support-type-checkbox:checked, [id^="support-type-"]:checked')]
    .map(el => ({
      title: (el.closest('label')?.textContent || el.dataset.label || '').trim(),
      option: '', amount: '', urgency: ''
    }))
    .filter(t => t.title);

  return {
    id: 'المسودة الحالية',
    isDraft: true,
    name: val('case-name'),
    nid: val('national-id'),
    registrationDate: new Date().toISOString().slice(0, 10),
    familyMembersCount: members.length + 1,
    phone: val('phone1'),
    charity: DOM.qs('#referral-charity-select')?.selectedOptions?.[0]?.textContent.trim() || '',
    center: val('district'),
    village: val('village'),
    status: 'pending',
    statusLabel: '📝 مسودة — قيد الإدخال',
    statusClass: 'dash-status-pill--warning',

    demographics: {
      education: val('education-level'),
      age: num('current-age'),
      gender: val('gender'),
      religion: val('religion'),
      birthGovernorate: val('governorate'),
      phonePrimary: val('phone1'),
      phoneSecondary: val('phone2'),
      job: val('job-title'),
      monthlyIncome: num('head-monthly-income'),
      takafulBeneficiary: isYes('head-takaful-karama'),
      takafulAmount: num('head-takaful-amount'),
      address: val('address'),
      maritalStatus: val('head-relation'),
      healthStatus: '',
      employmentStatus: val('work-type')
    },

    familyMembers: members,

    attachments: [...DOM.qsa('#attachments-list .attachment-item')].map(el => ({
      title: (el.querySelector('[data-att-title]')?.textContent || '').trim(),
      docType: (el.querySelector('[data-att-type]')?.textContent || '').trim(),
      fileName: (el.querySelector('[data-att-file]')?.textContent || '').trim(),
      uploadedAt: (el.querySelector('[data-att-date]')?.textContent || '').trim(),
      status: 'مرفوعة'
    })),

    housing: {
      description: val('housing-description'),
      ownership: chips('housingType'),
      walls: chips('walls'),
      roof: chips('roof'),
      floor: chips('floor'),
      entrance: chips('entrance'),
      bathroomCondition: chips('bathroom'),
      electricity: chips('electricity'),
      water: chips('waterMeter'),
      waterMotor: chipHas('waterMotor', 'يوجد'),
      appliances: {
        fridge: chipHas('appliances', 'ثلاجة'),
        washer: chipHas('appliances', 'غسالة'),
        oven: chipHas('appliances', 'فرن'),
        stove: chipHas('appliances', 'بوتاجاز'),
        computer: chipHas('appliances', 'كمبيوتر'),
        tv: chipHas('appliances', 'تلفاز'),
        freezer: chipHas('appliances', 'ديب فريزر')
      },
      transport: chips('transport'),
      internet: chipHas('internet', 'متوفر'),
      buildingType: chips('walls'),
      roomsCount: val('rooms-count'),
      sanitation: chips('bathroom')
    },

    utilities: {
      hasElectricity: Boolean(chips('electricity')),
      hasWater: Boolean(chips('waterMeter')),
      hasGas: Boolean(chips('gas')),
      hasSewage: Boolean(chips('sewage')),
      devices: {
        fridge: chipHas('devices', 'ثلاجة'),
        washer: chipHas('devices', 'غسالة'),
        tv: chipHas('devices', 'تلفاز'),
        screen: chipHas('devices', 'شاشة'),
        stove: chipHas('devices', 'بوتاجاز')
      },
      electricity: chips('electricity'),
      water: chips('waterMeter'),
      gas: chips('gas')
    },

    agriculture: {
      hasLand: agri.hasLand || '',
      landType: agri.landType || '',
      landArea: agri.landArea || 0,
      landRentAmount: agri.landRentAmount || 0,
      landAnnualIncome: agri.landAnnualIncome || 0,
      cropType: agri.cropType || '',
      hasLivestock: agri.hasLivestock || '',
      livestockTypes: agri.livestockTypes || [],
      livestockDetails: agri.livestockDetails || '',
      notes: agri.notes || ''
    },

    financial: {
      incomeItems,
      expenseItems,
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      medicalExpense: 0
    },

    support: {
      types: supportTypes,
      notes: val('support-notes'),
      approvedSupport: null
    },

    // الآراء لا تُكتب من شاشة الإدخال
    workerOpinion: null,
    reviewerOpinion: null,
    managerApproval: null,
    assessedNeeds: []
  };
}
