import React, { useState } from "react";
import {
  ArrowLeft,
  Car,
  CalendarDays,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Clock3,
  XCircle,
  Download,
  X,
  ShieldCheck,
  Fuel,
  Users,
  Settings2,
  IndianRupee,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

/* ============================================================
   TYPES
============================================================ */

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

type PaymentStatus = "paid" | "pending" | "failed";

interface Booking {
  _id: string;
  bookingId: string;

  vehicle: {
    _id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    image?: string;
    category: string;
    seats: number;
    fuelType: string;
    transmission: string;
  };

  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };

  owner: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
  };

  pickupDate: string;
  returnDate: string;

  pickupLocation: string;
  returnLocation: string;

  rentalDays: number;

  pricePerDay: number;
  rentalAmount: number;
  serviceFee: number;
  insuranceFee: number;
  discount: number;
  totalAmount: number;

  paymentMethod: string;
  paymentStatus: PaymentStatus;

  bookingStatus: BookingStatus;

  createdAt: string;
}

/* ============================================================
   SAMPLE BOOKING
   Replace with API data later.
============================================================ */

const sampleBooking: Booking = {
  _id: "booking-001",
  bookingId: "VR-2026-1001",

  vehicle: {
    _id: "vehicle-001",
    name: "Toyota Fortuner",
    brand: "Toyota",
    model: "Fortuner",
    year: 2025,

    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",

    category: "SUV",
    seats: 7,
    fuelType: "Diesel",
    transmission: "Automatic",
  },

  customer: {
    _id: "user-001",
    name: "Kalaivani K",
    email: "kalai@example.com",
    phone: "9876543210",
  },

  owner: {
    _id: "owner-001",
    name: "Chennai Car Rentals",
    email: "owner@example.com",
    phone: "9123456789",
  },

  pickupDate: "2026-08-20T10:00:00",
  returnDate: "2026-08-23T10:00:00",

  pickupLocation: "Chennai Airport",
  returnLocation: "Chennai Airport",

  rentalDays: 3,

  pricePerDay: 3500,
  rentalAmount: 10500,
  serviceFee: 500,
  insuranceFee: 300,
  discount: 300,
  totalAmount: 11000,

  paymentMethod: "UPI",
  paymentStatus: "paid",

  bookingStatus: "confirmed",

  createdAt: "2026-08-18T08:00:00",
};

/* ============================================================
   HELPERS
============================================================ */

const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ============================================================
   BOOKING STATUS
============================================================ */

const BookingStatus = ({ status }: { status: BookingStatus }) => {
  const config = {
    confirmed: {
      label: "Confirmed",
      className: "bg-green-50 text-green-700 border-green-200",
      icon: <CheckCircle2 size={16} />,
    },

    pending: {
      label: "Pending",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: <Clock3 size={16} />,
    },

    completed: {
      label: "Completed",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <CheckCircle2 size={16} />,
    },

    cancelled: {
      label: "Cancelled",
      className: "bg-red-50 text-red-700 border-red-200",
      icon: <XCircle size={16} />,
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${current.className}`}
    >
      {current.icon}
      {current.label}
    </span>
  );
};

/* ============================================================
   PAYMENT STATUS
============================================================ */

const PaymentStatus = ({ status }: { status: PaymentStatus }) => {
  const config = {
    paid: {
      label: "Paid",
      className: "bg-green-50 text-green-700",
    },

    pending: {
      label: "Payment Pending",
      className: "bg-yellow-50 text-yellow-700",
    },

    failed: {
      label: "Payment Failed",
      className: "bg-red-50 text-red-700",
    },
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${config[status].className}`}
    >
      {config[status].label}
    </span>
  );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function BookingDetails() {
  const navigate = useNavigate();

  const { bookingId } = useParams<{
    bookingId: string;
  }>();

  const [booking, setBooking] = useState<Booking | null>(sampleBooking);

  const [isCancelling, setIsCancelling] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);

  /* ==========================================================
     CANCEL BOOKING
  ========================================================== */

  const handleCancelBooking = async () => {
    if (!booking) return;

    try {
      setIsCancelling(true);

      /*
          Backend API:

          await axiosInstance.put(
            `/bookings/${booking._id}/cancel`
          );
        */

      await new Promise((resolve) => setTimeout(resolve, 700));

      setBooking({
        ...booking,
        bookingStatus: "cancelled",
      });

      setShowCancelModal(false);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  /* ==========================================================
     DOWNLOAD RECEIPT
  ========================================================== */

  const handleDownloadReceipt = () => {
    if (!booking) return;

    /*
        Backend:

        window.open(
          `/api/bookings/${booking._id}/receipt`,
          "_blank"
        );
      */

    alert(`Receipt for ${booking.bookingId} will be generated.`);
  };

  /* ==========================================================
     LOADING / NOT FOUND
  ========================================================== */

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Car size={30} />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-800">
            Booking not found
          </h2>

          <button
            type="button"
            onClick={() => navigate("/my-bookings")}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* ==================================================
            BACK BUTTON
        =================================================== */}

        <button
          type="button"
          onClick={() => navigate("/my-bookings")}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to My Bookings
        </button>

        {/* ==================================================
            HEADER
        =================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                  Booking Details
                </h1>

                <BookingStatus status={booking.bookingStatus} />
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Booking ID:{" "}
                <span className="font-bold text-slate-700">
                  {booking.bookingId}
                </span>
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Created on {formatDate(booking.createdAt)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <Download size={17} />
                Receipt
              </button>

              {booking.bookingStatus === "confirmed" && (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  <XCircle size={17} />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================
            MAIN GRID
        =================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* =================================================
              LEFT
          ================================================== */}

          <div className="space-y-6">
            {/* ==============================================
                VEHICLE
            =============================================== */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-64 bg-slate-100 sm:h-80">
                {booking.vehicle.image ? (
                  <img
                    src={booking.vehicle.image}
                    alt={booking.vehicle.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <Car size={70} />
                  </div>
                )}

                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-black text-slate-700 shadow">
                    {booking.vehicle.category}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      {booking.vehicle.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {booking.vehicle.brand} {booking.vehicle.model} •{" "}
                      {booking.vehicle.year}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Rental Price
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {formatPrice(booking.pricePerDay)}
                    </p>

                    <p className="text-xs text-slate-400">per day</p>
                  </div>
                </div>

                {/* Vehicle Specifications */}

                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Users size={19} className="text-blue-500" />

                    <span className="text-xs font-bold text-slate-600">
                      {booking.vehicle.seats} Seats
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2 border-x border-slate-100 text-center">
                    <Fuel size={19} className="text-blue-500" />

                    <span className="text-xs font-bold text-slate-600">
                      {booking.vehicle.fuelType}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2 text-center">
                    <Settings2 size={19} className="text-blue-500" />

                    <span className="text-xs font-bold text-slate-600">
                      {booking.vehicle.transmission}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ==============================================
                PICKUP / RETURN
            =============================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-black text-slate-900">
                Rental Schedule
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {/* Pickup */}

                <div className="rounded-xl bg-blue-50 p-5">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-blue-600">
                    <CalendarDays size={16} />
                    Pickup
                  </div>

                  <p className="mt-4 text-lg font-black text-slate-900">
                    {formatDate(booking.pickupDate)}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {formatTime(booking.pickupDate)}
                  </p>

                  <div className="mt-4 flex items-start gap-2">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <p className="text-sm font-semibold text-slate-600">
                      {booking.pickupLocation}
                    </p>
                  </div>
                </div>

                {/* Return */}

                <div className="rounded-xl bg-purple-50 p-5">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-purple-600">
                    <CalendarDays size={16} />
                    Return
                  </div>

                  <p className="mt-4 text-lg font-black text-slate-900">
                    {formatDate(booking.returnDate)}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {formatTime(booking.returnDate)}
                  </p>

                  <div className="mt-4 flex items-start gap-2">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-purple-600"
                    />

                    <p className="text-sm font-semibold text-slate-600">
                      {booking.returnLocation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rental Duration */}

              <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                <span className="text-sm font-semibold text-slate-500">
                  Rental Duration
                </span>

                <span className="font-black text-slate-800">
                  {booking.rentalDays}{" "}
                  {booking.rentalDays === 1 ? "Day" : "Days"}
                </span>
              </div>
            </section>

            {/* ==============================================
                CUSTOMER
            =============================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-black text-slate-900">
                Customer Information
              </h2>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <User size={25} />
                </div>

                <div className="flex-1">
                  <h3 className="font-black text-slate-800">
                    {booking.customer.name}
                  </h3>

                  <div className="mt-2 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:gap-5">
                    <span className="flex items-center gap-2">
                      <Mail size={15} />
                      {booking.customer.email}
                    </span>

                    <span className="flex items-center gap-2">
                      <Phone size={15} />
                      {booking.customer.phone}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT
          ================================================== */}

          <div className="space-y-6">
            {/* ==============================================
                PRICE SUMMARY
            =============================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <IndianRupee size={19} />
                </div>

                <h2 className="text-lg font-black text-slate-900">
                  Price Summary
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    {formatPrice(booking.pricePerDay)} × {booking.rentalDays}{" "}
                    days
                  </span>

                  <span className="font-bold text-slate-700">
                    {formatPrice(booking.rentalAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Service Fee</span>

                  <span className="font-bold text-slate-700">
                    {formatPrice(booking.serviceFee)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Insurance</span>

                  <span className="font-bold text-slate-700">
                    {formatPrice(booking.insuranceFee)}
                  </span>
                </div>

                {booking.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>

                    <span className="font-bold text-green-600">
                      - {formatPrice(booking.discount)}
                    </span>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-end justify-between">
                    <span className="font-bold text-slate-600">Total</span>

                    <span className="text-2xl font-black text-slate-900">
                      {formatPrice(booking.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ==============================================
                PAYMENT
            =============================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <CreditCard size={19} />
                </div>

                <h2 className="text-lg font-black text-slate-900">Payment</h2>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Payment Method</span>

                  <span className="text-sm font-bold text-slate-700">
                    {booking.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>

                  <PaymentStatus status={booking.paymentStatus} />
                </div>
              </div>
            </section>

            {/* ==============================================
                OWNER
            =============================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-black text-slate-900">
                Vehicle Owner
              </h2>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <User size={19} />
                </div>

                <div>
                  <p className="font-black text-slate-800">
                    {booking.owner.name}
                  </p>

                  {booking.owner.phone && (
                    <a
                      href={`tel:${booking.owner.phone}`}
                      className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-blue-600"
                    >
                      <Phone size={13} />
                      {booking.owner.phone}
                    </a>
                  )}
                </div>
              </div>

              {booking.owner.email && (
                <a
                  href={`mailto:${booking.owner.email}`}
                  className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
                >
                  <Mail size={15} />
                  {booking.owner.email}
                </a>
              )}
            </section>

            {/* ==============================================
                SECURITY
            =============================================== */}

            <div className="rounded-2xl bg-slate-900 p-5 text-white">
              <div className="flex items-start gap-3">
                <ShieldCheck size={22} className="mt-0.5 text-green-400" />

                <div>
                  <h3 className="font-black">Safe & Secure Booking</h3>

                  <p className="mt-1 text-xs leading-5 text-slate-300">
                    Your booking information and payment details are securely
                    protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          CANCEL MODAL
      ======================================================= */}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500">
                <XCircle size={23} />
              </div>

              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              Cancel Booking?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to cancel booking{" "}
              <span className="font-bold text-slate-700">
                {booking.bookingId}
              </span>
              ? This action may be subject to the cancellation policy.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
