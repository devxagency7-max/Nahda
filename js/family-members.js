/* --------------------------------------------------------------------------
   7. DYNAMIC FAMILY MEMBERS MANAGER (إضافة فرد تابع لرب الأسرة)
   -------------------------------------------------------------------------- */
function initFamilyMembersManager() {
  const btnOpenModal = document.getElementById('btn-open-add-member');
  const btnCloseModal = document.getElementById('btn-close-member-modal');
  const btnCancelModal = document.getElementById('btn-cancel-add-member');
  const btnSaveMember = document.getElementById('btn-save-member');
  const inlineForm = document.getElementById('add-member-inline-form');
  const formTitle = inlineForm ? inlineForm.querySelector('.modal-card__title') : null;
  const saveBtnLabel = btnSaveMember ? btnSaveMember.querySelector('span') : null;
  const membersList = document.getElementById('members-list');
  const countBadge = document.getElementById('members-count-badge');

  // ── Student/Education fields (declared here so all functions can access them) ──
  const isStudentCheckbox = document.getElementById('new-member-is-student');
  const studentStageGroup = document.getElementById('student-stage-group');
  const studentUniGroup   = document.getElementById('student-uni-group');
  const stageSelect       = document.getElementById('new-member-education-stage') || document.getElementById('new-member-stage');
  const gradeGroup        = document.getElementById('student-grade-group');
  const gradeSelect       = document.getElementById('new-member-grade');
  const universityGroup   = document.getElementById('student-uni-group');
  const universityInput   = document.getElementById('new-member-university');
  const studentFieldsWrapper = studentStageGroup; // alias used in resetForm

  let editingCard = null; // the .member-card currently being edited, or null when adding a new one

  function updateMembersCount() {
    if (!membersList || !countBadge) return;
    const total = membersList.querySelectorAll('.member-card').length;
    countBadge.textContent = `عدد الأفراد: ${total}`;
    const emptyState = document.getElementById('members-empty-state');
    if (emptyState) {
      emptyState.style.display = total === 0 ? 'block' : 'none';
    }
    if (typeof window.updateWorkflowPercentages === 'function') {
      window.updateWorkflowPercentages();
    }
  }

  // Grade options mapping per educational stage
  const gradeOptionsMap = {
    'حضانة': ['KG1', 'KG2'],
    'ابتدائي': ['الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي', 'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي'],
    'إعدادي': ['الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي'],
    'إعدادية': ['الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي'],
    'ثانوي': ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'],
    'ثانوية': ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي']
  };

  function handleStageChange(selectedStage, savedGrade = '', savedUni = '') {
    const uniLabel = document.getElementById('student-uni-label');
    
    if (gradeOptionsMap[selectedStage]) {
      if (gradeGroup) gradeGroup.style.display = 'block';
      if (universityGroup) universityGroup.style.display = 'none';
      if (universityInput) universityInput.value = '';
      
      if (gradeSelect) {
        gradeSelect.innerHTML = '<option value="" selected disabled>اختر الصف / المستوى...</option>';
        gradeOptionsMap[selectedStage].forEach(g => {
          const opt = document.createElement('option');
          opt.value = g;
          opt.textContent = g;
          if (savedGrade && g === savedGrade) opt.selected = true;
          gradeSelect.appendChild(opt);
        });
      }
    } else if (selectedStage === 'جامعي / كلية' || selectedStage === 'كلية / جامعة') {
      if (gradeGroup) gradeGroup.style.display = 'none';
      if (gradeSelect) gradeSelect.value = '';
      if (universityGroup) universityGroup.style.display = 'block';
      if (uniLabel) uniLabel.textContent = 'اسم الكلية / التخصص والجامعة';
      if (universityInput) {
        universityInput.placeholder = 'أدخل اسم الكلية والتخصص (مثال: كلية التجارة - جامعة بني سويف)...';
        if (savedUni) universityInput.value = savedUni;
      }
    } else if (selectedStage === 'ماجستير / دراسات عليا') {
      if (gradeGroup) gradeGroup.style.display = 'none';
      if (gradeSelect) gradeSelect.value = '';
      if (universityGroup) universityGroup.style.display = 'block';
      if (uniLabel) uniLabel.textContent = 'التخصص / مجال الدراسات العليا والجامعة';
      if (universityInput) {
        universityInput.placeholder = 'أدخل اسم التخصص أو الماجستير والجامعة...';
        if (savedUni) universityInput.value = savedUni;
      }
    } else if (selectedStage === 'أخرى') {
      if (gradeGroup) gradeGroup.style.display = 'none';
      if (gradeSelect) gradeSelect.value = '';
      if (universityGroup) universityGroup.style.display = 'block';
      if (uniLabel) uniLabel.textContent = 'تفاصيل المرحلة التعليمية / التخصص';
      if (universityInput) {
        universityInput.placeholder = 'أدخل تفاصيل المرحلة التعليمية...';
        if (savedUni) universityInput.value = savedUni;
      }
    } else {
      if (gradeGroup) gradeGroup.style.display = 'block';
      if (gradeSelect) gradeSelect.innerHTML = '<option value="" selected disabled>-- اختر المرحلة التعليمية أولاً لتحديد الصف --</option>';
      if (universityGroup) universityGroup.style.display = 'none';
    }
  }

  function resetForm() {
    const nameInput = document.getElementById('new-member-name');
    const relationInput = document.getElementById('new-member-relation');
    const idInput = document.getElementById('new-member-id');
    const ageInput = document.getElementById('new-member-age');
    const jobInput = document.getElementById('new-member-job');
    const incomeInput = document.getElementById('new-member-income');
    const notesInput = document.getElementById('new-member-notes');

    if (nameInput) nameInput.value = '';
    if (relationInput) relationInput.value = '';
    if (idInput) idInput.value = '';
    if (ageInput) ageInput.value = '';
    if (jobInput) jobInput.value = '';
    if (incomeInput) incomeInput.value = '';
    if (notesInput) notesInput.value = '';
    if (isStudentCheckbox) isStudentCheckbox.checked = false;
    if (studentFieldsWrapper) studentFieldsWrapper.style.display = 'none';
    if (stageSelect) stageSelect.value = '';
    if (gradeGroup) gradeGroup.style.display = 'none';
    if (gradeSelect) gradeSelect.innerHTML = '<option value="" selected disabled>-- اختر المرحلة التعليمية أولاً لتحديد الصف --</option>';
    if (universityGroup) universityGroup.style.display = 'none';
    if (universityInput) universityInput.value = '';
  }

  function fillFormFromCard(card) {
    const d = card.dataset;
    const nameInput = document.getElementById('new-member-name');
    const relationInput = document.getElementById('new-member-relation');
    const idInput = document.getElementById('new-member-id');
    const ageInput = document.getElementById('new-member-age');
    const jobInput = document.getElementById('new-member-job');
    const incomeInput = document.getElementById('new-member-income');
    const notesInput = document.getElementById('new-member-notes');

    if (nameInput) nameInput.value = d.name || '';
    if (relationInput) relationInput.value = d.relation || '';
    if (idInput) idInput.value = d.idNum || '';
    if (ageInput) ageInput.value = d.age || '';
    if (jobInput) jobInput.value = d.job === 'غير محدد' ? '' : (d.job || '');
    if (incomeInput) incomeInput.value = d.income || '';
    if (notesInput) notesInput.value = d.notes || '';

    const isStudent = d.isStudent === 'true';
    if (isStudentCheckbox) isStudentCheckbox.checked = isStudent;
    if (studentFieldsWrapper) studentFieldsWrapper.style.display = isStudent ? 'block' : 'none';
    if (gradeGroup) gradeGroup.style.display = isStudent ? 'block' : 'none';

    if (isStudent) {
      const stage = d.stage || '';
      if (stageSelect) stageSelect.value = stage;
      handleStageChange(stage, d.grade || '', d.university || '');
    }
  }

  function openModal(card) {
    editingCard = card || null;

    if (formTitle) {
      formTitle.textContent = editingCard ? 'تعديل بيانات الفرد التابع' : 'إضافة فرد تابع جديد لرب الأسرة';
    }
    if (saveBtnLabel) {
      saveBtnLabel.textContent = editingCard ? 'حفظ التعديلات' : 'تأكيد إضافة الفرد التابع';
    }

    resetForm();
    if (editingCard) {
      fillFormFromCard(editingCard);
    }

    if (inlineForm) {
      inlineForm.style.display = 'block';
      inlineForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = document.getElementById('new-member-name');
      if (firstInput) firstInput.focus();
    }
  }

  function closeModal() {
    if (inlineForm) {
      inlineForm.style.display = 'none';
    }
    editingCard = null;
  }

  // Open Form Listener (add new member)
  if (btnOpenModal) {
    btnOpenModal.addEventListener('click', () => openModal(null));
  }

  // Open Form in edit mode when clicking an existing member card (but not the delete button)
  if (membersList) {
    membersList.addEventListener('click', (e) => {
      if (e.target.closest('.btn-delete-member')) return;
      const card = e.target.closest('.member-card');
      if (card) openModal(card);
    });
  }

  // Close Form Listeners
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  // -------------------------------------------------------------------------
  // Dynamic Student & Education Cascade Logic (Checkbox Toggle)
  // -------------------------------------------------------------------------
  if (isStudentCheckbox) {
    isStudentCheckbox.addEventListener('change', () => {
      const isChecked = isStudentCheckbox.checked;
      if (studentStageGroup) studentStageGroup.style.display = isChecked ? 'block' : 'none';
      if (gradeGroup) gradeGroup.style.display = isChecked ? 'block' : 'none';

      if (isChecked) {
        handleStageChange(stageSelect ? stageSelect.value : '');
      } else {
        if (stageSelect) stageSelect.value = '';
        if (gradeGroup) gradeGroup.style.display = 'none';
        if (universityGroup) universityGroup.style.display = 'none';
        if (universityInput) universityInput.value = '';
      }
    });
  }

  if (stageSelect) {
    stageSelect.addEventListener('change', () => {
      handleStageChange(stageSelect.value);
    });
  }


  function computeEduDisplay(isStudent, stage, grade, university) {
    const studentFlag = isStudent === true || isStudent === 'true';
    if (studentFlag) {
      if (stage === 'جامعي / كلية' || stage === 'كلية / جامعة') {
        return university ? `🎓 طالب جامعي (${university})` : '🎓 طالب جامعي / كلية';
      } else if (stage === 'ماجستير / دراسات عليا') {
        return university ? `🎓 ماجستير / دراسات عليا (${university})` : '🎓 ماجستير / دراسات عليا';
      } else if (stage) {
        return grade ? `🎓 طالب بمرحلة ${stage} (${grade})` : `🎓 طالب بمرحلة ${stage}`;
      } else {
        return '🎓 طالب ملتحق بالتعليم';
      }
    }
    return 'غير طالب';
  }

  function applyMemberDataToCard(card, data) {
    const { name, relation, idNum, age, job, income, notes, isStudent, stage, grade, university, eduDisplay } = data;
    const finalEduDisplay = eduDisplay || computeEduDisplay(isStudent, stage, grade, university);

    card.dataset.name = name;
    card.dataset.relation = relation;
    card.dataset.idNum = idNum || '';
    card.dataset.age = age || '';
    card.dataset.job = job || 'غير محدد';
    card.dataset.income = income || '';
    card.dataset.notes = notes || '';
    card.dataset.isStudent = String(isStudent);
    card.dataset.stage = stage || '';
    card.dataset.grade = grade || '';
    card.dataset.university = university || '';
    card.dataset.eduDisplay = finalEduDisplay;

    const nameParts = name.split(' ');
    const initials = nameParts.length >= 2
      ? nameParts[0].charAt(0) + nameParts[1].charAt(0)
      : name.charAt(0);

    card.innerHTML = `
      <div class="member-card__info" style="display: flex; align-items: flex-start; gap: 14px; width: 100%;">
        <div class="member-card__avatar" style="background: rgba(37, 99, 235, 0.15); color: #2563eb; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; flex-shrink: 0;">${initials}</div>
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <h4 class="member-card__name" style="font-size: 15px; font-weight: 800; color: #000; margin: 0;">${name}</h4>
            <span class="badge badge--primary" style="font-size: 11px;">${relation}</span>
            ${age ? `<span class="badge badge--secondary" style="font-size: 11px;">السن: ${age} سنة</span>` : ''}
          </div>
          
          <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 4px; font-size: 12.5px; color: var(--text-secondary);">
            ${idNum ? `<div>🪪 <strong>الرقم القومي:</strong> <span style="font-family: monospace; font-weight: 700;">${idNum}</span></div>` : ''}
            <div>🏫 <strong>التعليم:</strong> ${finalEduDisplay}</div>
            <div>💼 <strong>الوظيفة / العمل:</strong> ${job || 'غير محدد'} ${income ? ` • 💵 <strong>الدخل:</strong> <span style="color: #059669; font-weight: 800;">${income} جنيه/شهرياً</span>` : ''}</div>
            ${notes ? `<div style="color: #2563eb; font-weight: 700; margin-top: 2px;">📝 <strong>ملاحظات:</strong> ${notes}</div>` : ''}
          </div>
        </div>
      </div>
      <button class="btn btn--ghost btn--sm btn-delete-member" title="حذف الفرد" type="button" style="padding: 6px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    `;
  }

  // Add / Edit Member Action
  if (btnSaveMember && membersList) {
    btnSaveMember.addEventListener('click', () => {
      const nameInput = document.getElementById('new-member-name');
      const relationInput = document.getElementById('new-member-relation');
      const idInput = document.getElementById('new-member-id');
      const ageInput = document.getElementById('new-member-age');
      const jobInput = document.getElementById('new-member-job');
      const incomeInput = document.getElementById('new-member-income');
      const notesInput = document.getElementById('new-member-notes');

      const name = nameInput ? nameInput.value.trim() : '';
      const relation = relationInput ? relationInput.value : 'فرد أسرة';
      const idNum = idInput ? idInput.value.trim() : '';
      const age = ageInput ? ageInput.value.trim() : '';
      const job = jobInput ? jobInput.value.trim() : 'غير محدد';
      const income = incomeInput ? incomeInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : '';

      const isStudent = isStudentCheckbox ? isStudentCheckbox.checked : false;
      const stage = isStudent && stageSelect ? stageSelect.value : '';
      const grade = isStudent && gradeSelect ? gradeSelect.value : '';
      const university = isStudent && universityInput ? universityInput.value.trim() : '';
      let eduDisplay = computeEduDisplay(isStudent, stage, grade, university);

      if (!name) {
        showToast('يرجى إدخال اسم الفرد الرباعي');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!relation) {
        showToast('يرجى اختيار صلة القرابة برب الأسرة');
        if (relationInput) relationInput.focus();
        return;
      }

      if (idNum && idNum.length !== 14) {
        showToast('الرقم القومي يتكون من 14 رقم بالكامل');
        if (idInput) idInput.focus();
        return;
      }

      const memberData = { name, relation, idNum, age, job, income, notes, isStudent, stage, grade, university, eduDisplay };

      if (editingCard) {
        applyMemberDataToCard(editingCard, memberData);
        bindDeleteButton(editingCard);
        closeModal();
        saveMembersToStorage();
        showToast(`تم تحديث بيانات الفرد "${name}" بنجاح ✏️`);
      } else {
        const memberCardHtml = document.createElement('div');
        memberCardHtml.className = 'member-card';
        memberCardHtml.style.animation = 'fadeInView 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        applyMemberDataToCard(memberCardHtml, memberData);
        bindDeleteButton(memberCardHtml);
        membersList.appendChild(memberCardHtml);
        closeModal();
        saveMembersToStorage();
        showToast(`تمت إضافة الفرد التابع "${name}" بنجاح 👤`);
      }

      updateMembersCount();
    });
  }

  function saveMembersToStorage() {
    if (!membersList) return;
    const cards = membersList.querySelectorAll('.member-card');
    const membersData = [];
    cards.forEach(card => {
      membersData.push(Object.assign({}, card.dataset));
    });
    try {
      localStorage.setItem('nahda_family_members', JSON.stringify(membersData));
    } catch (e) {}
  }

  function loadMembersFromStorage() {
    if (!membersList) return;
    try {
      const saved = localStorage.getItem('nahda_family_members');
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list) && list.length > 0) {
          // Clear current cards except empty state
          membersList.querySelectorAll('.member-card').forEach(c => c.remove());
          list.forEach(m => {
            const card = document.createElement('div');
            card.className = 'member-card';
            applyMemberDataToCard(card, m);
            bindDeleteButton(card);
            membersList.appendChild(card);
          });
        }
      }
    } catch (e) {}
  }

  // Attach Delete Listener to a member card
  function bindDeleteButton(card) {
    const delBtn = card.querySelector('.btn-delete-member');
    if (!delBtn) return;
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = card.dataset.name || card.querySelector('.member-card__name')?.textContent || 'الفرد';
      card.remove();
      saveMembersToStorage();
      updateMembersCount();
      showToast(`تم حذف الفرد "${name}" من قائمة التابعين`);
    });
  }

  // Load saved members on init
  loadMembersFromStorage();
  updateMembersCount();
}

/* --------------------------------------------------------------------------
   8. DYNAMIC LOCATION & BENI SUEF VILLAGES CASCADE
   -------------------------------------------------------------------------- */
const BENI_SUEF_DATA = {
  "بني سويف": [
    "إبشنا", "الحكامنة", "الحلابية", "الدوالطة", "الدوية", "الكوم الأحمر", 
    "أهناسيا الخضراء", "إهوه", "باروط", "باها العجوز", "بلفيا", "بني بخيت", 
    "بني حمد", "بني رضوان", "بني سليمان الشرقية", "بني عفان", "بني هارون", 
    "بياض العرب", "تزمنت الشرقية", "تزمنت الغربية", "حاجر بني سليمان", "دموشيا", 
    "رياض", "سنور", "شريف", "منشأة حيدر يكن", "منشأة عاصم", "منقريش", 
    "نزلة أبو سليم", "نزلة السعادنة", "نزلة معارك", "نعيم", "الزرابي", "تل أبو ناروز"
  ],
  "الواسطى": [
    "أبو صير الملق", "أبويط", "أطواب", "أنفسط", "إفوة", "الحومة", "الديابية", 
    "المصلوب", "الميمون", "النواميس", "الهرم", "بني حدير", "بني سليمان", 
    "بني غنيم", "بني محمد", "بني نصير", "جزيرة المساعدة", "جزيرة النور", 
    "زاوية المصلوب", "صفط الشرقية", "صفط الغربية", "عطف إفوة", "قمن العروس", 
    "كفر أبجيج", "كفر بني عثمان", "كوم أبو راضي", "كوم أدريجة", "معصرة أبو صير", 
    "منشأة أبو صير", "میدوم", "نزلة الجنيدي", "ونا القس"
  ],
  "ناصر": [
    "أشمنت", "البرج", "الحرجة", "الحمام", "الرياض", "الزيتون", "المنصورة", 
    "بني خليفة", "بني عدي", "بهبشين", "جزيرة أبو صالح", "دلاص", "دنديل", 
    "طحا بوش", "طنسا الملق", "غيط البحري", "كفر الجزيرة", "كوم أبو خلاد", 
    "منشأة الشركة", "منشأة هديب"
  ],
  "إهناسيا": [
    "أدراسية", "البهسمون", "الشوبك", "العواونة", "المسيد الأبيض", "النويرة", 
    "براوة الوقف", "بني هاني", "بهنموه", "دير براوة", "سدمنت الجبل", "شرهي", 
    "طما فيوم", "قاي", "قلة", "قلها", "كفر أبو شهبة", "كوم الرمل البحري", 
    "معصرة نعسان", "منشأة الأمراء", "منشأة البديني", "منشأة الحاج", "منشأة طاهر", 
    "منشأة عبد الصمد", "منشأة كساب", "منهرة", "منهرو", "منيل غيضان", "منيل هاني", 
    "ميانة", "نزلة المشارقة", "نزلة المماليك", "نزلة خلف", "نزلة شاويش", "ننا"
  ],
  "ببا": [
    "أبو شربان", "أم الجنازير", "البرانقة", "البكرية", "الجزيرة الشرقية", 
    "السلطاني", "الشهيد حسن علام", "الضباعنة", "الفقاعي", "الملاحية", 
    "الملاحية البحرية", "بني أحمد", "بني خليل", "بني عقبة", "بني عوض", 
    "بني قاسم", "بني مؤمنة", "بني ماضي", "بني محمد الشرقية", "بني هاشم", 
    "جبل النور", "جزيرة الفقاعي", "جزيرة ببا", "رزقة المشارقة", "زاوية الناوية", 
    "سدس الأمراء", "صفط راشين", "طحا لبيشة", "طرشوب", "طنسا بني مالو", "طوة", 
    "غياضة الشرقية", "غياضة الغربية", "فزارة", "قنبش الحمراء", "كفر جمعة", 
    "كفر منصور", "كفر ناصر", "منشأة أبو دخان", "منية الجيد", "منيل موسى", 
    "نزلة الزاوية", "نزلة الشريف", "نزلة علي كيلاني", "هربشنت", "هلية"
  ],
  "سمسطا": [
    "الشنطور", "العساكرة", "القصبة", "المحمودية", "بدهل", "بني حلة", 
    "بني محمد راشد", "دشاشة", "دشطوط", "سربو", "عزبة الشنطور", "عزبة قفطان", 
    "كفر الشيخ عابد", "كفر بني علي", "كوم الرمل القبلي", "كوم النور", "مزورة", 
    "منشأة أبو مليح", "منشأة سليمان", "نزلة الديب", "نزلة سعيد"
  ],
  "الفشن": [
    "أبسوج", "أقفهص", "البرقي", "الجفادون", "الجمهود", "الحيبة", 
    "الزاوية الخضراء", "الشقر", "الفنت", "الفنت الغربية", "القضابي", 
    "القليعة", "الكنيسة", "بسفا", "بني صالح", "بني منين", "تلت", 
    "جزيرة الوكلية", "دلهانس", "شنري", "صالح", "صفط الخرسة", "صفط العرفا", 
    "صفط النور", "طلا", "عزبة البنك", "عزبة تلت", "كفر درويش", "كفر منسابة", 
    "منشأة السادات", "منشأة عمرو", "نزلة أقفهص", "نزلة البرقي", "نزلة حنا حنا"
  ]
};

function initLocationCascade() {
  const districtEl = document.getElementById('district');
  const villageEl = document.getElementById('village');

  if (!districtEl || !villageEl) return;

  function updateVillagesList(selectedDistrict) {
    const isSelect = villageEl.tagName.toLowerCase() === 'select';
    const districtKey = selectedDistrict ? selectedDistrict.trim() : '';

    if (isSelect) {
      const currentVal = villageEl.value;
      villageEl.innerHTML = '<option value="" disabled selected>-- اختر القرية / المدينة --</option>';

      if (BENI_SUEF_DATA[districtKey]) {
        // Add City/Center itself option
        const centerCityOpt = document.createElement('option');
        centerCityOpt.value = `مدينة / مركز ${districtKey}`;
        centerCityOpt.textContent = `🏢 مدينة / مركز ${districtKey} (المدينة نفسها)`;
        centerCityOpt.style.fontWeight = 'bold';
        villageEl.appendChild(centerCityOpt);

        BENI_SUEF_DATA[districtKey].forEach(vName => {
          const opt = document.createElement('option');
          opt.value = vName;
          opt.textContent = `قرية ${vName}`;
          villageEl.appendChild(opt);
        });
      } else {
        // Add Governorate option
        const govOpt = document.createElement('option');
        govOpt.value = 'محافظة بني سويف';
        govOpt.textContent = '🏛️ محافظة بني سويف';
        govOpt.style.fontWeight = 'bold';
        villageEl.appendChild(govOpt);

        // Group cities and villages by center from CSV data
        Object.keys(BENI_SUEF_DATA).forEach(center => {
          const group = document.createElement('optgroup');
          group.label = `مركز ومدن ${center}`;
          
          const centerOpt = document.createElement('option');
          centerOpt.value = `مدينة / مركز ${center}`;
          centerOpt.textContent = `🏢 مدينة / مركز ${center} (المدينة نفسها)`;
          group.appendChild(centerOpt);

          BENI_SUEF_DATA[center].forEach(vName => {
            const opt = document.createElement('option');
            opt.value = vName;
            opt.textContent = `قرية ${vName} (مركز ${center})`;
            group.appendChild(opt);
          });
          villageEl.appendChild(group);
        });
      }

      if (currentVal && [...villageEl.options].some(o => o.value === currentVal)) {
        villageEl.value = currentVal;
      }
    } else {
      const villagesDatalist = document.getElementById('villages-list');
      if (!villagesDatalist) return;
      villagesDatalist.innerHTML = '';

      if (BENI_SUEF_DATA[districtKey]) {
        BENI_SUEF_DATA[districtKey].forEach(vName => {
          const opt = document.createElement('option');
          opt.value = vName;
          villagesDatalist.appendChild(opt);
        });
      } else {
        const allVillages = [];
        Object.values(BENI_SUEF_DATA).forEach(list => allVillages.push(...list));
        allVillages.sort().forEach(vName => {
          const opt = document.createElement('option');
          opt.value = vName;
          villagesDatalist.appendChild(opt);
        });
      }
    }
  }

  districtEl.addEventListener('change', () => {
    updateVillagesList(districtEl.value);
  });

  if (districtEl.tagName.toLowerCase() === 'input') {
    districtEl.addEventListener('input', () => {
      updateVillagesList(districtEl.value);
    });
  }

  // Sync village selection back to center if center was unselected
  villageEl.addEventListener('change', () => {
    if (!districtEl.value && villageEl.value) {
      const selVillage = villageEl.value;
      for (const [center, list] of Object.entries(BENI_SUEF_DATA)) {
        if (list.includes(selVillage)) {
          districtEl.value = center;
          updateVillagesList(center);
          villageEl.value = selVillage;
          break;
        }
      }
    }
  });

  // Initial population
  updateVillagesList(districtEl.value);
}
