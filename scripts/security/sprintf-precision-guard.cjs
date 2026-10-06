/**
 * Bounds a sprintf placeholder's precision (GHSA-hp3w-g68c-fv3c).
 *
 * sprintf-js hands the digits after a `.` straight to `toFixed`, `toExponential` and
 * `toPrecision` without checking them, so a format string carrying a precision past the
 * ECMAScript limit aborts the call with an uncaught `RangeError`: a format string of a few
 * characters stops whatever operation it was interpolated into.
 *
 * The bound is the ECMAScript ceiling of 100 for the numeric conversions, and a length no
 * substring operation can exhaust for the string conversions, where precision only says how
 * much of the value to keep. Nothing throws here — the intent is that the operation
 * completes, which is what a caller with an attacker-supplied format string needs.
 */

const NUMERIC_TYPES = new Set(['e', 'f', 'g']);
const MAX_NUMERIC_PRECISION = 100;
const MAX_STRING_PRECISION = 1_000_000;

module.exports = function an5BoundPrecision(precision, type) {
  if (precision === undefined || precision === null || precision === '') return undefined;
  const value = Number.parseInt(precision, 10);
  if (!Number.isFinite(value) || value <= 0) return undefined;
  const limit = NUMERIC_TYPES.has(type) ? MAX_NUMERIC_PRECISION : MAX_STRING_PRECISION;
  return value > limit ? limit : value;
};