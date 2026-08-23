/* --------------------------------------------------------------------------
   EDIT PROFILE COMPONENT CONTROLLER
   Manages user profile data editing (Avatar file upload/URL, Name, Email,
   Gender, Phone) and real-time app-wide synchronization.
   -------------------------------------------------------------------------- */
import { store } from '../../state/store.js';
import { DOM } from '../../utils/dom.js';
import { showToast } from '../../utils/toast.js';
import { EventBus, EVENTS } from '../../core/event-bus.js';

export function initProfileComponent() {
  const form = DOM.qs('#profile-form');
  const avatarPreview = DOM.qs('#profile-avatar-preview');
  const avatarFileInput = DOM.qs('#profile-avatar-file-input');
  const avatarUrlInput = DOM.qs('#profile-avatar-url-input');
  const nameInput = DOM.qs('#profile-name-input');
  const emailInput = DOM.qs('#profile-email-input');
  const genderSelect = DOM.qs('#profile-gender-select');
  const phoneInput = DOM.qs('#profile-phone-input');
  const roleInput = DOM.qs('#profile-role-input');

  if (!form) return;

  // 1. Populate Form with Current User State
  function populateForm() {
    const user = store.currentUser || {};
    const avatarUrl = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';

    if (avatarPreview) avatarPreview.src = avatarUrl;
    if (avatarUrlInput) avatarUrlInput.value = avatarUrl.startsWith('data:') ? '' : avatarUrl;
    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (genderSelect) genderSelect.value = user.gender || 'ذكر';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (roleInput) roleInput.value = user.roleLabel || 'مدير النظام';
  }

  populateForm();

  // 2. Avatar File Upload Handler (FileReader DataURL)
  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('يرجى اختيار ملف صورة صالحة ⚠️');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً (الأقصى 5 ميجابايت) ⚠️');
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        if (avatarPreview) avatarPreview.src = dataUrl;
        if (avatarUrlInput) avatarUrlInput.value = '';
        showToast('تم اختيار الصورة بنجاح 📷');
      };
      reader.readAsDataURL(file);
    });
  }

  // 3. Avatar URL Typing Handler
  if (avatarUrlInput) {
    avatarUrlInput.addEventListener('input', () => {
      const url = avatarUrlInput.value.trim();
      if (url && avatarPreview) {
        avatarPreview.src = url;
      }
    });
  }

  // 4. Form Submit Handler (Save Profile Changes)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const gender = genderSelect ? genderSelect.value : 'ذكر';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const avatar = avatarPreview ? avatarPreview.src : '';

    if (!name) {
      showToast('الرجاء إدخال الاسم الكامل ⚠️');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!email) {
      showToast('الرجاء إدخال البريد الإلكتروني ⚠️');
      if (emailInput) emailInput.focus();
      return;
    }

    if (!phone) {
      showToast('الرجاء إدخال رقم الهاتف ⚠️');
      if (phoneInput) phoneInput.focus();
      return;
    }

    // Save Updated Profile State
    store.setCurrentUser({
      name,
      email,
      gender,
      phone,
      avatar
    });

    showToast('تم تحديث بيانات الملف الشخصي بنجاح ✨');
  });

  // 5. Re-sync on store changes
  EventBus.on(EVENTS.USER_CHANGED, () => {
    populateForm();
  });
}
