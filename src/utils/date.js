/* --------------------------------------------------------------------------
   DATE & TIME UTILITIES
   Provides live Arabic date formatting and time-aware Arabic greetings
   (صباح الخير / مساء الخير).
   -------------------------------------------------------------------------- */

/**
 * Returns a time-based Arabic greeting based on the current hour:
 * - 05:00 to 11:59: "صباح الخير" (Good Morning)
 * - 12:00 to 04:59: "مساء الخير" (Good Evening)
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return 'صباح الخير';
  }
  return 'مساء الخير';
}

/**
 * Formats a given Date into a standard Arabic localized date string
 * e.g. "السبت، 22 أغسطس 2026"
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export function getFormattedArabicDate(date = new Date()) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('ar-EG', options);
}
