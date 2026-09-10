// ============================================================
// PRICE FORMATTING UTILITIES
// Vehicle Rental Platform
// ============================================================

/**
 * Format price using Indian Rupee.
 *
 * Example:
 * formatPrice(3500)
 * => "₹3,500"
 */
export const formatPrice = (
  price: number | string | null | undefined,
): string => {
  if (price === null || price === undefined || price === "") {
    return "₹0";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

/**
 * Format price with decimal values.
 *
 * Example:
 * formatPriceWithDecimals(3500.50)
 * => "₹3,500.50"
 */
export const formatPriceWithDecimals = (
  price: number | string | null | undefined,
): string => {
  if (price === null || price === undefined || price === "") {
    return "₹0.00";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "₹0.00";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

/**
 * Format rental price.
 *
 * Example:
 * formatRentalPrice(3500)
 * => "₹3,500 / day"
 */
export const formatRentalPrice = (
  price: number | string | null | undefined,
): string => {
  return `${formatPrice(price)} / day`;
};

/**
 * Calculate total rental price.
 *
 * Example:
 * calculateTotalPrice(3500, 3)
 * => 10500
 */
export const calculateTotalPrice = (
  pricePerDay: number,
  numberOfDays: number,
): number => {
  if (pricePerDay < 0 || numberOfDays <= 0) {
    return 0;
  }

  return pricePerDay * numberOfDays;
};

/**
 * Calculate tax.
 *
 * Example:
 * calculateTax(10000, 18)
 * => 1800
 */
export const calculateTax = (amount: number, taxPercentage: number): number => {
  if (amount <= 0 || taxPercentage < 0) {
    return 0;
  }

  return amount * (taxPercentage / 100);
};

/**
 * Calculate final rental amount.
 *
 * Example:
 * calculateFinalAmount(
 *   10000,
 *   18
 * )
 * => 11800
 */
export const calculateFinalAmount = (
  subtotal: number,
  taxPercentage = 18,
): number => {
  const tax = calculateTax(subtotal, taxPercentage);

  return subtotal + tax;
};

/**
 * Calculate discount.
 */
export const calculateDiscount = (
  amount: number,
  discountPercentage: number,
): number => {
  if (amount <= 0 || discountPercentage <= 0) {
    return 0;
  }

  return amount * (discountPercentage / 100);
};

/**
 * Calculate final amount after discount.
 */
export const calculateAfterDiscount = (
  amount: number,
  discountPercentage: number,
): number => {
  const discount = calculateDiscount(amount, discountPercentage);

  return Math.max(0, amount - discount);
};
