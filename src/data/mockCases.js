/* --------------------------------------------------------------------------
   BENI SUEF MOCK SOCIAL BENEFICIARY CASES DATASET
   Includes detailed records for case reviews: Demographics, Housing,
   Financials, Social Worker Assessments, and Assessed Needs.
   -------------------------------------------------------------------------- */

export const MOCK_CASES = [
  {
    id: 'CASE-101',
    name: 'أحمد محمود علي عبد الفتاح',
    nid: '29805142200154',
    familyMembersCount: 5,
    phone: '01012345678',
    charity: 'جمعية النهضة للتنمية والتطوير',
    center: 'بني سويف',
    village: 'إبشنا',
    status: 'pending',
    statusLabel: '🟡 قيد المراجعة',
    statusClass: 'dash-status-pill--warning',
    demographics: {
      address: 'قرية إبشنا — مركز بني سويف — شارع المدارس',
      maritalStatus: 'متزوج ويعول',
      healthStatus: 'مرض مزمن (السكر والضغط) يعوق عن العمل الكلي',
      employmentStatus: 'عمالة غير منتظمة (بدون عمل ثابت)'
    },
    attachments: [
      { title: 'بطاقة الرقم القومي رب الأسرة والزوجة', status: 'مستوفاة 🟢' },
      { title: 'قسيمة الزواج المميكنة', status: 'مستوفاة 🟢' },
      { title: 'شهادات ميلاد الأبناء (3 أبناء في المدارس)', status: 'مستوفاة 🟢' },
      { title: 'تقرير طبي من مستشفى بني سويف العام', status: 'مستوفاة 🟢' },
      { title: 'برنت تأمينات اجتماعية (غير مؤمن عليه)', status: 'مستوفاة 🟢' }
    ],
    housing: {
      ownership: 'إيجار قديم (متهالك)',
      buildingType: 'منزل طوب لبن وسقف خشب وجريد',
      roomsCount: 'غرفتان ومطبخ صغير',
      sanitation: 'وصلة حمام بلدي متهالكة تتطلب صيانة عاجلة'
    },
    utilities: {
      electricity: 'عداد كهرباء كارت (عداد قديم)',
      water: 'وصلة مياه شرب عمومية متصلة',
      gas: 'أنبوبة بوتاجاز'
    },
    agriculture: {
      holdingArea: 'لا يوجد حيازة زراعية (0 فدان)',
      livestock: 'لا يوجد مواشي أو أجهزة إنتاجية'
    },
    financial: {
      totalIncome: 1200,
      pensions: 0,
      rentExpense: 450,
      medicalExpense: 500,
      netBalance: 250
    },
    classification: {
      category: 'الأسر الأشد احتياجاً (أرامل ومخاطر صحية)',
      povertyIndex: '88 / 100 (مستحق بدرجة ممتازة)',
      eligibilityTier: 'الفئة (أ) — أولية قصوى للتدخل'
    },
    workerAssessment: 'تم إجراء الزيارة الميدانية لقرية إبشنا. حالة الأسرة معيشياً صعبة جداً، رب الأسرة يعاني من ظروف صحية تمنعه من العمل المنتظم، والمنزل يعاني من تسرب مياه الأمطار في فصل الشتاء وسقف الجريد يحتاج لترميم فوري. توصية الأخصائي: الإسراع في صرف المساعدة المالية الشاملة وتحسين جودة السكن.',
    assessedNeeds: [
      { title: 'كفالة مالية شهرية منتظمة', amount: '800 ج.م / شهرياً', urgency: 'عاجل جداً' },
      { title: 'كرتونة مواد غذائية سلة خضار وتموين', amount: 'سلة شهرياً', urgency: 'عاجل' },
      { title: 'ترميم وتغطية سقف المنزل بالصاج العازل', amount: 'مشروع هندسي', urgency: 'أولوية قصوى' },
      { title: 'دعم علاج وأدوية شهرية لرب الأسرة', amount: '400 ج.م / شهرياً', urgency: 'مستمر' }
    ]
  },
  {
    id: 'CASE-102',
    name: 'سارة سيد حسن إبراهيم',
    nid: '29511022201876',
    familyMembersCount: 4,
    phone: '01123456789',
    charity: 'جمعية الخير والإحسان',
    center: 'الفشن',
    village: 'اقفهص',
    status: 'accepted',
    statusLabel: '🟢 حالة مقبولة',
    statusClass: 'dash-status-pill--success',
    demographics: {
      address: 'قرية اقفهص — مركز الفشن — بني سويف',
      maritalStatus: 'أرملة وتكفل 3 أطفال بأعمار مختلفة',
      healthStatus: 'جيدة (رب المنزل تطلب دعم مشروعات صغيرة)',
      employmentStatus: 'ربة منزل بدون مصدر دخل ثابت'
    },
    attachments: [
      { title: 'بطاقة الرقم القومي للزوجة', status: 'مستوفاة 🟢' },
      { title: 'شهادة وفاة الزوج الرسمية', status: 'مستوفاة 🟢' },
      { title: 'شهادات ميلاد الأبناء القصر', status: 'مستوفاة 🟢' },
      { title: 'بحث اجتماعي ميداني موثق', status: 'مستوفاة 🟢' }
    ],
    housing: {
      ownership: 'ملك ورثة (بيت عائلة قديم)',
      buildingType: 'طوب أحمر وسقف خرسانة مسلحة جزئية',
      roomsCount: '3 غرف وصالة',
      sanitation: 'حمام كامل متصل بشبكة الصرف الصحي'
    },
    utilities: {
      electricity: 'عداد كهرباء قانوني',
      water: 'وصلة مياه حكومية مجهزة',
      gas: 'أنبوبة بوتاجاز'
    },
    agriculture: {
      holdingArea: 'لا يوجد حيازة أرض زراعية',
      livestock: 'مشروع تربية دواجن منزلية صغير'
    },
    financial: {
      totalIncome: 1800,
      pensions: 900,
      rentExpense: 0,
      medicalExpense: 300,
      netBalance: 600
    },
    classification: {
      category: 'أسر أيتام وأرامل قابلة للتمكين الاقتصادي',
      povertyIndex: '75 / 100',
      eligibilityTier: 'الفئة (ب) — دعم مشروعات وكفالة أيتام'
    },
    workerAssessment: 'الأسرة ملتزمة ومستحقة. المستفيدة لديها رغبة وإمكانية في إدارة مشروع بقالة صغيرة أو مشغل خياطة لتمكين الأسرة ذاتياً وتأمين مصدر دخل دائم للأطفال. توصية الأخصائي: الموافقة على الدعم والتمكين الاقتصادي.',
    assessedNeeds: [
      { title: 'تمويل مشروع كشك/بقالة صغيرة تمكين اقتصادي', amount: '15,000 ج.م (دفعة واحدة)', urgency: 'تم تنفيذ الاستحقاق' },
      { title: 'كفالة أيتام تعليمية للأبناء (3 طلاب)', amount: '600 ج.م / شهرياً', urgency: 'مستمر' }
    ]
  },
  {
    id: 'CASE-103',
    name: 'محمود عبد العزيز مصطفى',
    nid: '28903122200432',
    familyMembersCount: 6,
    phone: '01234567890',
    charity: 'جمعية الأمل لرعاية الأيتام',
    center: 'ناصر',
    village: 'دنديل',
    status: 'pending',
    statusLabel: '🟡 قيد المراجعة',
    statusClass: 'dash-status-pill--warning',
    demographics: {
      address: 'قرية دنديل — مركز ناصر — بني سويف',
      maritalStatus: 'متزوج ويعول 4 أبناء في مراحل التعليم',
      healthStatus: 'إعاقة حركية جزئية بالقدم اليسرى',
      employmentStatus: 'بائع متجول'
    },
    attachments: [
      { title: 'بطاقة الرقم القومي', status: 'مستوفاة 🟢' },
      { title: 'كارنيه التأهيل ومفصل الإعاقة', status: 'مستوفاة 🟢' },
      { title: 'إثبات قيد مدرسي للأبناء', status: 'مستوفاة 🟢' }
    ],
    housing: {
      ownership: 'إيجار جديد',
      buildingType: 'منزل طوب أحمر وخرسانة',
      roomsCount: 'غرفتان وصالة',
      sanitation: 'حمام مجهز'
    },
    utilities: {
      electricity: 'عداد كهرباء مسبق الدفع',
      water: 'وصلة مياه شرب قانونية',
      gas: 'غاز طبيعي متصل'
    },
    agriculture: {
      holdingArea: '0 فدان',
      livestock: 'لا يوجد'
    },
    financial: {
      totalIncome: 1400,
      pensions: 450,
      rentExpense: 650,
      medicalExpense: 400,
      netBalance: 100
    },
    classification: {
      category: 'ذوو الهمم والأسر الأكثر احتياجاً',
      povertyIndex: '82 / 100',
      eligibilityTier: 'الفئة (أ) — استحقاق عالي'
    },
    workerAssessment: 'الحالة تستحق الدعم نظراً لارتفاع تكاليف الإيجار مع وجود الإعاقة الحركية ووجود 4 أبناء في التعليم. يوصى بتوفير كفالة تعليمية وكفالة مالية.',
    assessedNeeds: [
      { title: 'دعم مصروفات مدرسية وسداد أقساط التعليم', amount: '1,200 ج.م سنوي لكل طالب', urgency: 'عاجل' },
      { title: 'كفالة مالية شهرية للأسر الأشد احتياجاً', amount: '700 ج.م / شهرياً', urgency: 'قيد المراجعة النهائي' }
    ]
  },
  {
    id: 'CASE-104',
    name: 'فاطمة رمضان حسين كمال',
    nid: '30107252200911',
    familyMembersCount: 3,
    phone: '01555443322',
    charity: 'جمعية المستقبل الساطع',
    center: 'ببا',
    village: 'قمبش الحمراء',
    status: 'rejected',
    statusLabel: '🔴 حالة مرفوضة',
    statusClass: 'dash-status-pill--danger',
    demographics: {
      address: 'قرية قمبش الحمراء — مركز ببا — بني سويف',
      maritalStatus: 'متزوجة والزوج يعمل بالخارج/القطاع الخاص',
      healthStatus: 'ممتازة',
      employmentStatus: 'الزوج يعمل بشركة مقاولات بدخل ثابت'
    },
    attachments: [
      { title: 'بطاقة الرقم القومي', status: 'مستوفاة 🟢' },
      { title: 'مفردات مرتب الزوج من شركة المقاولات', status: 'مستوفاة (تثبت دخل مرتفع) 🔴' },
      { title: 'برنت التأمينات الاجتماعية', status: 'مؤمن عليه بدخل مرتقب' }
    ],
    housing: {
      ownership: 'ملك خاص مسجل (عمارة حديثة)',
      buildingType: 'خرسانة مسلحة وشقة مجهزة بالكامل',
      roomsCount: '4 غرف وصالة واسعة',
      sanitation: 'شبكة صرف حديثة'
    },
    utilities: {
      electricity: 'عداد كهرباء منتظم',
      water: 'وصلة مياه شرب قانونية',
      gas: 'غاز طبيعي'
    },
    agriculture: {
      holdingArea: 'حيازة 1.5 فدان أرض زراعية ملك',
      livestock: 'رأس مواشي عدد 3'
    },
    financial: {
      totalIncome: 7500,
      pensions: 0,
      rentExpense: 0,
      medicalExpense: 300,
      netBalance: 7200
    },
    classification: {
      category: 'غير مستحق للدعم الخيري المباشر',
      povertyIndex: '20 / 100 (فوق مستوى الكفاف بكثير)',
      eligibilityTier: 'غير مستحق 🔴'
    },
    workerAssessment: 'من خلال البحث الميداني والتقصي التأميني وتبين وجود حيازة زراعية ومصدر دخل ثابت يتجاوز 7,500 ج.م شهرياً مع ملكية منزل مسجل، فالحالة غير مستحقة للدعم الاجتماعي المباشر ومرفوضة.',
    assessedNeeds: []
  }
];
