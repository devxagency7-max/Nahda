/* --------------------------------------------------------------------------
   0.1 HOMEPAGE DASHBOARD INTERACTIVITY ENGINE
   -------------------------------------------------------------------------- */
function initDashboardInteractivity() {
  // Update Live Arabic Date
  const dateEl = document.getElementById('dash-current-date');
  if (dateEl) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateEl.textContent = today.toLocaleDateString('ar-EG', options);
  }

  // Multi-Criteria Search Elements
  const searchTabs = document.querySelectorAll('.dash-search-tab');
  const searchInput = document.getElementById('dash-search-input');
  const searchBoxText = document.getElementById('search-box-text');
  const searchBoxCharity = document.getElementById('search-box-charity');
  const searchBoxRegion = document.getElementById('search-box-region');
  const searchBoxDate = document.getElementById('search-box-date');
  
  const charitySelect = document.getElementById('dash-charity-select');
  const regionInput = document.getElementById('dash-region-input');
  const regionSuggestions = document.getElementById('dash-region-suggestions');
  
  const dashDateFrom = document.getElementById('dash-date-from');
  const dashDateTo = document.getElementById('dash-date-to');
  const datePresetBtns = document.querySelectorAll('.btn-date-preset');
  
  const btnSearch = document.getElementById('btn-dash-search');
  const resultsContainer = document.getElementById('dash-search-results');
  const resultsContent = document.getElementById('dash-results-content');

  let currentSearchMode = 'nid';

  // Initialize Region Autocomplete Options
  initRegionSearchAutocomplete();
  initDateRangePresets();

  function initRegionSearchAutocomplete() {
    if (!regionInput || !regionSuggestions) return;

    // Use global BENI_SUEF_DATA or fallback structure from CSV
    const beniSuefData = (typeof BENI_SUEF_DATA !== 'undefined') ? BENI_SUEF_DATA : {
      "بني سويف": ["إبشنا", "الحكامنة", "الحلابية", "الدوالطة", "الدوية", "الكوم الأحمر", "أهناسيا الخضراء", "إهوه", "باروط", "باها العجوز", "بلفيا", "بني بخيت", "بني حمد", "بني رضوان", "بني سليمان الشرقية", "بني عفان", "بني هارون", "بياض العرب", "تزمنت الشرقية", "تزمنت الغربية", "حاجر بني سليمان", "دموشيا", "رياض", "سنور", "شريف", "منشأة حيدر يكن", "منشأة عاصم", "منقريش", "نزلة أبو سليم", "نزلة السعادنة", "نزلة معارك", "نعيم", "الزرابي", "تل أبو ناروز"],
      "الواسطى": ["أبو صير الملق", "أبويط", "أطواب", "أنفسط", "إفوة", "الحومة", "الديابية", "المصلوب", "الميمون", "النواميس", "الهرم", "بني حدير", "بني سليمان", "بني غنيم", "بني محمد", "بني نصير", "جزيرة المساعدة", "جزيرة النور", "زاوية المصلوب", "صفط الشرقية", "صفط الغربية", "عطف إفوة", "قمن العروس", "كفر أبجيج", "كفر بني عثمان", "كوم أبو راضي", "كوم أدريجة", "معصرة أبو صير", "منشأة أبو صير", "میدوم", "نزلة الجنيدي", "ونا القس"],
      "ناصر": ["أشمنت", "البرج", "الحرجة", "الحمام", "الرياض", "الزيتون", "المنصورة", "بني خليفة", "بني عدي", "بهبشين", "جزيرة أبو صالح", "دلاص", "دنديل", "طحا بوش", "طنسا الملق", "غيط البحري", "كفر الجزيرة", "كوم أبو خلاد", "منشأة الشركة", "منشأة هديب"],
      "إهناسيا": ["أدراسية", "البهسمون", "الشوبك", "العواونة", "المسيد الأبيض", "النويرة", "براوة الوقف", "بني هاني", "بهنموه", "دير براوة", "سدمنت الجبل", "شرهي", "طما فيوم", "قاي", "قلة", "قلها", "كفر أبو شهبة", "كوم الرمل البحري", "معصرة نعسان", "منشأة الأمراء", "منشأة البديني", "منشأة الحاج", "منشأة طاهر", "منشأة عبد الصمد", "منشأة كساب", "منهرة", "منهرو", "منيل غيضان", "منيل هاني", "ميانة", "نزلة المشارقة", "نزلة المماليك", "نزلة خلف", "نزلة شاويش", "ننا"],
      "ببا": ["أبو شربان", "أم الجنازير", "البرانقة", "البكرية", "الجزيرة الشرقية", "السلطاني", "الشهيد حسن علام", "الضباعنة", "الفقاعي", "الملاحية", "الملاحية البحرية", "بني أحمد", "بني خليل", "بني عقبة", "بني عوض", "بني قاسم", "بني مؤمنة", "بني ماضي", "بني محمد الشرقية", "بني هاشم", "جبل النور", "جزيرة الفقاعي", "جزيرة ببا", "رزقة المشارقة", "زاوية الناوية", "سدس الأمراء", "صفط راشين", "طحا لبيشة", "طرشوب", "طنسا بني مالو", "طوة", "غياضة الشرقية", "غياضة الغربية", "فزارة", "قنبش الحمراء", "كفر جمعة", "كفر منصور", "كفر ناصر", "منشأة أبو دخان", "منية الجيد", "منيل موسى", "نزلة الزاوية", "نزلة الشريف", "نزلة علي كيلاني", "هربشنت", "هلية"],
      "سمسطا": ["الشنطور", "العساكرة", "القصبة", "المحمودية", "بدهل", "بني حلة", "بني محمد راشد", "دشاشة", "دشطوط", "سربو", "عزبة الشنطور", "عزبة قفطان", "كفر الشيخ عابد", "كفر بني علي", "كوم الرمل القبلي", "كوم النور", "مزورة", "منشأة أبو مليح", "منشأة سليمان", "نزلة الديب", "نزلة سعيد"],
      "الفشن": ["أبسوج", "أقفهص", "البرقي", "الجفادون", "الجمهود", "الحيبة", "الزاوية الخضراء", "الشقر", "الفنت", "الفنت الغربية", "القضابي", "القليعة", "الكنيسة", "بسفا", "بني صالح", "بني منين", "تلت", "جزيرة الوكلية", "دلهانس", "شنري", "صالح", "صفط الخرسة", "صفط العرفا", "صفط النور", "طلا", "عزبة البنك", "عزبة تلت", "كفر درويش", "كفر منسابة", "منشأة السادات", "منشأة عمرو", "نزلة أقفهص", "نزلة البرقي", "نزلة حنا حنا"]
    };

    const allOptions = [];

    // 1. Governorate Option
    allOptions.push({
      text: 'محافظة بني سويف',
      type: 'gov',
      center: 'بني سويف',
      village: '',
      icon: '🏛️'
    });

    // 2. Centers and Villages Options
    Object.keys(beniSuefData).forEach(center => {
      allOptions.push({
        text: `مدينة / مركز ${center}`,
        type: 'center',
        center: center,
        village: '',
        icon: '🏢'
      });

      beniSuefData[center].forEach(village => {
        allOptions.push({
          text: `قرية ${village} (مركز ${center})`,
          type: 'village',
          center: center,
          village: village,
          icon: '📍'
        });
      });
    });

    // Handle typing autocomplete popup
    if (regionInput && regionSuggestions) {
      regionInput.addEventListener('input', () => {
        const val = regionInput.value.trim().toLowerCase();
        if (!val) {
          regionSuggestions.style.display = 'none';
          return;
        }

        const matches = allOptions.filter(opt => 
          opt.text.toLowerCase().includes(val) || 
          opt.village.toLowerCase().includes(val) || 
          opt.center.toLowerCase().includes(val)
        ).slice(0, 10);

        if (matches.length === 0) {
          regionSuggestions.style.display = 'none';
          return;
        }

        regionSuggestions.innerHTML = matches.map(opt => `
          <div class="search-autocomplete-item" data-value="${opt.text}">
            <span>${opt.icon} ${opt.text}</span>
            <span class="center-badge">${opt.type === 'gov' ? 'محافظة' : (opt.type === 'center' ? 'مركز' : 'قرية')}</span>
          </div>
        `).join('');

        regionSuggestions.style.display = 'block';

        regionSuggestions.querySelectorAll('.search-autocomplete-item').forEach(item => {
          item.addEventListener('click', () => {
            regionInput.value = item.getAttribute('data-value');
            regionSuggestions.style.display = 'none';
            executeSearch('region', regionInput.value);
          });
        });
      });

      document.addEventListener('click', (e) => {
        if (!regionInput.contains(e.target) && !regionSuggestions.contains(e.target)) {
          regionSuggestions.style.display = 'none';
        }
      });
    }
  }

  function initDateRangePresets() {
    if (!dashDateFrom || !dashDateTo || datePresetBtns.length === 0) return;

    function formatDate(d) {
      return d.toISOString().split('T')[0];
    }

    datePresetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        datePresetBtns.forEach(b => b.classList.remove('btn-date-preset--active'));
        btn.classList.add('btn-date-preset--active');

        const preset = btn.getAttribute('data-preset');
        const today = new Date();

        if (preset === 'today') {
          dashDateFrom.value = formatDate(today);
          dashDateTo.value = formatDate(today);
        } else if (preset === 'week') {
          const past = new Date(today);
          past.setDate(past.getDate() - 7);
          dashDateFrom.value = formatDate(past);
          dashDateTo.value = formatDate(today);
        } else if (preset === 'month') {
          const past = new Date(today);
          past.setDate(past.getDate() - 30);
          dashDateFrom.value = formatDate(past);
          dashDateTo.value = formatDate(today);
        } else if (preset === 'year') {
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          dashDateFrom.value = formatDate(startOfYear);
          dashDateTo.value = formatDate(today);
        }
      });
    });
  }

  // Switch Search Modes Tabs
  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchTabs.forEach(t => t.classList.remove('dash-search-tab--active'));
      tab.classList.add('dash-search-tab--active');

      currentSearchMode = tab.getAttribute('data-search-mode');

      // Hide all search input boxes
      if (searchBoxText) searchBoxText.classList.add('dash-search-input-box--hidden');
      if (searchBoxCharity) searchBoxCharity.classList.add('dash-search-input-box--hidden');
      if (searchBoxRegion) searchBoxRegion.classList.add('dash-search-input-box--hidden');
      if (searchBoxDate) searchBoxDate.classList.add('dash-search-input-box--hidden');

      if (currentSearchMode === 'charity') {
        if (searchBoxCharity) searchBoxCharity.classList.remove('dash-search-input-box--hidden');
      } else if (currentSearchMode === 'region') {
        if (searchBoxRegion) searchBoxRegion.classList.remove('dash-search-input-box--hidden');
        if (regionInput) regionInput.focus();
      } else if (currentSearchMode === 'date') {
        if (searchBoxDate) searchBoxDate.classList.remove('dash-search-input-box--hidden');
        if (dashDateFrom) dashDateFrom.focus();
      } else {
        if (searchBoxText) searchBoxText.classList.remove('dash-search-input-box--hidden');

        if (searchInput) {
          if (currentSearchMode === 'nid') {
            searchInput.placeholder = 'ادخل الرقم القومي المكون من 14 رقم للبحث السريع...';
            searchInput.maxLength = 14;
            searchInput.value = '';
          } else if (currentSearchMode === 'phone') {
            searchInput.placeholder = 'ادخل رقم التليفون المحمول (مثال: 010...)...';
            searchInput.maxLength = 11;
            searchInput.value = '';
          }
        }
      }

      if (resultsContainer) resultsContainer.classList.add('dash-search-results--hidden');
    });
  });

  // Handle Charity Dropdown Change Event
  if (charitySelect) {
    charitySelect.addEventListener('change', () => {
      const selectedVal = charitySelect.value;
      const selectedText = charitySelect.options[charitySelect.selectedIndex]?.text;
      if (selectedVal && selectedText) {
        executeSearch('charity', selectedText);
      }
    });
  }

  // Handle Manual Search Button Click
  if (btnSearch) {
    btnSearch.addEventListener('click', () => {
      if (currentSearchMode === 'charity') {
        const selectedText = charitySelect ? charitySelect.options[charitySelect.selectedIndex]?.text : '';
        if (!charitySelect || !charitySelect.value) {
          showToast('الرجاء اختيار جمعية من القائمة المنسدلة 🏢');
          return;
        }
        executeSearch('charity', selectedText);
      } else if (currentSearchMode === 'region') {
        const query = regionInput ? regionInput.value.trim() : '';
        if (!query) {
          showToast('الرجاء اختيار أو كتابة اسم المنطقة/القرية/المحافظة للبحث 📍');
          return;
        }
        executeSearch('region', query);
      } else if (currentSearchMode === 'date') {
        const dateFrom = dashDateFrom ? dashDateFrom.value : '';
        const dateTo = dashDateTo ? dashDateTo.value : '';
        if (!dateFrom && !dateTo) {
          showToast('الرجاء تحديد تاريخ البداية أو تاريخ النهاية لخصائص النطاق الزمني 📅');
          return;
        }
        let rangeStr = '';
        if (dateFrom && dateTo) rangeStr = `الفترة من ${dateFrom} إلى ${dateTo}`;
        else if (dateFrom) rangeStr = `من تاريخ ${dateFrom}`;
        else rangeStr = `حتى تاريخ ${dateTo}`;
        executeSearch('date', rangeStr);
      } else {
        const query = searchInput ? searchInput.value.trim() : '';
        if (!query) {
          showToast('الرجاء إدخال رقم قومي أو تليفون للبحث 🔍');
          return;
        }
        executeSearch(currentSearchMode, query);
      }
    });
  }

  function executeSearch(mode, query) {
    if (!resultsContainer || !resultsContent) return;

    let searchLabel = 'الرقم القومي';
    if (mode === 'phone') searchLabel = 'رقم التليفون';
    else if (mode === 'charity') searchLabel = 'الجمعية';
    else if (mode === 'region') searchLabel = 'المنطقة والقرية';
    else if (mode === 'date') searchLabel = 'تاريخ البحث';
    
    resultsContent.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
        <div>
          <span style="font-size: var(--font-size-xs); color: var(--text-secondary);">نتائج الاستعلام عن (${searchLabel}): <strong>${query}</strong></span>
          <h4 style="font-size: var(--font-size-md); font-weight: 800; color: #000000; margin: 4px 0 0;">تم العثور على السجلات والبيانات التابعة للبحث</h4>
        </div>
        <button type="button" class="btn btn--primary btn--sm" data-view-target="personal-data">عرض الملفات »</button>
      </div>
    `;

    resultsContainer.classList.remove('dash-search-results--hidden');
    showToast(`تم تنفيذ البحث بـ (${searchLabel}) بنجاح ⚡`);

    // Re-bind dynamic navigation buttons inside search result box
    resultsContainer.querySelectorAll('[data-view-target="personal-data"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const activeSublink = document.querySelector('.sidebar-sublink[data-view-target="personal-data"]');
        if (activeSublink) activeSublink.click();
      });
    });
  }

  // Expandable / Collapsible Recent Cases Card Toggle
  const btnToggleRecent = document.getElementById('btn-toggle-recent');
  const recentCard = document.getElementById('dash-recent-card');

  if (btnToggleRecent && recentCard) {
    btnToggleRecent.addEventListener('click', () => {
      const isCollapsed = recentCard.classList.contains('dash-recent-section--collapsed');
      
      if (isCollapsed) {
        recentCard.classList.remove('dash-recent-section--expanded');
        recentCard.classList.add('dash-recent-section--expanded');
        btnToggleRecent.setAttribute('aria-expanded', 'true');
        showToast('تم توسيع أحدث الحالات لعرض كامل البيانات 📂');
      } else {
        recentCard.classList.remove('dash-recent-section--expanded');
        recentCard.classList.add('dash-recent-section--collapsed');
        btnToggleRecent.setAttribute('aria-expanded', 'false');
        showToast('تم طي كارت أحدث الحالات (الوضع المصغر) 📁');
      }
    });
  }
}

