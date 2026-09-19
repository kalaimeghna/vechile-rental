import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowLeft,
  Download,
  AlertCircle,
} from "lucide-react";

/* ============================================================
   TYPESCRIPT INTERFACES & TYPES
============================================================ */

export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "failed";

export interface Booking {
  id: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  date: string;
  time: string;
  amount: number;
}

/* ============================================================
   BOOKING STATUS BADGE COMPONENT
============================================================ */

const BookingStatusBadge = ({ status }: { status: BookingStatus }) => {
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
   PAYMENT STATUS BADGE COMPONENT
============================================================ */

const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const config = {
    paid: {
      label: "Paid",
      className: "bg-green-50 text-green-700 border border-green-200",
    },
    pending: {
      label: "Payment Pending",
      className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    },
    failed: {
      label: "Payment Failed",
      className: "bg-red-50 text-red-700 border border-red-200",
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold ${current.className}`}
    >
      {current.label}
    </span>
  );
};

/* ============================================================
   MAIN BOOKING DETAILS COMPONENT
============================================================ */

export default function BookingDetails({
  bookingId = "BK-98421",
}: {
  bookingId?: string;
}) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulated API fetch effect
  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        // Simulated network delay & response
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockData: Booking = {
          id: bookingId,
          bookingStatus: "confirmed",
          paymentStatus: "paid",
          clientName: "Jane Doe",
          clientEmail: "jane.doe@example.com",
          serviceName: "Full-Stack Development Consultation",
          date: "October 24, 2026",
          time: "10:00 AM - 11:30 AM",
          amount: 150.0,
        };

        setBooking(mockData);
      } catch (err) {
        console.error("Error fetching booking details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500 font-medium">
          <Clock3 className="animate-spin" size={20} />
          Loading booking details...
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <AlertCircle className="mx-auto mb-2" size={32} />
        <h2 className="text-lg font-bold">Booking Not Found</h2>
        <p className="text-sm">
          We couldn't locate the requested booking information.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      {/* Header / Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Bookings
        </button>
        <button
          onClick={() => alert("Downloading receipt...")}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Download size={16} />
          Download Receipt
        </button>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Top Banner */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Booking Reference
            </p>
            <h1 className="text-xl font-bold text-gray-900">{booking.id}</h1>
          </div>
          <div className="flex items-center gap-2">
            <BookingStatusBadge status={booking.bookingStatus} />
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Service Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Service Details
            </h3>
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
              <p className="text-base font-bold text-gray-900">
                {booking.serviceName}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {booking.date} at {booking.time}
              </p>
            </div>
          </div>

          {/* Client Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Client Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-sm font-semibold text-gray-900">
                  {booking.clientName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-sm font-semibold text-gray-900">
                  {booking.clientEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Total Amount
              </span>
              <span className="text-lg font-extrabold text-gray-900">
                ${booking.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
