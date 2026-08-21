import { showToast } from '../core/toast.js';

/* --------------------------------------------------------------------------
   IN-PAGE BACKGROUND CUSTOMIZER STUDIO (#bg-customizer-card) WITH LOCALSTORAGE
   -------------------------------------------------------------------------- */
export function initInPageBackgroundStudio() {
  const bgLayer = document.getElementById('bg-layer');
  const fileInput = document.getElementById('inpage-bg-file');

  const sliderBlur = document.getElementById('inpage-slider-blur');
  const sliderBrightness = document.getElementById('inpage-slider-brightness');
  const sliderContrast = document.getElementById('inpage-slider-contrast');
  const sliderSaturate = document.getElementById('inpage-slider-saturate');
  const sliderOverlay = document.getElementById('inpage-slider-overlay');

  const valBlur = document.getElementById('inpage-val-blur');
  const valBrightness = document.getElementById('inpage-val-brightness');
  const valContrast = document.getElementById('inpage-val-contrast');
  const valSaturate = document.getElementById('inpage-val-saturate');
  const valOverlay = document.getElementById('inpage-val-overlay');

  const resetBtn = document.getElementById('inpage-reset-bg-settings');

  const colorSwatches = document.querySelectorAll('.color-swatch:not(.color-swatch--custom)');
  const customColorInput = document.getElementById('inpage-bg-custom-color');
  const customColorPreview = document.getElementById('custom-color-preview');

  // State object with default values
  let currentSettings = {
    type: 'image',
    val: 'assets/background.jpg',
    blur: 20,
    brightness: 89,
    contrast: 98,
    saturate: 140,
    overlay: 22
  };

  function saveSettings() {
    try {
      localStorage.setItem('nahda_bg_settings', JSON.stringify(currentSettings));
    } catch (e) {}
  }

  function applySettings() {
    if (!bgLayer) return;

    // Apply Background Type & Value
    if (currentSettings.type === 'image') {
      bgLayer.style.background = '';
      bgLayer.style.backgroundImage = `url(${currentSettings.val})`;
      bgLayer.style.backgroundColor = 'transparent';
    } else if (currentSettings.type === 'color') {
      bgLayer.style.backgroundImage = 'none';
      bgLayer.style.backgroundColor = currentSettings.val;
    } else if (currentSettings.type === 'gradient') {
      bgLayer.style.backgroundColor = 'transparent';
      bgLayer.style.backgroundImage = currentSettings.val;
    }

    // Apply CSS Filters & Overlay
    bgLayer.style.filter = `blur(${currentSettings.blur}px) brightness(${currentSettings.brightness}%) contrast(${currentSettings.contrast}%) saturate(${currentSettings.saturate}%)`;
    document.documentElement.style.setProperty('--bg-overlay', `rgba(248, 250, 252, ${currentSettings.overlay / 100})`);

    // Update Slider Inputs & Display Labels
    if (sliderBlur) sliderBlur.value = currentSettings.blur;
    if (sliderBrightness) sliderBrightness.value = currentSettings.brightness;
    if (sliderContrast) sliderContrast.value = currentSettings.contrast;
    if (sliderSaturate) sliderSaturate.value = currentSettings.saturate;
    if (sliderOverlay) sliderOverlay.value = currentSettings.overlay;

    if (valBlur) valBlur.textContent = `${currentSettings.blur}px`;
    if (valBrightness) valBrightness.textContent = `${currentSettings.brightness}%`;
    if (valContrast) valContrast.textContent = `${currentSettings.contrast}%`;
    if (valSaturate) valSaturate.textContent = `${currentSettings.saturate}%`;
    if (valOverlay) valOverlay.textContent = `${currentSettings.overlay}%`;
  }

  function updateFiltersFromSliders() {
    currentSettings.blur = sliderBlur ? parseInt(sliderBlur.value, 10) : 20;
    currentSettings.brightness = sliderBrightness ? parseInt(sliderBrightness.value, 10) : 89;
    currentSettings.contrast = sliderContrast ? parseInt(sliderContrast.value, 10) : 98;
    currentSettings.saturate = sliderSaturate ? parseInt(sliderSaturate.value, 10) : 140;
    currentSettings.overlay = sliderOverlay ? parseInt(sliderOverlay.value, 10) : 22;

    applySettings();
    saveSettings();
  }

  [sliderBlur, sliderBrightness, sliderContrast, sliderSaturate, sliderOverlay].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', updateFiltersFromSliders);
      slider.addEventListener('change', updateFiltersFromSliders);
    }
  });

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      currentSettings.type = swatch.getAttribute('data-bg-type') || 'color';
      currentSettings.val = swatch.getAttribute('data-bg-val') || '#ffffff';

      applySettings();
      saveSettings();

      const name = swatch.querySelector('.color-swatch__name')?.textContent || 'الخلفية';
      showToast(`تم حفظ وتطبيق خلفية "${name}" 🎨`);
    });
  });

  if (customColorInput) {
    customColorInput.addEventListener('input', (e) => {
      const colorVal = e.target.value;
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      const parentLabel = customColorInput.closest('.color-swatch');
      if (parentLabel) parentLabel.classList.add('active');
      if (customColorPreview) customColorPreview.style.background = colorVal;

      currentSettings.type = 'color';
      currentSettings.val = colorVal;
      applySettings();
      saveSettings();
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
          currentSettings.type = 'image';
          currentSettings.val = event.target.result;
          applySettings();
          saveSettings();
          showToast('تم حفظ وتطبيق صورة الخلفية بنجاح 🖼️');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentSettings = {
        type: 'image',
        val: 'assets/background.jpg',
        blur: 20,
        brightness: 89,
        contrast: 98,
        saturate: 140,
        overlay: 22
      };

      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      const defaultImgSwatch = document.querySelector('.color-swatch[data-bg-type="image"]');
      if (defaultImgSwatch) defaultImgSwatch.classList.add('active');

      applySettings();
      saveSettings();
      showToast('تم إعادة ضبط إعدادات الخلفية للمصنع 🔄');
    });
  }

  // Load persisted background settings from localStorage
  try {
    const saved = localStorage.getItem('nahda_bg_settings');
    if (saved) {
      currentSettings = Object.assign(currentSettings, JSON.parse(saved));
    }
  } catch (e) {}

  applySettings();
}
