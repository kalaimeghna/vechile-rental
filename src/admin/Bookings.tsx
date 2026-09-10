import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Car,
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import axiosInstance from "../api/axios";

// ======================================================
// TYPES
// ======================================================

interface User {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface Vehicle {
  _id?: string;
  name?: string;
  vehicleName?: string;
  brand?: string;
  model?: string;
  registrationNumber?: string;
  image?: string;
  pricePerDay?: number;
}

interface Booking {
  _id: string;

  user?: User | null;
  customer?: User | null;

  vehicle?: Vehicle | null;

  startDate?: string;
  endDate?: string;

  pickupDate?: string;
  returnDate?: string;

  bookingDate?: string;
  createdAt?: string;

  totalAmount?: number;
  amount?: number;
  totalPrice?: number;

  status?: string;
  paymentStatus?: string;

  pickupLocation?: string;
  dropoffLocation?: string;

  notes?: string;
}

// ======================================================
// STATUS OPTIONS
// ======================================================

const STATUS_OPTIONS = [
  "all",
  "pending",
  "confirmed",
  "approved",
  "active",
  "completed",
  "cancelled",
  "rejected",
];

// ======================================================
// HELPERS
// ======================================================

const formatDate = (date?: string) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (amount?: number) => {
  const value = Number(amount || 0);

  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
};

const getStatus = (status?: string) => {
  return String(status || "pending").toLowerCase();
};

const getStatusClasses = (status?: string) => {
  switch (getStatus(status)) {
    case "confirmed":
    case "approved":
      return "bg-green-100 text-green-700";

    case "active":
      return "bg-blue-100 text-blue-700";

    case "completed":
      return "bg-purple-100 text-purple-700";

    case "cancelled":
    case "rejected":
      return "bg-red-100 text-red-700";

    case "pending":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const getStatusIcon = (status?: string) => {
  switch (getStatus(status)) {
    case "confirmed":
    case "approved":
    case "completed":
      return <CheckCircle size={14} />;

    case "cancelled":
    case "rejected":
      return <XCircle size={14} />;

    case "active":
      return <Car size={14} />;

    default:
      return <Clock size={14} />;
  }
};

// ======================================================
// COMPONENT
// ======================================================

const Bookings: React.FC = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [showDetails, setShowDetails] = useState(false);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // ====================================================
  // FETCH BOOKINGS
  // ====================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/bookings");

      const data = response.data;

      let bookingData: Booking[] = [];

      if (Array.isArray(data)) {
        bookingData = data;
      } else if (Array.isArray(data?.bookings)) {
        bookingData = data.bookings;
      } else if (Array.isArray(data?.data)) {
        bookingData = data.data;
      }

      setBookings(bookingData);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);

      setError("Failed to load bookings. Please try again.");

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    let cancelled = false;

    const loadBookings = async () => {
      try {
        const response = await axiosInstance.get("/bookings");

        if (cancelled) return;

        const data = response.data;

        let bookingData: Booking[] = [];

        if (Array.isArray(data)) {
          bookingData = data;
        } else if (Array.isArray(data?.bookings)) {
          bookingData = data.bookings;
        } else if (Array.isArray(data?.data)) {
          bookingData = data.data;
        }

        setBookings(bookingData);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to fetch bookings:", err);

        setError("Failed to load bookings. Please try again.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadBookings();

    return () => {
      cancelled = true;
    };
  }, []);

  // ====================================================
  // FILTER
  // ====================================================

  const filteredBookings = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const customer = booking.user || booking.customer;

      const customerName = customer?.name || "";

      const customerEmail = customer?.email || "";

      const vehicle = booking.vehicle;

      const vehicleName =
        vehicle?.vehicleName ||
        vehicle?.name ||
        `${vehicle?.brand || ""} ${vehicle?.model || ""}`.trim();

      const registration = vehicle?.registrationNumber || "";

      const bookingId = booking._id || "";

      const matchesSearch =
        !searchValue ||
        customerName.toLowerCase().includes(searchValue) ||
        customerEmail.toLowerCase().includes(searchValue) ||
        vehicleName.toLowerCase().includes(searchValue) ||
        registration.toLowerCase().includes(searchValue) ||
        bookingId.toLowerCase().includes(searchValue);

      const bookingStatus = getStatus(booking.status);

      const matchesStatus =
        statusFilter === "all" || bookingStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  // ====================================================
  // PAGINATION
  // ====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / itemsPerPage),
  );

  /*
   * IMPORTANT:
   * We do NOT use useEffect + setCurrentPage here.
   *
   * This avoids:
   *
   * "Calling setState synchronously within
   * an effect can trigger cascading renders"
   */

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedBookings = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;

    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, safeCurrentPage]);

  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);

    setCurrentPage(1);
  };

  // ====================================================
  // STATUS FILTER
  // ====================================================

  const handleStatusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);

    setCurrentPage(1);
  };

  // ====================================================
  // UPDATE STATUS
  // ====================================================

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    if (!bookingId) return;

    try {
      setUpdatingId(bookingId);
      setError("");

      await axiosInstance.put(`/bookings/${bookingId}/status`, {
        status,
      });

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status,
              }
            : booking,
        ),
      );

      if (selectedBooking?._id === bookingId) {
        setSelectedBooking((previous) =>
          previous
            ? {
                ...previous,
                status,
              }
            : null,
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);

      setError("Failed to update booking status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ====================================================
  // DELETE BOOKING
  // ====================================================

  const handleDelete = async (bookingId: string) => {
    if (!bookingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(bookingId);
      setError("");

      await axiosInstance.delete(`/bookings/${bookingId}`);

      setBookings((previous) =>
        previous.filter((booking) => booking._id !== bookingId),
      );

      if (selectedBooking?._id === bookingId) {
        setSelectedBooking(null);
        setShowDetails(false);
      }
    } catch (err) {
      console.error("Failed to delete booking:", err);

      setError("Failed to delete booking.");
    } finally {
      setDeletingId(null);
    }
  };

  // ====================================================
  // VIEW DETAILS
  // ====================================================

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  // ====================================================
  // CLOSE DETAILS
  // ====================================================

  const closeDetails = () => {
    setSelectedBooking(null);
    setShowDetails(false);
  };

  // ====================================================
  // STATISTICS
  // ====================================================

  const statistics = useMemo(() => {
    const total = bookings.length;

    const pending = bookings.filter(
      (booking) => getStatus(booking.status) === "pending",
    ).length;

    const confirmed = bookings.filter((booking) =>
      ["confirmed", "approved"].includes(getStatus(booking.status)),
    ).length;

    const active = bookings.filter(
      (booking) => getStatus(booking.status) === "active",
    ).length;

    const completed = bookings.filter(
      (booking) => getStatus(booking.status) === "completed",
    ).length;

    const cancelled = bookings.filter((booking) =>
      ["cancelled", "rejected"].includes(getStatus(booking.status)),
    ).length;

    return {
      total,
      pending,
      confirmed,
      active,
      completed,
      cancelled,
    };
  }, [bookings]);

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage all vehicle rental bookings
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchBookings()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Refresh
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-4 text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* ================================================= */}
      {/* STATISTICS */}
      {/* ================================================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* TOTAL */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {statistics.total}
              </p>
            </div>

            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <Calendar size={22} />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {statistics.pending}
              </p>
            </div>

            <div className="rounded-lg bg-yellow-100 p-3 text-yellow-600">
              <Clock size={22} />
            </div>
          </div>
        </div>

        {/* CONFIRMED */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {statistics.confirmed}
              </p>
            </div>

            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>

        {/* ACTIVE */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {statistics.active}
              </p>
            </div>

            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <Car size={22} />
            </div>
          </div>
        </div>

        {/* COMPLETED */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {statistics.completed}
              </p>
            </div>

            <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>

        {/* CANCELLED */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cancelled</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {statistics.cancelled}
              </p>
            </div>

            <div className="rounded-lg bg-red-100 p-3 text-red-600">
              <XCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* SEARCH AND FILTER */}
      {/* ================================================= */}

      <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search customer, vehicle, email or booking ID..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === "all"
                  ? "All Statuses"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="text-center">
              <Loader2
                size={36}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm text-gray-500">Loading bookings...</p>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center">
            <Calendar size={42} className="text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              No bookings found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {search || statusFilter !== "all"
                ? "Try changing your search or filter."
                : "No bookings are available."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4">Booking</th>

                    <th className="px-5 py-4">Customer</th>

                    <th className="px-5 py-4">Vehicle</th>

                    <th className="px-5 py-4">Rental Period</th>

                    <th className="px-5 py-4">Amount</th>

                    <th className="px-5 py-4">Status</th>

                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedBookings.map((booking) => {
                    const customer = booking.user || booking.customer;

                    const vehicle = booking.vehicle;

                    const vehicleName =
                      vehicle?.vehicleName ||
                      vehicle?.name ||
                      `${vehicle?.brand || ""} ${
                        vehicle?.model || ""
                      }`.trim() ||
                      "Vehicle";

                    const pickupDate = booking.startDate || booking.pickupDate;

                    const returnDate = booking.endDate || booking.returnDate;

                    const amount =
                      booking.totalAmount ??
                      booking.totalPrice ??
                      booking.amount ??
                      0;

                    const status = getStatus(booking.status);

                    return (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        {/* BOOKING */}

                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            #{booking._id.slice(-8)}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {formatDate(
                              booking.bookingDate || booking.createdAt,
                            )}
                          </p>
                        </td>

                        {/* CUSTOMER */}

                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900">
                            {customer?.name || "Unknown User"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {customer?.email || "-"}
                          </p>
                        </td>

                        {/* VEHICLE */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {vehicle?.image ? (
                              <img
                                src={vehicle.image}
                                alt={vehicleName}
                                className="h-10 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-12 items-center justify-center rounded-lg bg-gray-100">
                                <Car size={20} className="text-gray-400" />
                              </div>
                            )}

                            <div>
                              <p className="font-medium text-gray-900">
                                {vehicleName}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                {vehicle?.registrationNumber || "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* DATES */}

                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-800">
                            {formatDate(pickupDate)}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            to {formatDate(returnDate)}
                          </p>
                        </td>

                        {/* AMOUNT */}

                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(amount)}
                          </p>

                          {booking.paymentStatus && (
                            <p className="mt-1 text-xs capitalize text-gray-500">
                              {booking.paymentStatus}
                            </p>
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <select
                            value={status}
                            disabled={updatingId === booking._id}
                            onChange={(event) =>
                              void handleUpdateStatus(
                                booking._id,
                                event.target.value,
                              )
                            }
                            className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold capitalize outline-none ${getStatusClasses(
                              status,
                            )}`}
                          >
                            {STATUS_OPTIONS.filter(
                              (item) => item !== "all",
                            ).map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              title="View Details"
                              onClick={() => handleViewDetails(booking)}
                              className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              type="button"
                              title="Delete"
                              disabled={deletingId === booking._id}
                              onClick={() => void handleDelete(booking._id)}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === booking._id ? (
                                <Loader2 size={17} className="animate-spin" />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ================================================= */}
            {/* PAGINATION */}
            {/* ================================================= */}

            <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                {filteredBookings.length === 0
                  ? 0
                  : (safeCurrentPage - 1) * itemsPerPage + 1}{" "}
                to{" "}
                {Math.min(
                  safeCurrentPage * itemsPerPage,
                  filteredBookings.length,
                )}{" "}
                of {filteredBookings.length} bookings
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white">
                  {safeCurrentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ================================================= */}
      {/* DETAILS MODAL */}
      {/* ================================================= */}

      {showDetails && selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeDetails}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Booking Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  #{selectedBooking._id}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <XCircle size={22} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="space-y-6 p-6">
              {/* CUSTOMER */}

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </h3>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">
                    {(selectedBooking.user || selectedBooking.customer)?.name ||
                      "Unknown User"}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {(selectedBooking.user || selectedBooking.customer)
                      ?.email || "-"}
                  </p>

                  {(selectedBooking.user || selectedBooking.customer)
                    ?.phone && (
                    <p className="mt-1 text-sm text-gray-600">
                      Phone:{" "}
                      {
                        (selectedBooking.user || selectedBooking.customer)
                          ?.phone
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* VEHICLE */}

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Vehicle
                </h3>

                <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                  {selectedBooking.vehicle?.image ? (
                    <img
                      src={selectedBooking.vehicle.image}
                      alt="Vehicle"
                      className="h-16 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-20 items-center justify-center rounded-lg bg-gray-200">
                      <Car size={28} className="text-gray-400" />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedBooking.vehicle?.vehicleName ||
                        selectedBooking.vehicle?.name ||
                        `${selectedBooking.vehicle?.brand || ""} ${
                          selectedBooking.vehicle?.model || ""
                        }`.trim() ||
                        "Vehicle"}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Registration:{" "}
                      {selectedBooking.vehicle?.registrationNumber || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* BOOKING INFO */}

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Booking Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Pickup Date</p>

                    <p className="mt-1 font-medium text-gray-900">
                      {formatDate(
                        selectedBooking.startDate || selectedBooking.pickupDate,
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Return Date</p>

                    <p className="mt-1 font-medium text-gray-900">
                      {formatDate(
                        selectedBooking.endDate || selectedBooking.returnDate,
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Total Amount</p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {formatPrice(
                        selectedBooking.totalAmount ??
                          selectedBooking.totalPrice ??
                          selectedBooking.amount,
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-gray-500">Status</p>

                    <div
                      className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                        selectedBooking.status,
                      )}`}
                    >
                      {getStatusIcon(selectedBooking.status)}

                      {getStatus(selectedBooking.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* LOCATION */}

              {(selectedBooking.pickupLocation ||
                selectedBooking.dropoffLocation) && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Locations
                  </h3>

                  <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                    {selectedBooking.pickupLocation && (
                      <div>
                        <p className="text-xs text-gray-500">Pickup Location</p>

                        <p className="mt-1 text-sm text-gray-900">
                          {selectedBooking.pickupLocation}
                        </p>
                      </div>
                    )}

                    {selectedBooking.dropoffLocation && (
                      <div>
                        <p className="text-xs text-gray-500">
                          Drop-off Location
                        </p>

                        <p className="mt-1 text-sm text-gray-900">
                          {selectedBooking.dropoffLocation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* NOTES */}

              {selectedBooking.notes && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Notes
                  </h3>

                  <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                    {selectedBooking.notes}
                  </div>
                </div>
              )}

              {/* UPDATE STATUS */}

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Update Status
                </h3>

                <div className="flex flex-wrap gap-2">
                  {[
                    "pending",
                    "confirmed",
                    "active",
                    "completed",
                    "cancelled",
                    "rejected",
                  ].map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={updatingId === selectedBooking._id}
                      onClick={() =>
                        void handleUpdateStatus(selectedBooking._id, status)
                      }
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium capitalize ${getStatusClasses(
                        status,
                      )} disabled:opacity-50`}
                    >
                      {updatingId === selectedBooking._id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        getStatusIcon(status)
                      )}

                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end border-t px-6 py-4">
              <button
                type="button"
                onClick={closeDetails}
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
