/* --------------------------------------------------------------------------
   9. GENERIC "أخرى" DROPDOWN HANDLER
   Any <select> with a matching .other-input-field[data-for="<select-id>"]
   shows that text field when "أخرى" is selected. Whatever the user types
   is written back into the "أخرى" option's text/value live, so any code
   elsewhere that reads select.value or the selected option's text picks
   up the typed value automatically — no other file needs to know about it.
   -------------------------------------------------------------------------- */
function initOtherOptionDropdowns() {
  const otherInputs = document.querySelectorAll('.other-input-field[data-for]');

  otherInputs.forEach(otherInput => {
    const selectId = otherInput.getAttribute('data-for');
    const select = document.getElementById(selectId);
    if (!select) return;

    function getOtherOption() {
      return Array.from(select.options).find(opt => opt.dataset.isOther === 'true');
    }

    function syncVisibility() {
      const isOther = !!select.selectedOptions[0] && select.selectedOptions[0].dataset.isOther === 'true';
      otherInput.style.display = isOther ? 'block' : 'none';
      if (isOther) {
        otherInput.focus();
      }
    }

    select.addEventListener('change', () => {
      if (select.value === 'أخرى') {
        const otherOption = select.selectedOptions[0];
        otherOption.dataset.isOther = 'true';
        otherInput.value = '';
      }
      syncVisibility();
    });

    // Every keystroke updates the option's own value/text, so any code
    // elsewhere that reads select.value picks up exactly what was typed.
    otherInput.addEventListener('input', () => {
      const otherOption = getOtherOption();
      if (!otherOption) return;
      const typedValue = otherInput.value.trim();
      otherOption.value = typedValue || 'أخرى';
      otherOption.textContent = typedValue || 'أخرى';
    });

    // Re-check visibility whenever the select's options are rebuilt dynamically
    // (e.g. the grade dropdown, which is repopulated by initFamilyMembersManager)
    const observer = new MutationObserver(syncVisibility);
    observer.observe(select, { childList: true });

    // Initial state (covers pre-filled/edit scenarios)
    syncVisibility();
  });
}
