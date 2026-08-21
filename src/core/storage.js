/* --------------------------------------------------------------------------
   LOCALSTORAGE ACCESS WRAPPER
   Pure pass-through: same keys, same values, same silent-failure behavior
   as the ad hoc try/catch blocks previously scattered across modules.
   -------------------------------------------------------------------------- */
export function getItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
}
