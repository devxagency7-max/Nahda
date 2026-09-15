/* --------------------------------------------------------------------------
   EMPLOYEES MANAGEMENT COMPONENT CONTROLLER (FOR MANAGERS & ADMINS)
   Handles automatic email & password generation (strictly read-only),
   role assignment, one-click credentials clipboard copying, staff roster,
   and UTF-8 CSV exports.
   -------------------------------------------------------------------------- */
import { store } from '../../state/store.js';
import { DOM } from '../../utils/dom.js';
import { showToast } from '../../utils/toast.js';
import { EventBus, EVENTS } from '../../core/event-bus.js';

// Common Arabic Names to Clean English Transliteration Dictionary
const COMMON_ARABIC_NAMES = {
  'محمد': 'mohamed', 'أحمد': 'ahmed', 'احمد': 'ahmed', 'محمود': 'mahmoud',
  'حسن': 'hassan', 'حسين': 'hussein', 'علي': 'ali', 'على': 'ali',
  'عمر': 'omar', 'عمرو': 'amr', 'إبراهيم': 'ibrahim', 'ابراهيم': 'ibrahim',
  'مصطفى': 'mostafa', 'مصطفي': 'mostafa', 'طارق': 'tarek', 'خالد': 'khaled',
  'كريم': 'karim', 'يوسف': 'youssef', 'سارة': 'sara', 'ساره': 'sara',
  'منى': 'mona', 'مني': 'mona', 'مريم': 'mariam', 'فاطمة': 'fatma', 'فاطمه': 'fatma',
  'آية': 'aya', 'ايه': 'aya', 'هدى': 'hoda', 'هدي': 'hoda',
  'عبدالله': 'abdullah', 'عبد الله': 'abdullah',
  'عبدالرحمن': 'abdelrahman', 'عبد الرحمن': 'abdelrahman',
  'عبدالعزيز': 'abdelaziz', 'عبد العزيز': 'abdelaziz',
  'عبدالكريم': 'abdelkarim', 'عبد الكريم': 'abdelkarim',
  'محسن': 'mohsen', 'عادل': 'adel', 'سامح': 'sameh', 'ياسر': 'yasser',
  'وليد': 'walid', 'علاء': 'alaa', 'حافظ': 'hafez', 'رمضان': 'ramadan',
  'شعبان': 'shaban', 'سعيد': 'saeed', 'رضا': 'reda', 'أيمن': 'ayman', 'ايمن': 'ayman',
  'أشرف': 'ashraf', 'اشرف': 'ashraf', 'هاني': 'hany', 'هانى': 'hany',
  'سامي': 'samy', 'سامى': 'samy', 'صلاح': 'salah', 'عثمان': 'othman',
  'جمال': 'gamal', 'سليمان': 'soliman', 'شريف': 'sherif', 'نادر': 'nader',
  'ماجد': 'maged', 'ممدوح': 'mamdouh', 'رأفت': 'raafat', 'مدحت': 'medhat',
  'عاطف': 'atef', 'عصام': 'essam', 'حسام': 'hossam', 'نبيل': 'nabil',
  'وسام': 'wesam', 'هشام': 'hesham', 'زياد': 'ziad', 'حمزة': 'hamza',
  'بلال': 'belal', 'إياد': 'eyad', 'اياد': 'eyad', 'آدم': 'adam', 'ادم': 'adam',
  'نور': 'nour', 'رنا': 'rana', 'سلمى': 'salma', 'سلمي': 'salma',
  'أسماء': 'asmaa', 'اسماء': 'asmaa', 'شيماء': 'shaimaa', 'دعاء': 'doaa',
  'إيمان': 'eman', 'ايمان': 'eman', 'دينا': 'dina', 'ندى': 'nada', 'ندي': 'nada',
  'شروق': 'shorouk', 'بسمة': 'basma', 'بسمه': 'basma', 'ياسمين': 'yasmin',
  'نورهان': 'nourhan', 'إسراء': 'esraa', 'اسراء': 'esraa', 'ريهام': 'reham',
  'هبة': 'heba', 'هبه': 'heba', 'نهى': 'noha', 'نهي': 'noha',
  'رانيا': 'rania', 'أميرة': 'amira', 'اميرة': 'amira', 'هند': 'hend',
  'سماح': 'samah', 'سلوى': 'salwa', 'سلوي': 'salwa', 'نجلاء': 'naglaa',
  'ولاء': 'walaa', 'وفاء': 'wafaa', 'سحر': 'sahar', 'أمل': 'amal', 'امل': 'amal',
  'إلهام': 'elham', 'الهام': 'elham'
};

// Fallback letter-by-letter transliteration
const ARABIC_TO_LATIN = {
  'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'a', 'ء': 'a',
  'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'g', 'ح': 'h',
  'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't',
  'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'k',
  'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h',
  'ة': 'a', 'و': 'w', 'ؤ': 'w', 'ي': 'y', 'ى': 'a', 'ئ': 'y'
};

const ROLE_LABELS = {
  manager: 'مدير',
  reviewer: 'مراجع',
  social_worker: 'أخصائي اجتماعي ميداني',
  data_entry: 'مدخل بيانات'
};

// Hierarchy order: Manager -> Reviewer -> Social Worker -> Data Entry
const ROLE_ORDER = {
  manager: 1,
  reviewer: 2,
  social_worker: 3,
  data_entry: 4
};

const ROLE_BADGE_CLASSES = {
  manager: 'emp-badge--emerald',
  reviewer: 'emp-badge--amber',
  social_worker: 'emp-badge--teal',
  data_entry: 'emp-badge--purple'
};

let currentFilterRole = 'all';
let currentSearchQuery = '';

/**
 * Smart transliteration of an Arabic name to a clean email (e.g. "محمود علي" -> "mahmoud.ali@nahda.org.eg")
 */
function generateEmailFromName(fullName) {
  if (!fullName || typeof fullName !== 'string') return '';
  const trimmed = fullName.trim();
  if (!trimmed) return '';

  // Check if input is already English
  if (/^[a-zA-Z\s.]+$/.test(trimmed)) {
    const parts = trimmed.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 2);
    return `${parts.join('.')}@nahda.org.eg`;
  }

  // Split words and handle compound names (like عبد الرحمن)
  let words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return '';

  // Merge 'عبد' with following word
  const mergedWords = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i] === 'عبد' && i + 1 < words.length) {
      mergedWords.push(`عبد ${words[i + 1]}`);
      i++;
    } else {
      mergedWords.push(words[i]);
    }
  }

  const transliteratedWords = mergedWords.slice(0, 2).map(w => {
    // 1. Check dictionary first
    if (COMMON_ARABIC_NAMES[w]) {
      return COMMON_ARABIC_NAMES[w];
    }
    // 2. Phonetic fallback
    let latin = '';
    for (let ch of w) {
      if (ARABIC_TO_LATIN[ch] !== undefined) {
        latin += ARABIC_TO_LATIN[ch];
      } else if (/[a-zA-Z0-9]/.test(ch)) {
        latin += ch.toLowerCase();
      }
    }
    return latin.toLowerCase();
  }).filter(Boolean);

  if (transliteratedWords.length === 0) return '';
  const prefix = transliteratedWords.join('.');
  return `${prefix}@nahda.org.eg`;
}

/**
 * Generates a secure, strong, employee password (e.g. Nahda#2026!7xK)
 */
function generateSecurePassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Nahda#2026!${rand}`;
}

/**
 * Safely copies text to clipboard with Toast confirmation
 */
async function copyToClipboard(text, successMsg = 'تم النسخ بنجاح 📋') {
  if (!text) {
    showToast('لا يوجد نص للنسخ ⚠️');
    return false;
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showToast(successMsg);
      return true;
    }
  } catch (err) {
    // Fallback for older contexts
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) {
      showToast(successMsg);
      return true;
    }
  } catch (err) { }

  showToast('تعذر النسخ التلقائي، يمكنك تحديد النص ونسخه يدوياً ⚠️');
  return false;
}

export function initEmployeesManager() {
  const form = DOM.qs('#employee-form');
  const editIdInput = DOM.qs('#employee-edit-id');
  const nameInput = DOM.qs('#employee-name-input');
  const roleSelect = DOM.qs('#employee-role-select');
  const emailInput = DOM.qs('#employee-email-input');
  const passwordInput = DOM.qs('#employee-password-input');
  const centerSelect = DOM.qs('#employee-center-select');
  const phoneInput = DOM.qs('#employee-phone-input');
  const submitText = DOM.qs('#employee-submit-text');
  const cancelBtn = DOM.qs('#btn-cancel-edit-employee');
  const formTitle = DOM.qs('#employee-form-title');

  const btnRegenPassword = DOM.qs('#btn-regen-password');
  const btnCopyEmail = DOM.qs('#btn-copy-email-field');
  const btnCopyPassword = DOM.qs('#btn-copy-password-field');
  const btnTogglePw = DOM.qs('#btn-toggle-emp-pw');
  const btnExport = DOM.qs('#btn-export-employees');

  const credentialsBox = DOM.qs('#credentials-showcase-box');
  const credName = DOM.qs('#cred-showcase-name');
  const credRole = DOM.qs('#cred-showcase-role');
  const credEmail = DOM.qs('#cred-showcase-email');
  const credPassword = DOM.qs('#cred-showcase-password');
  const btnCopyFull = DOM.qs('#btn-copy-full-credentials');

  const searchInput = DOM.qs('#employee-search-input');
  const rolePills = DOM.qsa('.employee-role-pill');
  const statCards = DOM.qsa('.employee-stat-card');

  // 1. Initial State: Auto-generate an initial password for a new employee
  if (passwordInput && !passwordInput.value) {
    passwordInput.value = generateSecurePassword();
  }

  // 2. Realtime Automatic Email Generation on Name Typing (Strictly Read-Only)
  if (nameInput && emailInput) {
    nameInput.addEventListener('input', () => {
      const isEditing = editIdInput && editIdInput.value;
      if (!isEditing) {
        const val = nameInput.value.trim();
        emailInput.value = generateEmailFromName(val);
        if (!passwordInput.value) {
          passwordInput.value = generateSecurePassword();
        }
      }
    });
  }

  // 3. Regenerate Password Button
  if (btnRegenPassword && passwordInput) {
    btnRegenPassword.addEventListener('click', (e) => {
      e.preventDefault();
      passwordInput.value = generateSecurePassword();
      passwordInput.type = 'text';
      if (btnTogglePw) btnTogglePw.textContent = '👁️';
      showToast('تم توليد كلمة مرور عشوائية جديدة 🔒');
    });
  }

  // 4. Copy Email & Copy Password Buttons in Form
  if (btnCopyEmail && emailInput) {
    btnCopyEmail.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard(emailInput.value, `تم نسخ البريد: ${emailInput.value} 📧`);
    });
  }

  if (btnCopyPassword && passwordInput) {
    btnCopyPassword.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard(passwordInput.value, `تم نسخ كلمة المرور: ${passwordInput.value} 🔑`);
    });
  }

  // 5. Password Visibility Toggle
  if (btnTogglePw && passwordInput) {
    btnTogglePw.addEventListener('click', (e) => {
      e.preventDefault();
      const isText = passwordInput.type === 'text';
      passwordInput.type = isText ? 'password' : 'text';
      btnTogglePw.textContent = isText ? '🔒' : '👁️';
    });
  }

  // 6. Copy Full Credentials from Showcase Box
  if (btnCopyFull) {
    btnCopyFull.addEventListener('click', (e) => {
      e.preventDefault();
      const name = credName ? credName.textContent : '';
      const role = credRole ? credRole.textContent : '';
      const email = credEmail ? credEmail.textContent : '';
      const pass = credPassword ? credPassword.textContent : '';
      const origin = window.location.origin + window.location.pathname;

      const fullText =
        `مرحباً بك يا ${name} 👋
تم إنشاء وتفعيل حسابك في منظومة مؤسسة النهضة ببني سويف:
------------------------------------------
• الدور الوظيفي: ${role}
• البريد الإلكتروني: ${email}
• كلمة المرور السرية: ${pass}
• رابط الدخول للمنظومة: ${origin}
------------------------------------------
يرجى الاحتفاظ ببيانات الدخول وعدم مشاركتها مع أطراف غير مصرح لها.`;

      copyToClipboard(fullText, 'تم نسخ بيانات الدخول بالكامل وهي جاهزة للإرسال للموظف 📋✨');
    });
  }

  // 7. Form Submission (Create / Update Employee)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameInput ? nameInput.value.trim() : '';
      const roleCode = roleSelect ? roleSelect.value : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';
      const center = centerSelect ? centerSelect.value : 'بني سويف';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const editId = editIdInput ? editIdInput.value : '';

      if (!name) {
        showToast('الرجاء إدخال اسم الموظف ⚠️');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!roleCode) {
        showToast('الرجاء اختيار الدور الوظيفي للموظف ⚠️');
        if (roleSelect) roleSelect.focus();
        return;
      }

      if (!email) {
        showToast('الرجاء توليد البريد الإلكتروني بكتابة الاسم ⚠️');
        return;
      }

      if (!password) {
        showToast('الرجاء توليد كلمة المرور السرية ⚠️');
        return;
      }

      const roleLabel = ROLE_LABELS[roleCode] || 'موظف';

      if (editId) {
        // Update Existing Employee
        store.updateEmployee(editId, {
          name,
          roleCode,
          roleLabel,
          email,
          password,
          center,
          phone
        });

        showToast(`تم تحديث بيانات الموظف (${name}) بنجاح ✨`);
      } else {
        // Create New Employee
        const newId = `EMP-${Date.now().toString().slice(-4)}`;
        const newEmployee = {
          id: newId,
          name,
          roleCode,
          roleLabel,
          email,
          password,
          center,
          phone,
          status: 'active',
          statusLabel: 'نشط 🟢',
          createdAt: new Date().toISOString().split('T')[0]
        };

        store.addEmployee(newEmployee);
        showToast(`تم إنشاء حساب الموظف (${name}) بدور [${roleLabel}] بنجاح 🚀`);
      }

      // Display Showcase Credentials Box immediately ready for copy!
      if (credentialsBox) {
        if (credName) credName.textContent = name;
        if (credRole) {
          credRole.textContent = roleLabel;
          credRole.className = `emp-role-text ${ROLE_BADGE_CLASSES[roleCode] || ''}`;
        }
        if (credEmail) credEmail.textContent = email;
        if (credPassword) credPassword.textContent = password;
        const timeEl = DOM.qs('#credentials-showcase-time');
        if (timeEl) timeEl.textContent = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        credentialsBox.style.display = 'block';
        credentialsBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      resetForm();
      renderEmployeesTable();
      updateEmployeesStats();
    });
  }

  // 8. Cancel Edit Handler
  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetForm();
    });
  }

  function resetForm() {
    if (form) form.reset();
    if (editIdInput) editIdInput.value = '';
    if (submitText) submitText.textContent = 'إنشاء حساب الموظف 🚀';
    if (formTitle) formTitle.textContent = 'إضافة موظف جديد';
    if (cancelBtn) cancelBtn.style.display = 'none';
    if (passwordInput) {
      passwordInput.value = generateSecurePassword();
      passwordInput.type = 'text';
    }
    if (btnTogglePw) btnTogglePw.textContent = '👁️';
    if (emailInput) emailInput.value = '';
  }

  // 9. Search Input Filtering
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearchQuery = searchInput.value.trim().toLowerCase();
      renderEmployeesTable();
    });
  }

  // 10. Role Pills Filtering
  rolePills.forEach(pill => {
    pill.addEventListener('click', () => {
      rolePills.forEach(p => p.classList.remove('employee-role-pill--active'));
      pill.classList.add('employee-role-pill--active');
      currentFilterRole = pill.getAttribute('data-role-filter') || 'all';
      renderEmployeesTable();
    });
  });

  // Also bind clicking on stats cards to filter by that role
  statCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetRole = card.getAttribute('data-role-filter');
      if (targetRole) {
        currentFilterRole = targetRole;
        rolePills.forEach(p => {
          p.classList.toggle('employee-role-pill--active', p.getAttribute('data-role-filter') === targetRole);
        });
        renderEmployeesTable();
      }
    });
  });

  // 11. Render Employees Table (Strictly Ordered by Hierarchy: Manager -> Reviewer -> Social Worker -> Data Entry)
  function renderEmployeesTable() {
    const tbody = DOM.qs('#employees-table-body');
    const emptyState = DOM.qs('#employees-empty-state');
    const tableEl = DOM.qs('#employees-table');
    if (!tbody) return;

    const allEmployees = store.employees || [];

    // Filter Employees
    const filtered = allEmployees.filter(emp => {
      const matchesRole = currentFilterRole === 'all' || emp.roleCode === currentFilterRole;

      const matchesSearch = !currentSearchQuery ||
        emp.name.toLowerCase().includes(currentSearchQuery) ||
        (emp.email && emp.email.toLowerCase().includes(currentSearchQuery)) ||
        (emp.roleLabel && emp.roleLabel.toLowerCase().includes(currentSearchQuery)) ||
        (emp.center && emp.center.toLowerCase().includes(currentSearchQuery)) ||
        (emp.phone && emp.phone.includes(currentSearchQuery));

      return matchesRole && matchesSearch;
    });

    // Sort strictly by hierarchy: Manager -> Reviewer -> Social Worker -> Data Entry
    filtered.sort((a, b) => {
      const rankA = ROLE_ORDER[a.roleCode] || 99;
      const rankB = ROLE_ORDER[b.roleCode] || 99;
      return rankA - rankB;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (tableEl) tableEl.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (tableEl) tableEl.style.display = 'table';

    tbody.innerHTML = filtered.map((emp, idx) => {
      const badgeClass = ROLE_BADGE_CLASSES[emp.roleCode] || 'emp-badge--emerald';

      return `
        <tr class="employee-row" data-emp-id="${emp.id}">
          <td style="text-align: center; font-weight: 700; color: #64748b;">${idx + 1}</td>
          <td>
            <strong class="emp-name">${DOM.escapeHTML(emp.name)}</strong>
          </td>
          <td>
            <span class="emp-role-text ${badgeClass}">${DOM.escapeHTML(emp.roleLabel || emp.roleCode)}</span>
          </td>
          <td>
            <div class="emp-code-copy-wrapper">
              <code class="emp-inline-code">${DOM.escapeHTML(emp.email)}</code>
              <button type="button" class="btn-copy-mini btn-copy-row-email" data-email="${DOM.escapeHTML(emp.email)}" title="نسخ البريد الإلكتروني">
                📋
              </button>
            </div>
          </td>
          <td>
            <div class="emp-code-copy-wrapper">
              <code class="emp-inline-code emp-pw-cell" data-pw="${DOM.escapeHTML(emp.password)}">••••••••</code>
              <button type="button" class="btn-copy-mini btn-toggle-row-pw" title="إظهار/إخفاء كلمة المرور">
                👁️
              </button>
              <button type="button" class="btn-copy-mini btn-copy-row-pw" data-pw="${DOM.escapeHTML(emp.password)}" title="نسخ كلمة المرور">
                📋
              </button>
            </div>
          </td>
          <td>
            <span class="emp-center-badge">📍 ${DOM.escapeHTML(emp.center || 'بني سويف')}</span>
          </td>
          <td style="text-align: center;">
            <div class="emp-row-actions">
              <button type="button" class="btn-action-icon btn-copy-row-full" data-emp-id="${emp.id}" title="نسخ بيانات الدخول كاملة">
                📋
              </button>
              <button type="button" class="btn-action-icon btn-edit-emp" data-emp-id="${emp.id}" title="تعديل الموظف">
                ✏️
              </button>
              <button type="button" class="btn-action-icon btn-action-icon--danger btn-delete-emp" data-emp-id="${emp.id}" title="حذف حساب الموظف">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Action Listeners in Table Rows
    bindTableActions(tbody);
  }

  function bindTableActions(container) {
    // 1. Copy Row Email
    container.querySelectorAll('.btn-copy-row-email').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const em = btn.getAttribute('data-email');
        copyToClipboard(em, `تم نسخ البريد: ${em} 📧`);
      });
    });

    // 2. Toggle Row Password Visibility
    container.querySelectorAll('.btn-toggle-row-pw').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pwEl = btn.closest('.emp-code-copy-wrapper')?.querySelector('.emp-pw-cell');
        if (pwEl) {
          const rawPw = pwEl.getAttribute('data-pw');
          const isMasked = pwEl.textContent === '••••••••';
          pwEl.textContent = isMasked ? rawPw : '••••••••';
          btn.textContent = isMasked ? '🔒' : '👁️';
        }
      });
    });

    // 3. Copy Row Password
    container.querySelectorAll('.btn-copy-row-pw').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pw = btn.getAttribute('data-pw');
        copyToClipboard(pw, `تم نسخ كلمة المرور: ${pw} 🔑`);
      });
    });

    // 4. Copy Row Full Credentials
    container.querySelectorAll('.btn-copy-row-full').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const empId = btn.getAttribute('data-emp-id');
        const emp = (store.employees || []).find(x => x.id === empId);
        if (emp) {
          const origin = window.location.origin + window.location.pathname;
          const fullText =
            `مرحباً بك يا ${emp.name} 👋
تم تفعيل حسابك في منظومة مؤسسة النهضة ببني سويف:
------------------------------------------
• الدور الوظيفي: ${emp.roleLabel}
• البريد الإلكتروني: ${emp.email}
• كلمة المرور السرية: ${emp.password}
• المركز: ${emp.center || 'بني سويف'}
• رابط الدخول: ${origin}
------------------------------------------
يرجى الحفاظ على سرية بيانات حسابك.`;

          copyToClipboard(fullText, `تم نسخ بيانات دخول (${emp.name}) بالكامل 📋✨`);
        }
      });
    });

    // 5. Edit Employee
    container.querySelectorAll('.btn-edit-emp').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const empId = btn.getAttribute('data-emp-id');
        const emp = (store.employees || []).find(x => x.id === empId);
        if (emp) {
          if (editIdInput) editIdInput.value = emp.id;
          if (nameInput) nameInput.value = emp.name;
          if (roleSelect) roleSelect.value = emp.roleCode;
          if (emailInput) emailInput.value = emp.email;
          if (passwordInput) passwordInput.value = emp.password;
          if (centerSelect && emp.center) centerSelect.value = emp.center;
          if (phoneInput) phoneInput.value = emp.phone || '';
          if (submitText) submitText.textContent = 'حفظ تعديلات الموظف ✨';
          if (formTitle) formTitle.textContent = `تعديل بيانات الموظف (${emp.name})`;
          if (cancelBtn) cancelBtn.style.display = 'inline-flex';
          form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          showToast(`جاري تعديل بيانات الموظف: ${emp.name} ✏️`);
        }
      });
    });

    // 6. Delete Employee
    container.querySelectorAll('.btn-delete-emp').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const empId = btn.getAttribute('data-emp-id');
        const emp = (store.employees || []).find(x => x.id === empId);
        if (emp) {
          const confirmed = window.confirm(`هل أنت متأكد من حذف حساب الموظف (${emp.name})؟ لن يتمكن من تسجيل الدخول للنظام بعدها.`);
          if (confirmed) {
            store.removeEmployee(empId);
            showToast(`تم حذف حساب الموظف (${emp.name}) بنجاح 🗑️`);
            renderEmployeesTable();
            updateEmployeesStats();
          }
        }
      });
    });
  }

  // 12. Update Employees Stats Counters
  function updateEmployeesStats() {
    const list = store.employees || [];

    const totalEl = DOM.qs('#stat-total-employees');
    const managersEl = DOM.qs('#stat-managers');
    const reviewersEl = DOM.qs('#stat-reviewers');
    const socialWorkerEl = DOM.qs('#stat-social-workers');
    const dataEntryEl = DOM.qs('#stat-data-entry');

    if (totalEl) totalEl.textContent = list.length;
    if (managersEl) managersEl.textContent = list.filter(e => e.roleCode === 'manager').length;
    if (reviewersEl) reviewersEl.textContent = list.filter(e => e.roleCode === 'reviewer').length;
    if (socialWorkerEl) socialWorkerEl.textContent = list.filter(e => e.roleCode === 'social_worker').length;
    if (dataEntryEl) dataEntryEl.textContent = list.filter(e => e.roleCode === 'data_entry').length;
  }

  // 13. Export Employees to CSV
  function exportEmployeesToCSV() {
    const employees = store.employees || [];
    if (employees.length === 0) {
      showToast('لا توجد بيانات موظفين لتصديرها ⚠️');
      return;
    }

    const headers = ['#', 'الاسم', 'الدور الوظيفي', 'البريد الإلكتروني', 'كلمة المرور', 'المركز', 'رقم الهاتف', 'الحالة'];
    const rows = employees.map((emp, idx) => [
      `"${idx + 1}"`,
      `"${emp.name || ''}"`,
      `"${emp.roleLabel || ''}"`,
      `"${emp.email || ''}"`,
      `"${emp.password || ''}"`,
      `"${emp.center || 'بني سويف'}"`,
      `"${emp.phone || ''}"`,
      `"${emp.statusLabel || 'نشط'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_nahda_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('تم تصدير سجل الموظفين بنجاح 📥');
  }

  if (btnExport) {
    btnExport.addEventListener('click', exportEmployeesToCSV);
  }

  // 14. Sync on external store updates
  EventBus.on(EVENTS.EMPLOYEES_UPDATED, () => {
    renderEmployeesTable();
    updateEmployeesStats();
  });

  // Initial render
  renderEmployeesTable();
  updateEmployeesStats();
}
