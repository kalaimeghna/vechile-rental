// ============================================================
// BOOKING TYPES
// ============================================================

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "approved"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "rejected";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// ============================================================
// USER
// ============================================================

export interface BookingUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
}

// ============================================================
// VEHICLE
// ============================================================

export interface BookingVehicle {
  _id: string;

  name?: string;
  brand?: string;
  model?: string;

  vehicleType?: string;
  type?: string;

  registrationNumber?: string;

  pricePerDay?: number;
  price?: number;

  images?: string[];
  image?: string;

  location?: string;

  seats?: number;

  fuelType?: string;

  transmission?: string;
}

// ============================================================
// BOOKING
// ============================================================

export interface Booking {
  _id: string;

  vehicle: BookingVehicle | string | null;

  user: BookingUser | string | null;

  owner?: BookingUser | string | null;

  // Dates
  startDate: string;
  endDate: string;

  pickupDate?: string;
  returnDate?: string;

  // Locations
  pickupLocation?: string;
  returnLocation?: string;

  // Pricing
  pricePerDay?: number;

  totalDays?: number;

  totalAmount?: number;

  amount?: number;

  // Status
  status?: BookingStatus;

  bookingStatus?: BookingStatus;

  // Payment
  paymentStatus?: PaymentStatus;

  paymentId?: string;

  transactionId?: string;

  // Additional information
  notes?: string;

  cancellationReason?: string;

  rejectionReason?: string;

  // Timestamps
  createdAt?: string;

  updatedAt?: string;
}

// ============================================================
// CREATE BOOKING
// ============================================================

export interface CreateBookingData {
  vehicleId: string;

  startDate: string;

  endDate: string;

  pickupDate?: string;

  returnDate?: string;

  pickupLocation?: string;

  returnLocation?: string;

  totalDays?: number;

  totalAmount?: number;

  notes?: string;
}

// ============================================================
// UPDATE BOOKING
// ============================================================

export interface UpdateBookingData {
  startDate?: string;

  endDate?: string;

  pickupDate?: string;

  returnDate?: string;

  pickupLocation?: string;

  returnLocation?: string;

  totalDays?: number;

  totalAmount?: number;

  notes?: string;

  status?: BookingStatus;
}

// ============================================================
// BOOKING STATUS UPDATE
// ============================================================

export interface UpdateBookingStatusData {
  status: BookingStatus;

  reason?: string;
}

// ============================================================
// CANCEL BOOKING
// ============================================================

export interface CancelBookingData {
  reason?: string;
}

// ============================================================
// BOOKING RESPONSE
// ============================================================

export interface BookingResponse {
  success?: boolean;

  message?: string;

  booking?: Booking;

  data?: Booking;
}

// ============================================================
// BOOKINGS RESPONSE
// ============================================================

export interface BookingsResponse {
  success?: boolean;

  message?: string;

  bookings?: Booking[];

  data?: Booking[];

  total?: number;

  page?: number;

  limit?: number;

  pages?: number;

  totalPages?: number;
}

// ============================================================
// PAGINATION
// ============================================================

export interface BookingPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

// ============================================================
// FILTERS
// ============================================================

export interface BookingFilters {
  status?: BookingStatus;

  paymentStatus?: PaymentStatus;

  vehicleId?: string;

  userId?: string;

  ownerId?: string;

  startDate?: string;

  endDate?: string;

  search?: string;

  page?: number;

  limit?: number;
}

// ============================================================
// AVAILABILITY
// ============================================================

export interface VehicleAvailabilityRequest {
  vehicleId: string;

  startDate: string;

  endDate: string;
}

export interface VehicleAvailabilityResponse {
  success?: boolean;

  available: boolean;

  message?: string;

  conflictingBookings?: Booking[];
}

// ============================================================
// BOOKING SUMMARY
// ============================================================

export interface BookingSummary {
  totalBookings: number;

  pendingBookings: number;

  confirmedBookings: number;

  ongoingBookings: number;

  completedBookings: number;

  cancelledBookings: number;

  totalRevenue: number;
}

// ============================================================
// OWNER BOOKING
// ============================================================

export interface OwnerBooking extends Booking {
  customer?: BookingUser;

  renter?: BookingUser;
}

// ============================================================
// USER BOOKING
// ============================================================

export interface UserBooking extends Booking {
  owner?: BookingUser | string | null;

  vehicle: BookingVehicle | string | null;
}

// ============================================================
// BOOKING CARD PROPS
// ============================================================

export interface BookingCardProps {
  booking: Booking;

  onView?: (booking: Booking) => void;

  onCancel?: (booking: Booking) => void;

  onApprove?: (booking: Booking) => void;

  onReject?: (booking: Booking) => void;
}

// ============================================================
// BOOKING FORM PROPS
// ============================================================

export interface BookingFormProps {
  vehicle: BookingVehicle;

  onSuccess?: (booking: Booking) => void;

  onCancel?: () => void;
}

// ============================================================
// BOOKING STATUS PROPS
// ============================================================

export interface BookingStatusProps {
  status?: BookingStatus;

  className?: string;
}

// ============================================================
// BOOKING SUMMARY PROPS
// ============================================================

export interface BookingSummaryProps {
  booking: Booking;

  showActions?: boolean;

  onCancel?: () => void;

  onConfirm?: () => void;
}

// ============================================================
// HELPER TYPES
// ============================================================

export interface DateRange {
  startDate: string;

  endDate: string;
}

export interface PriceBreakdown {
  pricePerDay: number;

  totalDays: number;

  subtotal: number;

  tax?: number;

  discount?: number;

  total: number;
}

// ============================================================
// STATUS HELPERS
// ============================================================

export const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "approved",
  "ongoing",
  "completed",
  "cancelled",
  "rejected",
];

export const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

// ============================================================
// STATUS LABEL
// ============================================================

export const getBookingStatusLabel = (status?: BookingStatus): string => {
  if (!status) {
    return "Unknown";
  }

  switch (status) {
    case "pending":
      return "Pending";

    case "confirmed":
      return "Confirmed";

    case "approved":
      return "Approved";

    case "ongoing":
      return "Ongoing";

    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    case "rejected":
      return "Rejected";

    default:
      return "Unknown";
  }
};

// ============================================================
// PAYMENT STATUS LABEL
// ============================================================

export const getPaymentStatusLabel = (status?: PaymentStatus): string => {
  if (!status) {
    return "Unknown";
  }

  switch (status) {
    case "pending":
      return "Pending";

    case "paid":
      return "Paid";

    case "failed":
      return "Failed";

    case "refunded":
      return "Refunded";

    default:
      return "Unknown";
  }
};

// ============================================================
// STATUS COLOR
// ============================================================

export const getBookingStatusColor = (status?: BookingStatus): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "confirmed":
    case "approved":
      return "bg-green-100 text-green-700";

    case "ongoing":
      return "bg-blue-100 text-blue-700";

    case "completed":
      return "bg-emerald-100 text-emerald-700";

    case "cancelled":
    case "rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ============================================================
// PAYMENT COLOR
// ============================================================

export const getPaymentStatusColor = (status?: PaymentStatus): string => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700";

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "failed":
      return "bg-red-100 text-red-700";

    case "refunded":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ============================================================
// CALCULATE BOOKING DAYS
// ============================================================

export const calculateBookingDays = (
  startDate: string,
  endDate: string,
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const difference = end.getTime() - start.getTime();

  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return Math.max(days, 1);
};

// ============================================================
// CALCULATE BOOKING TOTAL
// ============================================================

export const calculateBookingTotal = (
  pricePerDay: number,
  startDate: string,
  endDate: string,
): number => {
  const days = calculateBookingDays(startDate, endDate);

  return pricePerDay * days;
};
