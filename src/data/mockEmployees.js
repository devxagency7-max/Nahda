/* --------------------------------------------------------------------------
   MOCK EMPLOYEES DATASET — NEHDA CASE MANAGEMENT SYSTEM
   Initial roster of staff members ordered by organizational hierarchy:
   Manager -> Reviewer -> Social Worker -> Data Entry.
   -------------------------------------------------------------------------- */

export const DEFAULT_EMPLOYEES = [
  {
    id: 'EMP-101',
    name: 'حسن علاء حافظ',
    roleCode: 'manager',
    roleLabel: 'مدير',
    email: 'hassanalaahafez@gmail.com',
    password: 'Nahda#2026!mgr',
    phone: '01022334455',
    center: 'بني سويف',
    status: 'active',
    statusLabel: 'نشط 🟢',
    createdAt: '2026-01-01'
  },
  {
    id: 'EMP-102',
    name: 'حسن علاء',
    roleCode: 'reviewer',
    roleLabel: 'مراجع',
    email: 'hassanalaa@gmail.com',
    password: 'Nahda#2026!rev',
    phone: '01011223344',
    center: 'بني سويف',
    status: 'active',
    statusLabel: 'نشط 🟢',
    createdAt: '2026-01-10'
  },
  {
    id: 'EMP-103',
    name: 'سارة محمد إبراهيم',
    roleCode: 'social_worker',
    roleLabel: 'أخصائي اجتماعي ميداني',
    email: 'sara.mohamed@nahda.org.eg',
    password: 'Nahda#2026!s9x',
    phone: '01187654321',
    center: 'ناصر',
    status: 'active',
    statusLabel: 'نشط 🟢',
    createdAt: '2026-02-01'
  },
  {
    id: 'EMP-104',
    name: 'أحمد مصطفى كمال',
    roleCode: 'social_worker',
    roleLabel: 'أخصائي اجتماعي ميداني',
    email: 'ahmed.mostafa@nahda.org.eg',
    password: 'Nahda#2026!a4k',
    phone: '01234567890',
    center: 'ببا',
    status: 'active',
    statusLabel: 'نشط 🟢',
    createdAt: '2026-02-10'
  },
  {
    id: 'EMP-105',
    name: 'محمود علي عبد الرحمن',
    roleCode: 'data_entry',
    roleLabel: 'مدخل بيانات',
    email: 'mahmoud.ali@nahda.org.eg',
    password: 'Nahda#2026!m8d',
    phone: '01098765432',
    center: 'بني سويف',
    status: 'active',
    statusLabel: 'نشط 🟢',
    createdAt: '2026-01-15'
  },
  {
    id: 'EMP-106',
    name: 'حسن',
    roleCode: 'data_entry',
    roleLabel: 'مدخل بيانات',
    email: 'hassan@gmail.com',
    password: 'Nahda#2026!de1',
    phone: '01055667788',
    center: 'بني سويف',
    status: 'active',
    statusLabel: 'نشط 🟢',
    createdAt: '2026-01-20'
  }
];
