import React, { useMemo, useState, useEffect } from "react";
import {
  CalendarDays,
  Car,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  RefreshCw,
} from "lucide-react";
// Import your configured axios instance (e.g., from src/api/axios.js)
// import axiosInstance from "../api/axios";

/* ============================================================
   TYPES / INTERFACES
============================================================ */

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";
type PaymentStatus = "paid" | "pending" | "failed";

interface Vehicle {
  _id: string;
  name: string;
  brand: string;
  model: string;
  image?: string;
  location: string;
}

interface Owner {
  _id: string;
  name: string;
  phone?: string;
}

interface Booking {
  _id: string;
  bookingId: string;
  vehicle: Vehicle;
  owner?: Owner;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

/* ============================================================
   BADGES & HELPERS
============================================================ */

const BookingStatusBadge = ({ status }: { status: BookingStatus }) => {
  const config = {
    confirmed: {
      label: "Confirmed",
      className: "bg-green-50 text-green-700 border-green-200",
      icon: <CheckCircle2 size={14} />,
    },
    pending: {
      label: "Pending",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: <Clock size={14} />,
    },
    completed: {
      label: "Completed",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <CheckCircle2 size={14} />,
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-50 text-red-700 border-red-200",
      icon: <XCircle size={14} />,
    },
  };
  const current = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${current.className}`}
    >
      {current.icon} {current.label}
    </span>
  );
};

const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const config = {
    paid: { label: "Paid", className: "bg-green-50 text-green-700" },
    pending: {
      label: "Payment Pending",
      className: "bg-yellow-50 text-yellow-700",
    },
    failed: { label: "Payment Failed", className: "bg-red-50 text-red-700" },
  };
  const current = config[status];
  return (
    <span
      className={`rounded-md px-2.5 py-1 text-xs font-bold ${current.className}`}
    >
      {current.label}
    </span>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | BookingStatus>(
    "all",
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Standalone fetch function for manual refresh button actions
  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Replace with your actual backend endpoint route
      // const response = await axiosInstance.get("/bookings/my");
      // setBookings(response.data.bookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Resolved linter warning by handling initialization inline inside the effect
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        // const response = await axiosInstance.get("/bookings/my");
        // if (isMounted) setBookings(response.data.bookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesFilter =
        activeFilter === "all" || booking.bookingStatus === activeFilter;
      const searchValue = search.toLowerCase().trim();
      const matchesSearch =
        !searchValue ||
        booking.vehicle?.name?.toLowerCase().includes(searchValue) ||
        booking.bookingId?.toLowerCase().includes(searchValue) ||
        booking.pickupLocation?.toLowerCase().includes(searchValue);
      return matchesFilter && matchesSearch;
    });
  }, [bookings, activeFilter, search]);

  const counts = useMemo(
    () => ({
      all: bookings.length,
      confirmed: bookings.filter((i) => i.bookingStatus === "confirmed").length,
      pending: bookings.filter((i) => i.bookingStatus === "pending").length,
      completed: bookings.filter((i) => i.bookingStatus === "completed").length,
      cancelled: bookings.filter((i) => i.bookingStatus === "cancelled").length,
    }),
    [bookings],
  );

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      // await axiosInstance.put(`/bookings/${bookingId}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, bookingStatus: "cancelled" } : b,
        ),
      );
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">My Bookings</h1>
            <p className="mt-1 text-sm text-slate-500">
              View and manage all your vehicle rentals.
            </p>
          </div>
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Search and Filters Toolbar */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3.5 top-3.5 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by vehicle name, location, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {(
              ["all", "confirmed", "pending", "completed", "cancelled"] as const
            ).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold capitalize transition ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {filter} ({counts[filter]})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List Section */}
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <Car size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              No bookings found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              You don't have any bookings matching the current filter or search
              criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        booking.vehicle?.image ||
                        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300"
                      }
                      alt={booking.vehicle?.name}
                      className="h-24 w-32 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400">
                          ID: {booking.bookingId}
                        </span>
                        <BookingStatusBadge status={booking.bookingStatus} />
                      </div>
                      <h3 className="mt-1 text-lg font-black text-slate-900">
                        {booking.vehicle?.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {booking.vehicle?.brand} {booking.vehicle?.model}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={14} />{" "}
                          {formatDate(booking.pickupDate)} -{" "}
                          {formatDate(booking.returnDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Total Amount
                      </p>
                      <p className="text-xl font-black text-slate-900">
                        {formatPrice(booking.totalAmount)}
                      </p>
                      <div className="mt-1">
                        <PaymentStatusBadge status={booking.paymentStatus} />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye size={14} /> Details
                      </button>
                      {booking.bookingStatus === "pending" && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Booking Details
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-900">
                  {selectedBooking.bookingId}
                </h2>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ×
              </button>
            </div>
            <div className="space-y-6 p-6">
              <div className="flex gap-4">
                <img
                  src={
                    selectedBooking.vehicle?.image ||
                    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300"
                  }
                  alt={selectedBooking.vehicle?.name}
                  className="h-24 w-32 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedBooking.vehicle?.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {selectedBooking.vehicle?.brand}{" "}
                    {selectedBooking.vehicle?.model}
                  </p>
                  <p className="mt-2 text-sm font-bold text-blue-600">
                    {formatPrice(selectedBooking.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-sm">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Pickup Date
                  </p>
                  <p className="font-bold text-slate-800">
                    {formatDate(selectedBooking.pickupDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Return Date
                  </p>
                  <p className="font-bold text-slate-800">
                    {formatDate(selectedBooking.returnDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
