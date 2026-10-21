// Small validation helpers. Checking `typeof` matters: it stops attackers from
// sending objects like {"$gt": ""} (NoSQL injection) where we expect strings.

export const isString = (v) => typeof v === 'string';

export const clean = (v) => (isString(v) ? v.trim() : '');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isEmail = (v) => isString(v) && v.length <= 254 && EMAIL_RE.test(v);

// Only http/https URLs are accepted (blocks "javascript:" links).
export const isHttpUrl = (v) => {
  if (!isString(v) || v.length > 500) return false;
  try {
    const { protocol } = new URL(v);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};
