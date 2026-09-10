// ============================================================
// DATE FORMATTING UTILITIES
// Vehicle Rental Platform
// ============================================================

/**
 * Convert Date object or date string to:
 * YYYY-MM-DD
 *
 * Example:
 * formatDateInput(new Date())
 * => "2026-08-18"
 */
export const formatDateInput = (
  date: Date | string | null | undefined,
): string => {
  if (!date) {
    return "";
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();

  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");

  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Format date to:
 * DD/MM/YYYY
 *
 * Example:
 * 18/08/2026
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  const day = String(parsedDate.getDate()).padStart(2, "0");

  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");

  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Format date to:
 * 18 Aug 2026
 */
export const formatShortDate = (
  date: Date | string | null | undefined,
): string => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format date to:
 * August 18, 2026
 */
export const formatLongDate = (
  date: Date | string | null | undefined,
): string => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Format date and time.
 *
 * Example:
 * 18 Aug 2026, 06:30 PM
 */
export const formatDateTime = (
  date: Date | string | null | undefined,
): string => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Check whether date is today.
 */
export const isToday = (date: Date | string): boolean => {
  const parsedDate = date instanceof Date ? date : new Date(date);

  const today = new Date();

  return (
    parsedDate.getFullYear() === today.getFullYear() &&
    parsedDate.getMonth() === today.getMonth() &&
    parsedDate.getDate() === today.getDate()
  );
};

/**
 * Check whether date is in the past.
 */
export const isPastDate = (date: Date | string): boolean => {
  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  parsedDate.setHours(0, 0, 0, 0);

  return parsedDate < today;
};

/**
 * Check whether date is in the future.
 */
export const isFutureDate = (date: Date | string): boolean => {
  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  parsedDate.setHours(0, 0, 0, 0);

  return parsedDate > today;
};

/**
 * Get number of rental days.
 *
 * Example:
 * calculateRentalDays(
 *   "2026-08-20",
 *   "2026-08-23"
 * )
 * => 3
 */
export const calculateRentalDays = (
  startDate: string | Date,
  endDate: string | Date,
): number => {
  const start = startDate instanceof Date ? startDate : new Date(startDate);

  const end = endDate instanceof Date ? endDate : new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const difference = end.getTime() - start.getTime();

  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return days > 0 ? days : 0;
};

/**
 * Get today's date as YYYY-MM-DD.
 */
export const getTodayDate = (): string => {
  return formatDateInput(new Date());
};

/**
 * Get minimum booking date.
 *
 * By default returns today.
 */
export const getMinBookingDate = (): string => {
  return getTodayDate();
};

/**
 * Compare two dates.
 *
 * Returns:
 * -1 if first date is before second
 *  0 if same
 *  1 if first date is after second
 */
export const compareDates = (
  firstDate: string | Date,
  secondDate: string | Date,
): number => {
  const first = firstDate instanceof Date ? firstDate : new Date(firstDate);

  const second = secondDate instanceof Date ? secondDate : new Date(secondDate);

  if (first < second) {
    return -1;
  }

  if (first > second) {
    return 1;
  }

  return 0;
};
