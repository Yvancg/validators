/**
 * Validate a canonical Gregorian ISO calendar date (YYYY-MM-DD).
 * Date-only: times, offsets, leading/trailing spaces and year 0000 are rejected.
 */
export function isIsoDateSafe(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  if (!year || month < 1 || month > 12 || day < 1) return false;

  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = month === 2 ? (leap ? 29 : 28)
    : [4, 6, 9, 11].includes(month) ? 30 : 31;
  return day <= days;
}
