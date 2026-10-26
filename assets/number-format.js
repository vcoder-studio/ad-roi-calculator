/**
 * Number display, input parsing and copy/export formatting — shared by the
 * side panel and the full-screen page (they used to carry two copies).
 *
 * Display: thousands separated by a (non-breaking) space, decimals by a
 * point — "1 000", "13 333", "0.83". A space between digit groups can't be
 * mistaken for a decimal mark in any country, whereas "1,000" reads as
 * "one point zero" to anyone who writes decimals with a comma, and "1.000"
 * does to everyone else.
 */

const NBSP = ' ';

function round(val, formatType) {
  // Same rounding rules the screen has always used, in one place.
  if (formatType === 'percent') return { n: val * 100, max: 2 };
  if (formatType === 'currency') return { n: val, max: Math.abs(val) >= 1000 ? 0 : 2 };
  if (formatType === 'float') return { n: val, max: 2 };
  return { n: Math.round(val), max: 0 };
}

function plain(val, formatType, grouping) {
  const { n, max } = round(val, formatType);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: max,
    useGrouping: grouping
  }).format(n);
}

export function formatValue(val, formatType) {
  if (val === undefined || val === null || isNaN(val)) return '';
  if (!isFinite(val)) return '∞';
  return plain(val, formatType, true).replace(/,/g, NBSP);
}

/**
 * Reads whatever a person types: "1000", "1 000", "1,000", "1.000,5",
 * "0,5", "0.5". Rule for the one ambiguous case: a comma followed by
 * exactly three digits is a thousands mark ("1,000"), otherwise it is a
 * decimal comma ("0,5"). A single point is always a decimal point.
 */
export function parseInputValue(str, formatType) {
  if (str === '') return undefined;
  let s = String(str).replace(/[\s  ']/g, '').replace(/[^\d.,-]/g, '');
  if (s === '' || s === '-') return undefined;

  const hasComma = s.includes(',');
  const hasPoint = s.includes('.');
  if (hasComma && hasPoint) {
    // Whichever comes last is the decimal mark; the other groups thousands.
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      s = s.replace(/,/g, '');
    }
  } else if (hasComma) {
    s = /^-?\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.');
  } else if (hasPoint && (s.match(/\./g) || []).length > 1) {
    s = s.replace(/\./g, '');
  }

  const val = parseFloat(s);
  if (isNaN(val)) return undefined;
  return formatType === 'percent' ? val / 100 : val;
}

/** Decimal mark the user's spreadsheet most likely expects when pasting. */
export function spreadsheetDecimalMark() {
  try {
    const sample = (1.1).toLocaleString(navigator.language || 'en-US');
    return sample.includes(',') ? ',' : '.';
  } catch (e) {
    return '.';
  }
}

/**
 * For clipboard / CSV: the same rounding as on screen (so what you see is
 * what lands in the sheet, without float noise like 13333.333333333334),
 * but with no digit grouping — "13333.33", so a spreadsheet reads a number
 * rather than text. `decimalMark` is "." for CSV and the user's own mark
 * for the clipboard.
 */
export function formatForExport(val, formatType, decimalMark = '.') {
  if (val === undefined || val === null || isNaN(val) || !isFinite(val)) return '';
  return plain(val, formatType, false).replace('.', decimalMark);
}
