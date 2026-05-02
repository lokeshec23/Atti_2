/**
 * Text sanitization utilities.
 * Since this is a localStorage-only app (no server rendering), these protect
 * against accidental XSS when values are later inserted into the DOM.
 */

/** Maximum field lengths to prevent localStorage bloat */
const MAX_LENGTHS = {
  title:    200,
  desc:     2000,
  name:     100,
  role:     100,
  email:    254,
  location: 100,
  message:  4000,
};

/**
 * Strips HTML tags and trims whitespace from a string.
 * @param {string} value
 * @param {string} [field] - field name for length capping
 * @returns {string}
 */
export function sanitizeText(value, field) {
  if (typeof value !== 'string') return '';
  let cleaned = value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
  if (field && MAX_LENGTHS[field]) {
    cleaned = cleaned.slice(0, MAX_LENGTHS[field]);
  }
  return cleaned;
}

/**
 * Validates that a string is a plausible email address.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates password meets minimum security requirements.
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters.' };
  }
  return { valid: true, message: '' };
}
