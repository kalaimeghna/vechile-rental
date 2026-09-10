import React, { useMemo } from "react";
import {
  CalendarDays,
  Car,
  Clock,
  MapPin,
  User,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

export interface BookingSummaryVehicle {
  _id: string;
  name?: string;
  brand?: string;
  model?: string;
  image?: string;
  images?: string[];
  pricePerDay?: number;
  price?: number;
  location?: string;
}

export interface BookingSummaryProps {
  vehicle: BookingSummaryVehicle;

  pickupDate?: string;
  returnDate?: string;

  pickupLocation?: string;
  returnLocation?: string;

  customerName?: string;

  /**
   * Optional additional charges
   */
  securityDeposit?: number;
  serviceFee?: number;
  taxPercentage?: number;

  /**
   * Optional callback
   */
  onConfirm?: () => void;

  /**
   * Hide confirm button when used only
   * as a summary card.
   */
  showConfirmButton?: boolean;

  /**
   * Disable confirm button
   */
  loading?: boolean;

  /**
   * Button text
   */
  confirmText?: string;

  /**
   * Currency symbol
   */
  currency?: string;

  /**
   * Additional class
   */
  className?: string;
}

// =========================================================
// HELPERS
// =========================================================

const formatPrice = (amount: number, currency: string): string => {
  return `${currency}${amount.toLocaleString("en-IN")}`;
};

const getDate = (date?: string): Date | null => {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

const formatDate = (date?: string): string => {
  const parsedDate = getDate(date);

  if (!parsedDate) {
    return "Not selected";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// =========================================================
// COMPONENT
// =========================================================

const BookingSummary: React.FC<BookingSummaryProps> = ({
  vehicle,
  pickupDate,
  returnDate,
  pickupLocation,
  returnLocation,
  customerName,
  securityDeposit = 0,
  serviceFee = 0,
  taxPercentage = 0,
  onConfirm,
  showConfirmButton = true,
  loading = false,
  confirmText = "Confirm Booking",
  currency = "₹",
  className = "",
}) => {
  // =======================================================
  // VEHICLE PRICE
  // =======================================================

  const pricePerDay = Number(vehicle.pricePerDay ?? vehicle.price ?? 0) || 0;

  // =======================================================
  // IMAGE
  // =======================================================

  const vehicleImage = vehicle.image || vehicle.images?.[0] || "";

  // =======================================================
  // RENTAL DAYS
  // =======================================================

  const rentalDays = useMemo(() => {
    const start = getDate(pickupDate);
    const end = getDate(returnDate);

    if (!start || !end) {
      return 0;
    }

    const startDate = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );

    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    const difference = endDate.getTime() - startDate.getTime();

    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return Math.max(days, 0);
  }, [pickupDate, returnDate]);

  // =======================================================
  // PRICE CALCULATIONS
  // =======================================================

  const rentalAmount = rentalDays * pricePerDay;

  const subtotal = rentalAmount + serviceFee;

  const taxAmount = subtotal * (taxPercentage / 100);

  const totalAmount = subtotal + taxAmount;

  // =======================================================
  // VEHICLE TITLE
  // =======================================================

  const vehicleTitle =
    vehicle.name ||
    [vehicle.brand, vehicle.model].filter(Boolean).join(" ") ||
    "Vehicle";

  // =======================================================
  // UI
  // =======================================================

  return (
    <div
      className={`
        w-full
        bg-white
        border
        border-gray-200
        rounded-2xl
        shadow-sm
        overflow-hidden
        ${className}
      `}
    >
      {/* ===================================================
          HEADER
      ==================================================== */}

      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Booking Summary</h2>

        <p className="mt-1 text-sm text-gray-500">
          Review your rental details before confirming.
        </p>
      </div>

      {/* ===================================================
          VEHICLE
      ==================================================== */}

      <div className="p-5">
        <div className="flex gap-4">
          {/* Image */}

          <div className="w-24 h-20 sm:w-28 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
            {vehicleImage ? (
              <img
                src={vehicleImage}
                alt={vehicleTitle}
                className="
                  w-full
                  h-full
                  object-cover
                "
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Vehicle info */}

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {vehicleTitle}
            </h3>

            {(vehicle.brand || vehicle.model) && (
              <p className="text-sm text-gray-500 mt-1">
                {[vehicle.brand, vehicle.model].filter(Boolean).join(" ")}
              </p>
            )}

            {vehicle.location && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5" />

                <span className="truncate">{vehicle.location}</span>
              </div>
            )}

            <div className="mt-2">
              <span className="font-bold text-blue-600">
                {formatPrice(pricePerDay, currency)}
              </span>

              <span className="text-xs text-gray-500 ml-1">/ day</span>
            </div>
          </div>
        </div>

        {/* =================================================
            BOOKING DETAILS
        ================================================== */}

        <div className="mt-6 space-y-4">
          {/* Customer */}

          {customerName && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>

              <div>
                <p className="text-xs text-gray-500">Customer</p>

                <p className="text-sm font-medium text-gray-900">
                  {customerName}
                </p>
              </div>
            </div>
          )}

          {/* Pickup */}

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-blue-600" />
            </div>

            <div className="flex-1">
              <p className="text-xs text-gray-500">Pickup Date</p>

              <p className="text-sm font-medium text-gray-900">
                {formatDate(pickupDate)}
              </p>

              {pickupLocation && (
                <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {pickupLocation}
                </p>
              )}
            </div>
          </div>

          {/* Return */}

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-green-600" />
            </div>

            <div className="flex-1">
              <p className="text-xs text-gray-500">Return Date</p>

              <p className="text-sm font-medium text-gray-900">
                {formatDate(returnDate)}
              </p>

              {returnLocation && (
                <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {returnLocation}
                </p>
              )}
            </div>
          </div>

          {/* Duration */}

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Rental Duration</p>

              <p className="text-sm font-medium text-gray-900">
                {rentalDays > 0
                  ? `${rentalDays} ${rentalDays === 1 ? "day" : "days"}`
                  : "Not selected"}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            DIVIDER
        ================================================== */}

        <div className="my-6 border-t border-dashed border-gray-200" />

        {/* =================================================
            PRICE BREAKDOWN
        ================================================== */}

        <div className="space-y-3">
          {/* Rental */}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {formatPrice(pricePerDay, currency)} × {rentalDays || 0}{" "}
              {rentalDays === 1 ? "day" : "days"}
            </span>

            <span className="font-medium text-gray-900">
              {formatPrice(rentalAmount, currency)}
            </span>
          </div>

          {/* Service Fee */}

          {serviceFee > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Service Fee</span>

              <span className="font-medium text-gray-900">
                {formatPrice(serviceFee, currency)}
              </span>
            </div>
          )}

          {/* Tax */}

          {taxPercentage > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Tax ({taxPercentage}%)</span>

              <span className="font-medium text-gray-900">
                {formatPrice(taxAmount, currency)}
              </span>
            </div>
          )}

          {/* Security Deposit */}

          {securityDeposit > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Security Deposit</span>

              <span className="font-medium text-gray-900">
                {formatPrice(securityDeposit, currency)}
              </span>
            </div>
          )}
        </div>

        {/* =================================================
            TOTAL
        ================================================== */}

        <div className="mt-5 p-4 rounded-xl bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Total Amount
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Taxes and fees included
              </p>
            </div>

            <p className="text-xl font-bold text-blue-600">
              {formatPrice(totalAmount, currency)}
            </p>
          </div>
        </div>

        {/* =================================================
            SECURITY INFO
        ================================================== */}

        <div className="flex items-start gap-3 mt-5 p-3 rounded-lg bg-green-50 border border-green-100">
          <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />

          <div>
            <p className="text-sm font-medium text-green-800">Secure Booking</p>

            <p className="text-xs text-green-700 mt-0.5">
              Your booking information is securely processed.
            </p>
          </div>
        </div>

        {/* =================================================
            CONFIRM BUTTON
        ================================================== */}

        {showConfirmButton && (
          <button
            type="button"
            disabled={loading || rentalDays <= 0}
            onClick={onConfirm}
            className="
              w-full
              mt-5
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-blue-600
              text-white
              text-sm
              font-semibold
              hover:bg-blue-700
              active:bg-blue-800
              disabled:bg-gray-300
              disabled:text-gray-500
              disabled:cursor-not-allowed
              transition
            "
          >
            {loading ? (
              <>
                <span
                  className="
                    w-4
                    h-4
                    border-2
                    border-white/40
                    border-t-white
                    rounded-full
                    animate-spin
                  "
                />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />

                {confirmText}
              </>
            )}
          </button>
        )}

        {/* Invalid dates */}

        {!pickupDate || !returnDate ? (
          <p className="mt-3 text-center text-xs text-gray-500">
            Select pickup and return dates to continue.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default BookingSummary;
