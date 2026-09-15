/* --------------------------------------------------------------------------
   BENI SUEF MOCK SOCIAL BENEFICIARY CASES DATASET

   بنية الحالة مطابقة لأقسام NEHDA_CASE_MA.md الثمانية:
     1. البيانات الأساسية + الأفراد التابعين   (demographics + familyMembers)
     2. المرفقات                                (attachments)
     3. السكن                                   (housing)
     4. المرافق والتجهيزات                       (utilities)
     5. الحيازة والأصول الزراعية                  (agriculture)
     6. الدخل والمصروفات                         (financial)
     7. الدعم                                    (support)
     8. الرأي                                    (workerOpinion/reviewerOpinion/managerApproval)

   البنود المعلَّمة بـ auto:true مصدرها قسم آخر (دخل رب الأسرة، تكافل، دخل
   أو إيجار الأرض) وبتتعرض مقفولة 🔒 في صفحة تفاصيل الحالة.
   -------------------------------------------------------------------------- */

export const MOCK_CASES = [
  {
    id: 'CASE-101',
    createdBy: 'حسن',
    name: 'أحمد محمود علي عبد الفتاح',
    nid: '29805142200154',
    registrationDate: '2026-08-12',
    familyMembersCount: 5,
    phone: '01012345678',
    charity: 'جمعية النهضة للتنمية والتطوير',
    center: 'بني سويف',
    village: 'إبشنا',
    status: 'pending',
    statusLabel: 'قيد المراجعة',
    statusClass: 'dash-status-pill--warning',

    // 1. البيانات الأساسية
    demographics: {
      education: 'ابتدائية',
      age: 48,
      gender: 'ذكر',
      religion: 'مسلم',
      birthGovernorate: 'بني سويف',
      phonePrimary: '01012345678',
      phoneSecondary: '01198765432',
      job: 'عامل يومية بالزراعة',
      monthlyIncome: 1200,
      takafulBeneficiary: true,
      takafulAmount: 450,
      address: 'قرية إبشنا — مركز بني سويف — شارع المدارس',
      maritalStatus: 'متزوج ويعول',
      healthStatus: 'مرض مزمن (السكر والضغط) يعوق عن العمل الكلي',
      employmentStatus: 'عمالة غير منتظمة (بدون عمل ثابت)'
    },

    // 1ب. الأفراد التابعين
    familyMembers: [
      { name: 'سعاد إبراهيم علي حسن', relation: 'الزوجة', nid: '29907142200486', age: 42,
        isStudent: false, education: 'يقرأ ويكتب', job: 'ربة منزل', monthlyIncome: 0,
        takafulBeneficiary: false, takafulAmount: 0, notes: 'تعاني من أنيميا مزمنة' },
      { name: 'محمود أحمد محمود علي', relation: 'الابن', nid: '31005142201234', age: 16,
        isStudent: true, stage: 'ثانوي', grade: 'الصف الأول الثانوي', university: '',
        job: '', monthlyIncome: 0, takafulBeneficiary: false, takafulAmount: 0, notes: '' },
      { name: 'فاطمة أحمد محمود علي', relation: 'الابنة', nid: '31203142205678', age: 13,
        isStudent: true, stage: 'إعدادي', grade: 'الصف الثاني الإعدادي', university: '',
        job: '', monthlyIncome: 0, takafulBeneficiary: false, takafulAmount: 0, notes: '' },
      { name: 'يوسف أحمد محمود علي', relation: 'الابن', nid: '31508142209876', age: 9,
        isStudent: true, stage: 'ابتدائي', grade: 'الصف الثالث الابتدائي', university: '',
        job: '', monthlyIncome: 0, takafulBeneficiary: false, takafulAmount: 0, notes: '' }
    ],

    // 2. المرفقات
    attachments: [
      { title: 'بطاقة الرقم القومي رب الأسرة والزوجة', docType: 'بطاقة شخصية', fileName: 'id-card.pdf', uploadedAt: '2026-08-12', status: 'مستوفاة' },
      { title: 'قسيمة الزواج المميكنة', docType: 'مستندات الأسرة', fileName: 'marriage.pdf', uploadedAt: '2026-08-12', status: 'مستوفاة' },
      { title: 'شهادات ميلاد الأبناء (3 أبناء في المدارس)', docType: 'مستندات الأسرة', fileName: 'birth-certs.pdf', uploadedAt: '2026-08-13', status: 'مستوفاة' },
      { title: 'تقرير طبي من مستشفى بني سويف العام', docType: 'مستندات علاج', fileName: 'medical.jpg', uploadedAt: '2026-08-14', status: 'مستوفاة' },
      { title: 'برنت تأمينات اجتماعية (غير مؤمن عليه)', docType: 'مستندات دخل', fileName: 'insurance.pdf', uploadedAt: '2026-08-14', status: 'مستوفاة' }
    ],

    // 3. السكن
    housing: {
      description: 'منزل متهالك يعاني من تسرب مياه الأمطار شتاءً ويحتاج ترميم عاجل للسقف.',
      ownership: 'إيجار قديم (متهالك)',
      walls: 'طوب لبن',
      roof: 'خشب وجريد',
      floor: 'أرضية ترابية',
      entrance: 'مدخل مشترك',
      bathroomCondition: 'حمام بلدي متهالك يتطلب صيانة عاجلة',
      electricity: 'عداد كارت',
      water: 'عداد مياه',
      waterMotor: false,
      appliances: { fridge: true, washer: true, oven: false, stove: true, computer: false, tv: true, freezer: false },
      transport: 'لا يوجد',
      internet: false,
      buildingType: 'منزل طوب لبن وسقف خشب وجريد',
      roomsCount: 'غرفتان ومطبخ صغير',
      sanitation: 'وصلة حمام بلدي متهالكة تتطلب صيانة عاجلة'
    },

    // 4. المرافق والتجهيزات
    utilities: {
      hasElectricity: true,
      hasWater: true,
      hasGas: false,
      hasSewage: false,
      devices: { fridge: true, washer: true, tv: true, screen: false, stove: true },
      electricity: 'عداد كهرباء كارت (عداد قديم)',
      water: 'وصلة مياه شرب عمومية متصلة',
      gas: 'أنبوبة بوتاجاز'
    },

    // 5. الحيازة والأصول الزراعية
    agriculture: {
      hasLand: 'no',
      landType: '',
      landArea: 0,
      landRentAmount: 0,
      landAnnualIncome: 0,
      cropType: '',
      hasLivestock: 'no',
      livestockTypes: [],
      livestockDetails: '',
      notes: 'الأسرة لا تملك أي حيازة زراعية أو ثروة حيوانية.',
      holdingArea: 'لا يوجد حيازة زراعية (0 فدان)',
      livestock: 'لا يوجد مواشي أو أجهزة إنتاجية'
    },

    // 6. الدخل والمصروفات
    financial: {
      incomeItems: [
        { label: 'دخل رب الأسرة', amount: 1200, period: 'شهري', auto: true, source: 'البيانات الأساسية' },
        { label: 'معاش', amount: 0, period: 'شهري', auto: true, source: 'البيانات الأساسية' },
        { label: 'تكافل وكرامة', amount: 450, period: 'شهري', auto: true, source: 'رب الأسرة والأفراد' }
      ],
      expenseItems: [
        { label: 'الأكل والشرب', amount: 900, fixed: true },
        { label: 'المصروفات الدراسية', amount: 250, fixed: true },
        { label: 'الكهرباء', amount: 90, fixed: true },
        { label: 'المياه', amount: 45, fixed: true },
        { label: 'الغاز', amount: 65, fixed: true },
        { label: 'الإيجار', amount: 450, fixed: true },
        { label: 'القسط', amount: 0, fixed: true }
      ],
      medicalExpense: 500,
      totalIncome: 1650,
      totalExpenses: 1800,
      netBalance: -150,
      pensions: 0,
      rentExpense: 450
    },

    // 7. الدعم
    support: {
      types: [
        { title: 'كفالة مالية شهرية منتظمة', option: 'كفالة شهرية', amount: '800 ج.م / شهرياً', urgency: 'عاجل جداً' },
        { title: 'كرتونة مواد غذائية', option: 'كرتونة شهرية', amount: 'سلة شهرياً', urgency: 'عاجل' },
        { title: 'دعم المرافق', option: 'سقف', amount: 'ترميم وتغطية السقف بالصاج العازل', urgency: 'أولوية قصوى' },
        { title: 'دعم طبي', option: 'علاج', amount: '400 ج.م / شهرياً', urgency: 'مستمر' }
      ],
      notes: 'الأولوية القصوى لترميم السقف قبل فصل الشتاء.',
      approvedSupport: null
    },

    // 8. الرأي
    workerOpinion: {
      decision: 'accepted',
      notes: 'تم إجراء الزيارة الميدانية لقرية إبشنا. حالة الأسرة معيشياً صعبة جداً، رب الأسرة يعاني من ظروف صحية تمنعه من العمل المنتظم، والمنزل يعاني من تسرب مياه الأمطار في فصل الشتاء وسقف الجريد يحتاج لترميم فوري. توصية الأخصائي: الإسراع في صرف المساعدة المالية الشاملة وتحسين جودة السكن.',
      author: 'سارة محمد إبراهيم',
      date: '2026-08-18'
    },
    reviewerOpinion: {
      submitted: true,
      decision: 'accepted',
      notes: 'راجعت المستندات والبحث الميداني. التقرير الطبي وبرنت التأمينات متطابقان مع ما ورد في الزيارة، ولا يوجد دخل ثابت. أؤيد توصية الأخصائي وأرفع الملف للاعتماد النهائي.',
      author: 'حسن علاء',
      date: '2026-08-24'
    },
    managerApproval: null,

    assessedNeeds: [
      { title: 'كفالة مالية شهرية منتظمة', amount: '800 ج.م / شهرياً', urgency: 'عاجل جداً' },
      { title: 'كرتونة مواد غذائية سلة خضار وتموين', amount: 'سلة شهرياً', urgency: 'عاجل' },
      { title: 'ترميم وتغطية سقف المنزل بالصاج العازل', amount: 'مشروع هندسي', urgency: 'أولوية قصوى' },
      { title: 'دعم علاج وأدوية شهرية لرب الأسرة', amount: '400 ج.م / شهرياً', urgency: 'مستمر' }
    ]
  },
  {
    id: 'CASE-102',
    createdBy: 'محمود علي عبد الرحمن',
    name: 'نادية عبد الرحمن السيد محمد',
    nid: '28504011200328',
    registrationDate: '2026-07-03',
    familyMembersCount: 4,
    phone: '01122334455',
    charity: 'جمعية الرحمة الخيرية',
    center: 'ناصر',
    village: 'بني هارون',
    status: 'accepted',
    statusLabel: 'حالة مقبولة',
    statusClass: 'dash-status-pill--success',

    demographics: {
      education: 'متوسط',
      age: 41,
      gender: 'أنثى',
      religion: 'مسلمة',
      birthGovernorate: 'بني سويف',
      phonePrimary: '01122334455',
      phoneSecondary: '',
      job: 'خياطة منزلية',
      monthlyIncome: 700,
      takafulBeneficiary: true,
      takafulAmount: 600,
      address: 'قرية بني هارون — مركز ناصر — بجوار المسجد الكبير',
      maritalStatus: 'أرملة تعول',
      healthStatus: 'حالة صحية مستقرة',
      employmentStatus: 'عمل منزلي غير منتظم'
    },

    familyMembers: [
      { name: 'أميرة محمد سعيد عبد الله', relation: 'الابنة', nid: '30906011201122', age: 19,
        isStudent: true, stage: 'جامعة', grade: 'الفرقة الثانية', university: 'جامعة بني سويف',
        job: '', monthlyIncome: 0, takafulBeneficiary: false, takafulAmount: 0, notes: 'متفوقة دراسياً' },
      { name: 'كريم محمد سعيد عبد الله', relation: 'الابن', nid: '31104011203344', age: 15,
        isStudent: true, stage: 'ثانوي', grade: 'الصف الأول الثانوي', university: '',
        job: '', monthlyIncome: 0, takafulBeneficiary: false, takafulAmount: 0, notes: '' },
      { name: 'سلمى محمد سعيد عبد الله', relation: 'الابنة', nid: '31402011205566', age: 12,
        isStudent: true, stage: 'إعدادي', grade: 'الصف الأول الإعدادي', university: '',
        job: '', monthlyIncome: 0, takafulBeneficiary: false, takafulAmount: 0, notes: '' }
    ],

    attachments: [
      { title: 'بطاقة الرقم القومي للزوجة', docType: 'بطاقة شخصية', fileName: 'nid.pdf', uploadedAt: '2026-07-03', status: 'مستوفاة' },
      { title: 'شهادة وفاة الزوج الرسمية', docType: 'مستندات الأسرة', fileName: 'death-cert.pdf', uploadedAt: '2026-07-03', status: 'مستوفاة' },
      { title: 'شهادات ميلاد الأبناء القصر', docType: 'مستندات الأسرة', fileName: 'kids.pdf', uploadedAt: '2026-07-04', status: 'مستوفاة' },
      { title: 'بحث اجتماعي ميداني موثق', docType: 'أخرى', fileName: 'field-study.pdf', uploadedAt: '2026-07-08', status: 'مستوفاة' }
    ],

    housing: {
      description: 'شقة صغيرة بحالة مقبولة، تحتاج صيانة بسيطة للحمام.',
      ownership: 'ملك',
      walls: 'طوب أحمر',
      roof: 'خرسانة مسلحة',
      floor: 'بلاط',
      entrance: 'مدخل مستقل',
      bathroomCondition: 'حمام إفرنجي بحالة مقبولة',
      electricity: 'عداد كودي',
      water: 'عداد مياه',
      waterMotor: true,
      appliances: { fridge: true, washer: true, oven: true, stove: true, computer: true, tv: true, freezer: false },
      transport: 'دراجة',
      internet: true,
      buildingType: 'شقة بعقار خرساني',
      roomsCount: 'ثلاث غرف وصالة',
      sanitation: 'صرف صحي عمومي'
    },

    utilities: {
      hasElectricity: true,
      hasWater: true,
      hasGas: true,
      hasSewage: true,
      devices: { fridge: true, washer: true, tv: true, screen: true, stove: true },
      electricity: 'عداد كهرباء كودي',
      water: 'وصلة مياه شرب داخلية',
      gas: 'غاز طبيعي'
    },

    agriculture: {
      hasLand: 'no',
      landType: '',
      landArea: 0,
      landRentAmount: 0,
      landAnnualIncome: 0,
      cropType: '',
      hasLivestock: 'yes',
      livestockTypes: ['دواجن'],
      livestockDetails: 'تربية دواجن منزلية محدودة (حوالي 12 طائر) للاستهلاك الذاتي.',
      notes: 'لا توجد أرض زراعية، وتربية الدواجن للاستهلاك وليست مصدر دخل.',
      holdingArea: 'لا يوجد حيازة زراعية',
      livestock: 'دواجن منزلية للاستهلاك الذاتي'
    },

    financial: {
      incomeItems: [
        { label: 'دخل رب الأسرة', amount: 700, period: 'شهري', auto: true, source: 'البيانات الأساسية' },
        { label: 'معاش', amount: 850, period: 'شهري', auto: true, source: 'البيانات الأساسية' },
        { label: 'تكافل وكرامة', amount: 600, period: 'شهري', auto: true, source: 'رب الأسرة والأفراد' }
      ],
      expenseItems: [
        { label: 'الأكل والشرب', amount: 1000, fixed: true },
        { label: 'المصروفات الدراسية', amount: 600, fixed: true },
        { label: 'الكهرباء', amount: 120, fixed: true },
        { label: 'المياه', amount: 50, fixed: true },
        { label: 'الغاز', amount: 70, fixed: true },
        { label: 'الإيجار', amount: 0, fixed: true },
        { label: 'القسط', amount: 0, fixed: true }
      ],
      medicalExpense: 150,
      totalIncome: 2150,
      totalExpenses: 1840,
      netBalance: 310,
      pensions: 850,
      rentExpense: 0
    },

    support: {
      types: [
        { title: 'منح دراسية', option: 'منحة جامعية', amount: '3,000 ج.م سنوياً', urgency: 'عاجل' },
        { title: 'دعم أجهزة منزلية', option: 'ماكينة خياطة', amount: 'ماكينة خياطة صناعية', urgency: 'تمكين اقتصادي' },
        { title: 'كرتونة مواد غذائية', option: 'كرتونة شهرية', amount: 'سلة شهرياً', urgency: 'مستمر' }
      ],
      notes: 'التمكين الاقتصادي هنا أجدى من الكفالة المستمرة.',
      approvedSupport: {
        type: 'تمكين اقتصادي — ماكينة خياطة + منحة دراسية',
        amount: '8,500 ج.م (دفعة واحدة) + 3,000 ج.م سنوياً',
        beneficiary: 'نادية عبد الرحمن السيد محمد',
        approvedAt: '2026-07-21',
        notes: 'يُصرف الدعم وفق التوصية مع متابعة المشروع بعد ثلاثة أشهر لتقييم الاستدامة.'
      }
    },

    workerOpinion: {
      decision: 'accepted',
      notes: 'الأسرة ملتزمة ومستحقة. المستفيدة لديها رغبة وإمكانية في إدارة مشروع بقالة صغيرة أو مشغل خياطة لتمكين الأسرة ذاتياً وتأمين مصدر دخل دائم للأطفال. توصية الأخصائي: الموافقة على الدعم والتمكين الاقتصادي.',
      author: 'أحمد مصطفى كمال',
      date: '2026-07-10'
    },
    reviewerOpinion: {
      submitted: true,
      decision: 'accepted',
      notes: 'شهادة الوفاة والبحث الاجتماعي مستوفيان. الأسرة أرملة تعول قصر بلا معيل، والتمكين الاقتصادي هنا أجدى من الكفالة المستمرة. أوصي بالقبول مع مكوّن تمكين.',
      author: 'حسن علاء',
      date: '2026-07-16'
    },
    managerApproval: {
      decision: 'approved',
      notes: 'معتمد. يُصرف الدعم وفق التوصية مع متابعة المشروع الصغير بعد ثلاثة أشهر لتقييم الاستدامة.',
      author: 'حسن علاء حافظ',
      date: '2026-07-21'
    },

    assessedNeeds: [
      { title: 'منحة دراسية جامعية للابنة المتفوقة', amount: '3,000 ج.م سنوياً', urgency: 'عاجل' },
      { title: 'ماكينة خياطة صناعية للتمكين الاقتصادي', amount: '8,500 ج.م', urgency: 'تمكين اقتصادي' },
      { title: 'كرتونة مواد غذائية شهرية', amount: 'سلة شهرياً', urgency: 'مستمر' }
    ]
  },
  {
    id: 'CASE-103',
    createdBy: 'حسن',
    name: 'محمود عبد العزيز مصطفى إبراهيم',
    nid: '28712203300471',
    registrationDate: '2026-09-01',
    familyMembersCount: 6,
    phone: '01033445566',
    charity: 'جمعية البر والتقوى',
    center: 'ببا',
    village: 'الزيتون',
    status: 'pending',
    statusLabel: 'قيد المراجعة',
    statusClass: 'dash-status-pill--warning',

    demographics: {
      education: 'إعدادية',
      age: 39,
      gender: 'ذكر',
      religion: 'مسلم',
      birthGovernorate: 'بني سويف',
      phonePrimary: '01033445566',
      phoneSecondary: '01566778899',
      job: 'بائع متجول',
      monthlyIncome: 950,
      takafulBeneficiary: true,
      takafulAmount: 450,
      address: 'قرية الزيتون — مركز ببا — خلف الوحدة الصحية',
      maritalStatus: 'متزوج ويعول',
      healthStatus: 'إعاقة حركية بالطرف السفلي',
      employmentStatus: 'عمل حر محدود الدخل'
    },

    familyMembers: [
      { name: 'هدى سيد محمود علي', relation: 'الزوجة', nid: '29105203302233', age: 35,
        isStudent: false, education: 'ابتدائية', job: 'ربة منزل', monthlyIncome: 0,
        takafulBeneficiary: false, takafulAmount: 0, notes: '' },
      { name: 'عبد العزيز محمود عبد العزيز', relation: 'الابن', nid: '31007203304455', age: 17,
        isStudent: true, stage: 'ثانوي', grade: 'الصف الثاني الثانوي', university: '',
        job: '', monthlyIncome: 0, takafulBeneficiary: false, takafulAmount: 0, notes: '' },
      { name: 'مريم محمود عبد العزيز', relation: 'الابنة', nid: '31203203306677', age: 14,
        isStudent: true, stage: 'إعدادي', grade: 'الصف الثالث الإعدادي', university: '',
        job: '', monthlyIncome: 0, takafulBeneficiary: false, takafulAmount: 0, notes: '' },
      { name: 'أحمد محمود عبد العزيز', relation: 'الابن', nid: '31409203308899', age: 11,
        isStudent: true, stage: 'ابتدائي', grade: 'الصف الخامس الابتدائي', university: '',
        job: '', monthlyIncome: 0, takafulBeneficiary: false, takafulAmount: 0, notes: '' },
      { name: 'زينب محمود عبد العزيز', relation: 'الابنة', nid: '31706203310011', age: 8,
        isStudent: true, stage: 'ابتدائي', grade: 'الصف الثاني الابتدائي', university: '',
        job: '', monthlyIncome: 0, takafulBeneficiary: false, takafulAmount: 0, notes: '' }
    ],

    attachments: [
      { title: 'بطاقة الرقم القومي', docType: 'بطاقة شخصية', fileName: 'nid.pdf', uploadedAt: '2026-09-01', status: 'مستوفاة' },
      { title: 'كارنيه التأهيل ومفصل الإعاقة', docType: 'مستندات علاج', fileName: 'disability.pdf', uploadedAt: '2026-09-01', status: 'مستوفاة' },
      { title: 'إثبات قيد مدرسي للأبناء', docType: 'مستندات تعليم', fileName: 'school.pdf', uploadedAt: '2026-09-02', status: 'مستوفاة' },
      { title: 'صور السكن من الزيارة الميدانية', docType: 'صور السكن', fileName: 'housing.jpg', uploadedAt: '2026-09-05', status: 'قيد المراجعة' }
    ],

    housing: {
      description: 'منزل إيجار بحالة متوسطة، المدخل غير مهيأ لذوي الإعاقة الحركية.',
      ownership: 'إيجار',
      walls: 'طوب أحمر',
      roof: 'أسقف خرسانية',
      floor: 'بلاط',
      entrance: 'مدخل بدرجات غير مهيأ',
      bathroomCondition: 'حمام بلدي يحتاج تعديل ليناسب الإعاقة',
      electricity: 'عداد كودي',
      water: 'عداد مياه',
      waterMotor: false,
      appliances: { fridge: true, washer: true, oven: false, stove: true, computer: false, tv: true, freezer: false },
      transport: 'لا يوجد',
      internet: false,
      buildingType: 'منزل طوب أحمر',
      roomsCount: 'ثلاث غرف',
      sanitation: 'صرف صحي عمومي'
    },

    utilities: {
      hasElectricity: true,
      hasWater: true,
      hasGas: false,
      hasSewage: true,
      devices: { fridge: true, washer: true, tv: true, screen: false, stove: true },
      electricity: 'عداد كهرباء كودي',
      water: 'وصلة مياه شرب داخلية',
      gas: 'أنبوبة بوتاجاز'
    },

    agriculture: {
      hasLand: 'yes',
      landType: 'إيجار',
      landArea: 0.5,
      landRentAmount: 2400,
      landAnnualIncome: 0,
      cropType: 'خضروات موسمية',
      hasLivestock: 'yes',
      livestockTypes: ['أغنام / ماعز', 'دواجن'],
      livestockDetails: 'رأسان من الماعز و15 طائر دواجن.',
      notes: 'نصف فدان إيجار لزراعة خضروات موسمية لمساعدة دخل الأسرة.',
      holdingArea: 'نصف فدان إيجار',
      livestock: 'ماعز ودواجن محدودة'
    },

    financial: {
      incomeItems: [
        { label: 'دخل رب الأسرة', amount: 950, period: 'شهري', auto: true, source: 'البيانات الأساسية' },
        { label: 'معاش', amount: 450, period: 'شهري', auto: true, source: 'البيانات الأساسية' },
        { label: 'تكافل وكرامة', amount: 450, period: 'شهري', auto: true, source: 'رب الأسرة والأفراد' }
      ],
      expenseItems: [
        { label: 'الأكل والشرب', amount: 1100, fixed: true },
        { label: 'المصروفات الدراسية', amount: 500, fixed: true },
        { label: 'الكهرباء', amount: 100, fixed: true },
        { label: 'المياه', amount: 50, fixed: true },
        { label: 'الغاز', amount: 70, fixed: true },
        { label: 'الإيجار', amount: 650, fixed: true },
        { label: 'القسط', amount: 0, fixed: true },
        { label: 'إيجار أراضي زراعية', amount: 200, fixed: true, auto: true, source: 'الحيازة الزراعية' }
      ],
      medicalExpense: 400,
      totalIncome: 1850,
      totalExpenses: 2670,
      netBalance: -820,
      pensions: 450,
      rentExpense: 650
    },

    support: {
      types: [
        { title: 'زي مدرسي ومصروفات دراسية', option: 'مصروفات + زي', amount: '1,200 ج.م سنوي لكل طالب', urgency: 'عاجل' },
        { title: 'كفالة مالية شهرية', option: 'كفالة شهرية', amount: '700 ج.م / شهرياً', urgency: 'قيد المراجعة النهائي' },
        { title: 'دعم المرافق', option: 'حمام', amount: 'تعديل الحمام والمدخل ليناسب الإعاقة', urgency: 'عاجل' }
      ],
      notes: 'أربعة أبناء في مراحل التعليم مع إعاقة حركية لرب الأسرة.',
      approvedSupport: null
    },

    workerOpinion: {
      decision: 'accepted',
      notes: 'الحالة تستحق الدعم نظراً لارتفاع تكاليف الإيجار مع وجود الإعاقة الحركية ووجود 4 أبناء في التعليم. يوصى بتوفير كفالة تعليمية وكفالة مالية.',
      author: 'سارة محمد إبراهيم',
      date: '2026-09-06'
    },
    reviewerOpinion: null,
    managerApproval: null,

    assessedNeeds: [
      { title: 'دعم مصروفات مدرسية وسداد أقساط التعليم', amount: '1,200 ج.م سنوي لكل طالب', urgency: 'عاجل' },
      { title: 'كفالة مالية شهرية للأسر الأشد احتياجاً', amount: '700 ج.م / شهرياً', urgency: 'قيد المراجعة النهائي' }
    ]
  },
  {
    id: 'CASE-104',
    createdBy: 'محمود علي عبد الرحمن',
    name: 'سعيد كامل حسين عبد المجيد',
    nid: '27903104400219',
    registrationDate: '2026-05-20',
    familyMembersCount: 4,
    phone: '01277889900',
    charity: 'جمعية النهضة للتنمية والتطوير',
    center: 'الواسطى',
    village: 'كفر العرب',
    status: 'rejected',
    statusLabel: 'حالة مرفوضة',
    statusClass: 'dash-status-pill--danger',

    demographics: {
      education: 'فوق متوسط',
      age: 47,
      gender: 'ذكر',
      religion: 'مسلم',
      birthGovernorate: 'بني سويف',
      phonePrimary: '01277889900',
      phoneSecondary: '',
      job: 'فني بشركة مقاولات',
      monthlyIncome: 7500,
      takafulBeneficiary: false,
      takafulAmount: 0,
      address: 'كفر العرب — مركز الواسطى — شارع النيل',
      maritalStatus: 'متزوج ويعول',
      healthStatus: 'حالة صحية جيدة',
      employmentStatus: 'موظف بعقد دائم ومؤمن عليه'
    },

    familyMembers: [
      { name: 'منى عادل حسن محمود', relation: 'الزوجة', nid: '28408104402244', age: 42,
        isStudent: false, education: 'متوسط', job: 'ربة منزل', monthlyIncome: 0,
        takafulBeneficiary: false, takafulAmount: 0, notes: '' },
      { name: 'كامل سعيد كامل حسين', relation: 'الابن', nid: '30702104404466', age: 20,
        isStudent: true, stage: 'جامعة', grade: 'الفرقة الثالثة', university: 'جامعة القاهرة',
        job: '', monthlyIncome: 0, takafulBeneficiary: false, takafulAmount: 0, notes: '' },
      { name: 'ندى سعيد كامل حسين', relation: 'الابنة', nid: '31011104406688', age: 16,
        isStudent: true, stage: 'ثانوي', grade: 'الصف الأول الثانوي', university: '',
        job: '', monthlyIncome: 0, takafulBeneficiary: false, takafulAmount: 0, notes: '' }
    ],

    attachments: [
      { title: 'بطاقة الرقم القومي', docType: 'بطاقة شخصية', fileName: 'nid.pdf', uploadedAt: '2026-05-20', status: 'مستوفاة' },
      { title: 'مفردات مرتب الزوج من شركة المقاولات', docType: 'مستندات دخل', fileName: 'salary.pdf', uploadedAt: '2026-05-21', status: 'مستوفاة (تثبت دخل مرتفع)' },
      { title: 'برنت التأمينات الاجتماعية', docType: 'مستندات دخل', fileName: 'insurance.pdf', uploadedAt: '2026-05-21', status: 'مؤمن عليه بدخل مرتقب' }
    ],

    housing: {
      description: 'منزل ملك بحالة جيدة ومجهز بالكامل.',
      ownership: 'ملك',
      walls: 'طوب أحمر',
      roof: 'خرسانة مسلحة',
      floor: 'سيراميك',
      entrance: 'مدخل مستقل',
      bathroomCondition: 'حمامان إفرنجي بحالة جيدة',
      electricity: 'عداد كودي',
      water: 'عداد مياه',
      waterMotor: true,
      appliances: { fridge: true, washer: true, oven: true, stove: true, computer: true, tv: true, freezer: true },
      transport: 'سيارة ملاكي',
      internet: true,
      buildingType: 'منزل خرساني مسجل',
      roomsCount: 'أربع غرف وصالة',
      sanitation: 'صرف صحي عمومي'
    },

    utilities: {
      hasElectricity: true,
      hasWater: true,
      hasGas: true,
      hasSewage: true,
      devices: { fridge: true, washer: true, tv: true, screen: true, stove: true },
      electricity: 'عداد كهرباء كودي',
      water: 'وصلة مياه شرب داخلية',
      gas: 'غاز طبيعي'
    },

    agriculture: {
      hasLand: 'yes',
      landType: 'تمليك',
      landArea: 2,
      landRentAmount: 0,
      landAnnualIncome: 36000,
      cropType: 'قمح وذرة',
      hasLivestock: 'yes',
      livestockTypes: ['بقرة', 'جاموسة'],
      livestockDetails: 'بقرة حلوب وجاموسة، إنتاج ألبان يُباع محلياً.',
      notes: 'فدانان تمليك بدخل سنوي ثابت، بالإضافة لإنتاج الألبان.',
      holdingArea: 'فدانان تمليك',
      livestock: 'بقرة وجاموسة'
    },

    financial: {
      incomeItems: [
        { label: 'دخل رب الأسرة', amount: 7500, period: 'شهري', auto: true, source: 'البيانات الأساسية' },
        { label: 'معاش', amount: 0, period: 'شهري', auto: true, source: 'البيانات الأساسية' },
        { label: 'تكافل وكرامة', amount: 0, period: 'شهري', auto: true, source: 'رب الأسرة والأفراد' },
        { label: 'دخل الأرض الزراعية', amount: 3000, period: 'شهري', auto: true, source: 'الحيازة الزراعية (36,000 ÷ 12)' }
      ],
      expenseItems: [
        { label: 'الأكل والشرب', amount: 2500, fixed: true },
        { label: 'المصروفات الدراسية', amount: 1500, fixed: true },
        { label: 'الكهرباء', amount: 300, fixed: true },
        { label: 'المياه', amount: 100, fixed: true },
        { label: 'الغاز', amount: 150, fixed: true },
        { label: 'الإيجار', amount: 0, fixed: true },
        { label: 'القسط', amount: 1200, fixed: true }
      ],
      medicalExpense: 200,
      totalIncome: 10500,
      totalExpenses: 5750,
      netBalance: 4750,
      pensions: 0,
      rentExpense: 0
    },

    support: {
      types: [],
      notes: 'لم يُوصَ بأي دعم — الحالة غير مستحقة.',
      approvedSupport: null
    },

    workerOpinion: {
      decision: 'rejected',
      notes: 'من خلال البحث الميداني والتقصي التأميني وتبين وجود حيازة زراعية ومصدر دخل ثابت يتجاوز 7,500 ج.م شهرياً مع ملكية منزل مسجل، فالحالة غير مستحقة للدعم الاجتماعي المباشر ومرفوضة.',
      author: 'أحمد مصطفى كمال',
      date: '2026-05-27'
    },
    reviewerOpinion: {
      submitted: true,
      decision: 'rejected',
      notes: 'مفردات المرتب وبرنت التأمينات يؤكدان دخلاً ثابتاً فوق حد الاستحقاق، بالإضافة لملكية السكن والحيازة. أتفق مع الأخصائي في عدم الاستحقاق.',
      author: 'حسن علاء',
      date: '2026-06-02'
    },
    managerApproval: {
      decision: 'rejected',
      notes: 'مرفوضة نهائياً لعدم الاستحقاق. يُخطر مقدم الطلب بأسباب الرفض وحقه في التظلم خلال 30 يوماً.',
      author: 'حسن علاء حافظ',
      date: '2026-06-08'
    },

    assessedNeeds: []
  }
];
