import React from "react";
import {
  CalendarDays,
  MapPin,
  Car,
  Eye,
  XCircle,
  CheckCircle2,
  User,
} from "lucide-react";

import BookingStatus from "./BookingStatus";
import Button from "../common/Button";

// =========================================================
// TYPES
// =========================================================

export interface BookingCardVehicle {
  _id: string;
  name?: string;
  brand?: string;
  model?: string;
  image?: string;
  images?: string[];
}

export interface BookingCardCustomer {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface Booking {
  _id: string;

  bookingId?: string;

  vehicle: BookingCardVehicle | null;

  user?: BookingCardCustomer | null;

  customer?: BookingCardCustomer | null;

  pickupDate?: string;

  returnDate?: string;

  startDate?: string;

  endDate?: string;

  pickupLocation?: string;

  returnLocation?: string;

  totalAmount?: number;

  totalPrice?: number;

  price?: number;

  status?: string;

  createdAt?: string;
}

interface BookingCardProps {
  booking: Booking;

  currency?: string;

  /**
   * View booking callback
   */
  onView?: (booking: Booking) => void;

  /**
   * Cancel booking callback
   */
  onCancel?: (booking: Booking) => void;

  /**
   * Approve booking callback
   */
  onApprove?: (booking: Booking) => void;

  /**
   * Reject booking callback
   */
  onReject?: (booking: Booking) => void;

  /**
   * Loading state
   */
  actionLoading?: boolean;

  /**
   * Show customer details
   */
  showCustomer?: boolean;

  /**
   * Owner dashboard mode
   */
  ownerMode?: boolean;

  className?: string;
}

// =========================================================
// HELPERS
// =========================================================

const formatDate = (date?: string): string => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (amount: number, currency: string): string => {
  return `${currency}${amount.toLocaleString("en-IN")}`;
};

const getVehicleName = (vehicle: BookingCardVehicle | null): string => {
  if (!vehicle) {
    return "Vehicle";
  }

  if (vehicle.name) {
    return vehicle.name;
  }

  return [vehicle.brand, vehicle.model].filter(Boolean).join(" ") || "Vehicle";
};

const getCustomer = (booking: Booking): BookingCardCustomer | null => {
  return booking.customer || booking.user || null;
};

// =========================================================
// COMPONENT
// =========================================================

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  currency = "₹",
  onView,
  onCancel,
  onApprove,
  onReject,
  actionLoading = false,
  showCustomer = false,
  ownerMode = false,
  className = "",
}) => {
  // =======================================================
  // VEHICLE
  // =======================================================

  const vehicle = booking.vehicle;

  const vehicleName = getVehicleName(vehicle);

  const vehicleImage = vehicle?.image || vehicle?.images?.[0] || "";

  // =======================================================
  // DATES
  // =======================================================

  const pickupDate = booking.pickupDate || booking.startDate;

  const returnDate = booking.returnDate || booking.endDate;

  // =======================================================
  // PRICE
  // =======================================================

  const totalAmount =
    Number(booking.totalAmount ?? booking.totalPrice ?? booking.price ?? 0) ||
    0;

  // =======================================================
  // CUSTOMER
  // =======================================================

  const customer = getCustomer(booking);

  // =======================================================
  // STATUS
  // =======================================================

  const status = booking.status || "pending";

  const normalizedStatus = status.toLowerCase().trim();

  // =======================================================
  // CAN CANCEL
  // =======================================================

  const canCancel = ![
    "cancelled",
    "completed",
    "rejected",
    "refunded",
  ].includes(normalizedStatus);

  // =======================================================
  // OWNER ACTIONS
  // =======================================================

  const canApprove = ownerMode && ["pending"].includes(normalizedStatus);

  const canReject = ownerMode && ["pending"].includes(normalizedStatus);

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
        hover:shadow-md
        transition-shadow
        overflow-hidden
        ${className}
      `}
    >
      {/* ===================================================
          MAIN CONTENT
      ==================================================== */}

      <div className="p-5">
        {/* =================================================
            TOP SECTION
        ================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Vehicle */}

          <div className="flex gap-4 min-w-0">
            {/* Image */}

            <div
              className="
                w-24
                h-20
                sm:w-28
                sm:h-24
                shrink-0
                rounded-xl
                overflow-hidden
                bg-gray-100
              "
            >
              {vehicleImage ? (
                <img
                  src={vehicleImage}
                  alt={vehicleName}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Car className="w-9 h-9 text-gray-400" />
                </div>
              )}
            </div>

            {/* Details */}

            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                {vehicleName}
              </h3>

              {booking.bookingId && (
                <p className="text-xs text-gray-500 mt-1">
                  Booking ID:{" "}
                  <span className="font-medium">{booking.bookingId}</span>
                </p>
              )}

              <div className="mt-2">
                <BookingStatus status={status} size="sm" />
              </div>
            </div>
          </div>

          {/* Price */}

          <div className="sm:text-right shrink-0">
            <p className="text-xs text-gray-500">Total Amount</p>

            <p className="text-xl font-bold text-blue-600 mt-1">
              {formatPrice(totalAmount, currency)}
            </p>
          </div>
        </div>

        {/* =================================================
            CUSTOMER
        ================================================== */}

        {showCustomer && customer && (
          <div className="mt-5 p-3 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-500" />

              <p className="text-xs font-semibold text-gray-700">Customer</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {customer.name && (
                <p className="text-sm text-gray-900">{customer.name}</p>
              )}

              {customer.email && (
                <p className="text-xs text-gray-500 truncate">
                  {customer.email}
                </p>
              )}

              {customer.phone && (
                <p className="text-xs text-gray-500">{customer.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* =================================================
            BOOKING INFORMATION
        ================================================== */}

        <div
          className="
            mt-5
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
        >
          {/* Pickup */}

          <div
            className="
              flex
              items-start
              gap-3
              p-3
              rounded-xl
              bg-gray-50
            "
          >
            <div
              className="
                w-9
                h-9
                rounded-lg
                bg-blue-50
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <CalendarDays className="w-4 h-4 text-blue-600" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500">Pickup</p>

              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {formatDate(pickupDate)}
              </p>

              {booking.pickupLocation && (
                <p
                  className="
                    flex
                    items-center
                    gap-1
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  <MapPin className="w-3 h-3 shrink-0" />

                  <span className="truncate">{booking.pickupLocation}</span>
                </p>
              )}
            </div>
          </div>

          {/* Return */}

          <div
            className="
              flex
              items-start
              gap-3
              p-3
              rounded-xl
              bg-gray-50
            "
          >
            <div
              className="
                w-9
                h-9
                rounded-lg
                bg-green-50
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <CalendarDays className="w-4 h-4 text-green-600" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500">Return</p>

              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {formatDate(returnDate)}
              </p>

              {booking.returnLocation && (
                <p
                  className="
                    flex
                    items-center
                    gap-1
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  <MapPin className="w-3 h-3 shrink-0" />

                  <span className="truncate">{booking.returnLocation}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            ACTIONS
        ================================================== */}

        <div
          className="
            mt-5
            pt-4
            border-t
            border-gray-100
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
          "
        >
          {/* Owner actions */}

          <div className="flex flex-wrap gap-2">
            {canApprove && (
              <Button
                variant="success"
                size="sm"
                loading={actionLoading}
                leftIcon={
                  !actionLoading ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : undefined
                }
                onClick={() => onApprove?.(booking)}
              >
                Approve
              </Button>
            )}

            {canReject && (
              <Button
                variant="danger"
                size="sm"
                disabled={actionLoading}
                leftIcon={<XCircle className="w-4 h-4" />}
                onClick={() => onReject?.(booking)}
              >
                Reject
              </Button>
            )}

            {canCancel && !ownerMode && (
              <Button
                variant="outline"
                size="sm"
                disabled={actionLoading}
                leftIcon={<XCircle className="w-4 h-4" />}
                onClick={() => onCancel?.(booking)}
              >
                Cancel
              </Button>
            )}
          </div>

          {/* View */}

          {onView && (
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<Eye className="w-4 h-4" />}
              onClick={() => onView(booking)}
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
