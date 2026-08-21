/* --------------------------------------------------------------------------
   5. FILE UPLOAD DROPZONE INTERACTIVITY
   -------------------------------------------------------------------------- */
function initFileUpload() {
  const uploadArea = document.querySelector('.form-upload');
  const fileInput = document.getElementById('file-input');

  if (!uploadArea) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.classList.add('form-upload--dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.classList.remove('form-upload--dragover');
    }, false);
  });

  uploadArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleFileSelected(files[0].name);
    }
  });

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        handleFileSelected(fileInput.files[0].name);
      }
    });
  }
}

function handleFileSelected(fileName) {
  const title = document.querySelector('.form-upload__title');
  if (title) {
    title.textContent = `الملف المحدد: ${fileName}`;
  }
  showToast(`تم إرفاق الملف: ${fileName}`);
}

/* --------------------------------------------------------------------------
   6. FORM ACTIONS & TOAST MESSAGING SYSTEM
   -------------------------------------------------------------------------- */
function initFormInteractivity() {
  const saveBtn = document.querySelector('.btn--primary');
  if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('تم حفظ التغييرات بنجاح');
    });
  }
}
