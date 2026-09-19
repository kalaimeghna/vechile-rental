
import React, { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  Car,
  CheckCircle,
  Clock,
  Eye,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

import axiosInstance from "../api/axios";

interface Vehicle {
  _id: string;
  name?: string;
  brand?: string;
  model?: string;
  type?: string;
  image?: string;
  images?: string[];
}

interface User {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
}

type BookingStatus =
  | "pending"
  | "confirmed"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

interface Booking {
  _id: string;
  vehicle?: Vehicle | null;
  user?: User | null;
  startDate?: string;
  endDate?: string;
  pickupDate?: string;
  returnDate?: string;
  totalAmount?: number;
  amount?: number;
  status?: BookingStatus | string;
  createdAt?: string;
}

interface ApiResponse {
  bookings?: Booking[];
  data?: Booking[] | { bookings?: Booking[] };
  message?: string;
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as AxiosErrorResponse;

  return (
    err.response?.data?.message ||
    err.message ||
    fallback
  );
}

function getBookingsFromResponse(data: unknown): Booking[] {
  if (!data || typeof data !== "object") {
    return [];
  }

  const response = data as ApiResponse;

  if (Array.isArray(response.bookings)) {
    return response.bookings;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    Array.isArray(response.data.bookings)
  ) {
    return response.data.bookings;
  }

  return [];
}

function formatDate(date?: string): string {
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
}

function formatCurrency(amount?: number): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getVehicleName(vehicle?: Vehicle | null): string {
  if (!vehicle) {
    return "Vehicle";
  }

  if (vehicle.name) {
    return vehicle.name;
  }

  const vehicleName = [vehicle.brand, vehicle.model]
    .filter(Boolean)
    .join(" ");

  return vehicleName || vehicle.type || "Vehicle";
}

function getBookingStatus(status?: string): BookingStatus {
  const normalizedStatus = status?.toLowerCase();

  if (
    normalizedStatus === "confirmed" ||
    normalizedStatus === "approved" ||
    normalizedStatus === "rejected" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "completed"
  ) {
    return normalizedStatus;
  }

  return "pending";
}

function getStatusLabel(status?: string): string {
  const normalizedStatus = getBookingStatus(status);

  switch (normalizedStatus) {
    case "confirmed":
      return "Confirmed";

    case "approved":
      return "Approved";

    case "rejected":
      return "Rejected";

    case "cancelled":
      return "Cancelled";

    case "completed":
      return "Completed";

    default:
      return "Pending";
  }
}

function getStatusClasses(status?: string): string {
  const normalizedStatus = getBookingStatus(status);

  switch (normalizedStatus) {
    case "confirmed":
    case "approved":
      return "bg-green-100 text-green-700";

    case "rejected":
    case "cancelled":
      return "bg-red-100 text-red-700";

    case "completed":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

function getBookingImage(vehicle?: Vehicle | null): string {
  if (!vehicle) {
    return "";
  }

  if (vehicle.image) {
    return vehicle.image;
  }

  if (vehicle.images && vehicle.images.length > 0) {
    return vehicle.images[0];
  }

  return "";
}

const OwnerBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const fetchBookings = useCallback(async (): Promise<Booking[]> => {
    const response = await axiosInstance.get<unknown>("/bookings/owner");

    return getBookingsFromResponse(response.data);
  }, []);

  /*
   * Initial loading.
   *
   * The API call happens asynchronously. The state updates are inside
   * the promise callbacks, avoiding the React set-state-in-effect warning.
   */
  useEffect(() => {
    let active = true;

    fetchBookings()
      .then((data) => {
        if (!active) {
          return;
        }

        setBookings(data);
        setError("");
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        console.error("Fetch owner bookings error:", error);

        setError(
          getErrorMessage(
            error,
            "Failed to load your bookings.",
          ),
        );

        setBookings([]);
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchBookings]);

  const handleRefresh = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchBookings();

      setBookings(data);
    } catch (error: unknown) {
      console.error("Refresh bookings error:", error);

      setError(
        getErrorMessage(
          error,
          "Failed to refresh bookings.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const vehicleName = getVehicleName(booking.vehicle);

    const customerName = booking.user?.name || "";
    const customerEmail = booking.user?.email || "";

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      searchText === "" ||
      vehicleName.toLowerCase().includes(searchText) ||
      customerName.toLowerCase().includes(searchText) ||
      customerEmail.toLowerCase().includes(searchText);

    const bookingStatus = getBookingStatus(booking.status);

    const matchesStatus =
      statusFilter === "all" ||
      bookingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => getBookingStatus(booking.status) === "pending",
  ).length;

  const confirmedBookings = bookings.filter((booking) => {
    const status = getBookingStatus(booking.status);

    return status === "confirmed" || status === "approved";
  }).length;

  const completedBookings = bookings.filter(
    (booking) =>
      getBookingStatus(booking.status) === "completed",
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin text-blue-600" />

              <p className="text-gray-600">
                Loading your bookings...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Owner Bookings
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Manage bookings made for your vehicles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleRefresh()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-medium">
                Something went wrong
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Bookings
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {totalBookings}
                </p>
              </div>

              <div className="rounded-lg bg-blue-100 p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Pending
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {pendingBookings}
                </p>
              </div>

              <div className="rounded-lg bg-yellow-100 p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Confirmed
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {confirmedBookings}
                </p>
              </div>

              <div className="rounded-lg bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Completed
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {completedBookings}
                </p>
              </div>

              <div className="rounded-lg bg-purple-100 p-3">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by vehicle or customer..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="rejected">
                Rejected
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>

          </div>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">
            <Car className="mx-auto h-14 w-14 text-gray-300" />

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No bookings found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {search || statusFilter !== "all"
                ? "No bookings match your current search or filter."
                : "You don't have any bookings for your vehicles yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Vehicle
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Booking Dates
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.map((booking) => {
                      const vehicleImage = getBookingImage(
                        booking.vehicle,
                      );

                      const startDate =
                        booking.startDate ||
                        booking.pickupDate;

                      const endDate =
                        booking.endDate ||
                        booking.returnDate;

                      const amount =
                        typeof booking.totalAmount ===
                        "number"
                          ? booking.totalAmount
                          : booking.amount;

                      return (
                        <tr
                          key={booking._id}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {vehicleImage ? (
                                <img
                                  src={vehicleImage}
                                  alt={getVehicleName(
                                    booking.vehicle,
                                  )}
                                  className="h-12 w-16 rounded-lg object-cover"
                                  onError={(
                                    event,
                                  ) => {
                                    event.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100">
                                  <Car className="h-6 w-6 text-gray-400" />
                                </div>
                              )}

                              <div>
                                <p className="font-medium text-gray-900">
                                  {getVehicleName(
                                    booking.vehicle,
                                  )}
                                </p>

                                {booking.vehicle?.type && (
                                  <p className="text-xs text-gray-500">
                                    {booking.vehicle.type}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">
                              {booking.user?.name ||
                                "Customer"}
                            </p>

                            <p className="text-sm text-gray-500">
                              {booking.user?.email ||
                                "No email"}
                            </p>

                            {booking.user?.phone && (
                              <p className="text-xs text-gray-500">
                                {booking.user.phone}
                              </p>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">
                              {formatDate(startDate)}
                            </p>

                            <p className="text-xs text-gray-500">
                              to {formatDate(endDate)}
                            </p>
                          </td>

                          <td className="px-6 py-4 font-medium text-gray-900">
                            {formatCurrency(amount)}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                                booking.status,
                              )}`}
                            >
                              {getStatusLabel(
                                booking.status,
                              )}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedBooking(
                                  booking,
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="grid gap-4 lg:hidden">
              {filteredBookings.map((booking) => {
                const vehicleImage = getBookingImage(
                  booking.vehicle,
                );

                const startDate =
                  booking.startDate ||
                  booking.pickupDate;

                const endDate =
                  booking.endDate ||
                  booking.returnDate;

                const amount =
                  typeof booking.totalAmount ===
                  "number"
                    ? booking.totalAmount
                    : booking.amount;

                return (
                  <div
                    key={booking._id}
                    className="rounded-xl bg-white p-4 shadow-sm"
                  >
                    <div className="flex gap-4">
                      {vehicleImage ? (
                        <img
                          src={vehicleImage}
                          alt={getVehicleName(
                            booking.vehicle,
                          )}
                          className="h-20 w-24 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <Car className="h-8 w-8 text-gray-400" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {getVehicleName(
                                booking.vehicle,
                              )}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              {booking.user?.name ||
                                "Customer"}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                              booking.status,
                            )}`}
                          >
                            {getStatusLabel(
                              booking.status,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          Pickup
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {formatDate(startDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Return
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {formatDate(endDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Amount
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {formatCurrency(amount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Customer
                        </p>

                        <p className="mt-1 truncate text-sm font-medium text-gray-900">
                          {booking.user?.email ||
                            "No email"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedBooking(booking)
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      View Booking
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Booking Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  ID: {selectedBooking._id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-5 p-5">

              {/* Vehicle */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Vehicle
                </h3>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  {getBookingImage(
                    selectedBooking.vehicle,
                  ) ? (
                    <img
                      src={getBookingImage(
                        selectedBooking.vehicle,
                      )}
                      alt={getVehicleName(
                        selectedBooking.vehicle,
                      )}
                      className="h-16 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-20 items-center justify-center rounded-lg bg-gray-200">
                      <Car className="h-7 w-7 text-gray-400" />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900">
                      {getVehicleName(
                        selectedBooking.vehicle,
                      )}
                    </p>

                    {selectedBooking.vehicle?.type && (
                      <p className="text-sm text-gray-500">
                        {selectedBooking.vehicle.type}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </h3>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">
                    {selectedBooking.user?.name ||
                      "Customer"}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {selectedBooking.user?.email ||
                      "No email available"}
                  </p>

                  {selectedBooking.user?.phone && (
                    <p className="mt-1 text-sm text-gray-600">
                      {selectedBooking.user.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Booking */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Booking Information
                </h3>

                <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">

                  <div>
                    <p className="text-xs text-gray-500">
                      Pickup Date
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {formatDate(
                        selectedBooking.startDate ||
                          selectedBooking.pickupDate,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Return Date
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {formatDate(
                        selectedBooking.endDate ||
                          selectedBooking.returnDate,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Amount
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {formatCurrency(
                        typeof selectedBooking.totalAmount ===
                          "number"
                          ? selectedBooking.totalAmount
                          : selectedBooking.amount,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Status
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        selectedBooking.status,
                      )}`}
                    >
                      {getStatusLabel(
                        selectedBooking.status,
                      )}
                    </span>
                  </div>

                </div>
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
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

export default OwnerBookings;

