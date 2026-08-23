/* --------------------------------------------------------------------------
   SHARED TOAST NOTIFICATION HELPER
   -------------------------------------------------------------------------- */
import { DOM } from './dom.js';

let activeToastTimer = null;

export function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = DOM.createElement('div', { className: 'toast' });
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${DOM.escapeHTML(message)}</span>
  `;

  toast.classList.add('toast--visible');

  if (activeToastTimer) {
    clearTimeout(activeToastTimer);
  }

  activeToastTimer = setTimeout(() => {
    toast.classList.remove('toast--visible');
    activeToastTimer = null;
  }, 3200);
}
