```tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Car,
  Check,
  Clock,
  Eye,
  Loader2,
  MapPin,
  Search,
  User,
  X,
  XCircle,
  RefreshCw,
  Phone,
  Mail,
  IndianRupee,
} from "lucide-react";
import axiosInstance from "../../api/axios";

// =========================================================
// TYPES
// =========================================================

interface UserData {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
}

interface VehicleData {
  _id?: string;
  name?: string;
  brand?: string;
  model?: string;
  images?: string[];
  category?: string;
}

interface Booking {
  _id: string;

  bookingId?: string;

  user?: UserData | null;
  renter?: UserData | null;
  customer?: UserData | null;

  vehicle?: VehicleData | null;

  startDate?: string;
  endDate?: string;

  pickupDate?: string;
  returnDate?: string;

  bookingStartDate?: string;
  bookingEndDate?: string;

  totalAmount?: number | string;

  totalPrice?: number | string;

  price?: number | string;

  status?: string;

  paymentStatus?: string;

  paymentMethod?: string;

  pickupLocation?: string;

  returnLocation?: string;

  location?: string;

  createdAt?: string;

  updatedAt?: string;
}

// =========================================================
// COMPONENT
// =========================================================

const OwnerBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState<string>("");

  const [statusFilter, setStatusFilter] =
    useState<string>("All");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [showDetails, setShowDetails] =
    useState<boolean>(false);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  // =========================================================
  // FETCH OWNER BOOKINGS
  // =========================================================

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  const fetchOwnerBookings = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Expected backend:
       * GET /api/bookings/owner
       */

      const response = await axiosInstance.get(
        "/bookings/owner"
      );

      console.log("Owner bookings:", response.data);

      const data =
        response.data?.bookings ||
        response.data?.data ||
        response.data ||
        [];

      setBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(
        "Fetch owner bookings error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load bookings."
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getCustomer = (
    booking: Booking
  ): UserData | null => {
    return (
      booking.user ||
      booking.renter ||
      booking.customer ||
      null
    );
  };

  const getVehicle = (
    booking: Booking
  ): VehicleData | null => {
    return booking.vehicle || null;
  };

  const getVehicleName = (
    booking: Booking
  ): string => {
    const vehicle = getVehicle(booking);

    if (!vehicle) {
      return "Vehicle";
    }

    if (vehicle.name) {
      return vehicle.name;
    }

    const fullName =
      `${vehicle.brand || ""} ${
        vehicle.model || ""
      }`.trim();

    return fullName || "Vehicle";
  };

  const getVehicleImage = (
    booking: Booking
  ): string => {
    const vehicle = getVehicle(booking);

    if (
      vehicle?.images &&
      Array.isArray(vehicle.images) &&
      vehicle.images.length > 0
    ) {
      return vehicle.images[0];
    }

    return "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80";
  };

  const getStartDate = (
    booking: Booking
  ): string => {
    return (
      booking.startDate ||
      booking.pickupDate ||
      booking.bookingStartDate ||
      ""
    );
  };

  const getEndDate = (
    booking: Booking
  ): string => {
    return (
      booking.endDate ||
      booking.returnDate ||
      booking.bookingEndDate ||
      ""
    );
  };

  const getAmount = (
    booking: Booking
  ): number => {
    const amount = Number(
      booking.totalAmount ??
        booking.totalPrice ??
        booking.price ??
        0
    );

    return Number.isNaN(amount) ? 0 : amount;
  };

  const getBookingStatus = (
    booking: Booking
  ): string => {
    return (
      booking.status ||
      "pending"
    ).toLowerCase();
  };

  const formatPrice = (
    amount: number
  ): string => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (
    date?: string
  ): string => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (
    date?: string
  ): string => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusClass = (
    status: string
  ): string => {
    switch (status) {
      case "confirmed":
      case "approved":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "rejected":
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "active":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (
    status: string
  ): string => {
    switch (status) {
      case "confirmed":
        return "Confirmed";

      case "approved":
        return "Approved";

      case "pending":
        return "Pending";

      case "rejected":
        return "Rejected";

      case "cancelled":
      case "canceled":
        return "Cancelled";

      case "completed":
        return "Completed";

      case "active":
        return "Active";

      default:
        return (
          status.charAt(0).toUpperCase() +
          status.slice(1)
        );
    }
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredBookings = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const customer = getCustomer(booking);

      const vehicleName =
        getVehicleName(booking).toLowerCase();

      const customerName =
        (customer?.name || "").toLowerCase();

      const customerEmail =
        (customer?.email || "").toLowerCase();

      const bookingId =
        (
          booking.bookingId ||
          booking._id ||
          ""
        ).toLowerCase();

      const location =
        (
          booking.pickupLocation ||
          booking.location ||
          ""
        ).toLowerCase();

      const status =
        getBookingStatus(booking);

      const matchesSearch =
        !searchValue ||
        vehicleName.includes(searchValue) ||
        customerName.includes(searchValue) ||
        customerEmail.includes(searchValue) ||
        bookingId.includes(searchValue) ||
        location.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        status ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    bookings,
    search,
    statusFilter,
  ]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalBookings =
    bookings.length;

  const pendingBookings =
    bookings.filter(
      (booking) =>
        getBookingStatus(booking) ===
        "pending"
    ).length;

  const confirmedBookings =
    bookings.filter((booking) => {
      const status =
        getBookingStatus(booking);

      return (
        status === "confirmed" ||
        status === "approved"
      );
    }).length;

  const completedBookings =
    bookings.filter(
      (booking) =>
        getBookingStatus(booking) ===
        "completed"
    ).length;

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const updateBookingStatus = async (
    booking: Booking,
    status: string
  ) => {
    if (!booking._id) {
      return;
    }

    try {
      setActionLoading(
        `${booking._id}-${status}`
      );

      /*
       * Expected backend:
       * PUT /api/bookings/:bookingId/status
       *
       * Body:
       * { status: "confirmed" }
       */

      await axiosInstance.put(
        `/bookings/${booking._id}/status`,
        {
          status,
        }
      );

      setBookings((previous) =>
        previous.map((item) =>
          item._id === booking._id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      if (
        selectedBooking &&
        selectedBooking._id ===
          booking._id
      ) {
        setSelectedBooking({
          ...selectedBooking,
          status,
        });
      }
    } catch (err: any) {
      console.error(
        "Update booking status error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update booking status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // OPEN DETAILS
  // =========================================================

  const openDetails = (
    booking: Booking
  ) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedBooking(null);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />

          <p className="text-gray-600">
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Owner Bookings
            </h1>

            <p className="text-gray-500 mt-1">
              Manage bookings made for your vehicles
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOwnerBookings}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">

            <XCircle className="w-5 h-5 mt-0.5 shrink-0" />

            <div className="flex-1">
              <p className="font-medium">
                Error
              </p>

              <p className="text-sm mt-1">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* =====================================================
            STATS
        ====================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          {/* Total */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center">

              <div>
                <p className="text-sm text-gray-500">
                  Total Bookings
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalBookings}
                </p>
              </div>

              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarDays className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center">

              <div>
                <p className="text-sm text-gray-500">
                  Pending
                </p>

                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {pendingBookings}
                </p>
              </div>

              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Confirmed */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center">

              <div>
                <p className="text-sm text-gray-500">
                  Confirmed
                </p>

                <p className="text-2xl font-bold text-green-600 mt-1">
                  {confirmedBookings}
                </p>
              </div>

              <div className="p-3 bg-green-100 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center">

              <div>
                <p className="text-sm text-gray-500">
                  Completed
                </p>

                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {completedBookings}
                </p>
              </div>

              <div className="p-3 bg-purple-100 rounded-lg">
                <Car className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SEARCH / FILTER
        ====================================================== */}

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6">

          <div className="flex flex-col md:flex-row gap-4">

            {/* Search */}
            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search customer, vehicle or booking ID..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="md:w-52 px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>
        </div>

        {/* =====================================================
            COUNT
        ====================================================== */}

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredBookings.length}
            </span>{" "}
            bookings
          </p>
        </div>

        {/* =====================================================
            EMPTY
        ====================================================== */}

        {filteredBookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">

            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <CalendarDays className="w-10 h-10 text-gray-400" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              No bookings found
            </h2>

            <p className="text-gray-500 mt-2">
              {bookings.length === 0
                ? "You don't have any bookings for your vehicles yet."
                : "Try changing your search or status filter."}
            </p>

            {bookings.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter(
                    "All"
                  );
                }}
                className="mt-5 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* ===================================================
             BOOKING LIST
          ==================================================== */

          <div className="space-y-4">

            {filteredBookings.map(
              (booking) => {
                const customer =
                  getCustomer(
                    booking
                  );

                const vehicle =
                  getVehicle(
                    booking
                  );

                const status =
                  getBookingStatus(
                    booking
                  );

                const startDate =
                  getStartDate(
                    booking
                  );

                const endDate =
                  getEndDate(
                    booking
                  );

                return (
                  <div
                    key={booking._id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
                  >

                    <div className="p-5">

                      <div className="flex flex-col xl:flex-row gap-5">

                        {/* Vehicle Image */}
                        <div className="w-full xl:w-48 h-40 xl:h-32 shrink-0">

                          <img
                            src={getVehicleImage(
                              booking
                            )}
                            alt={getVehicleName(
                              booking
                            )}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Main Info */}
                        <div className="flex-1 min-w-0">

                          {/* Top */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                            <div>
                              <div className="flex items-center gap-2">

                                <h2 className="text-lg font-bold text-gray-900">
                                  {getVehicleName(
                                    booking
                                  )}
                                </h2>

                                {vehicle?.category && (
                                  <span className="hidden sm:inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    {
                                      vehicle.category
                                    }
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-500 mt-1">
                                Booking ID:{" "}
                                <span className="font-medium text-gray-700">
                                  {booking.bookingId ||
                                    booking._id}
                                </span>
                              </p>
                            </div>

                            <span
                              className={`self-start px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(
                                status
                              )}`}
                            >
                              {getStatusLabel(
                                status
                              )}
                            </span>
                          </div>

                          {/* Customer */}
                          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4 text-blue-500" />

                              <span>
                                {customer?.name ||
                                  "Customer"}
                              </span>
                            </div>

                            {customer?.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4 text-blue-500" />

                                <span className="truncate max-w-xs">
                                  {
                                    customer.email
                                  }
                                </span>
                              </div>
                            )}

                            {customer?.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-blue-500" />

                                <span>
                                  {
                                    customer.phone
                                  }
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Dates */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">

                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-blue-500" />

                              <div>
                                <p className="text-xs text-gray-400">
                                  Pickup
                                </p>

                                <p className="text-sm font-medium text-gray-700">
                                  {formatDate(
                                    startDate
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-red-500" />

                              <div>
                                <p className="text-xs text-gray-400">
                                  Return
                                </p>

                                <p className="text-sm font-medium text-gray-700">
                                  {formatDate(
                                    endDate
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-green-500" />

                              <div>
                                <p className="text-xs text-gray-400">
                                  Location
                                </p>

                                <p className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                                  {booking.pickupLocation ||
                                    booking.location ||
                                    "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <IndianRupee className="w-4 h-4 text-green-600" />

                              <div>
                                <p className="text-xs text-gray-400">
                                  Total
                                </p>

                                <p className="text-sm font-bold text-gray-900">
                                  {formatPrice(
                                    getAmount(
                                      booking
                                    )
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 mt-5 pt-4">

                        {/* Pending actions */}
                        {status ===
                          "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                updateBookingStatus(
                                  booking,
                                  "confirmed"
                                )
                              }
                              disabled={
                                actionLoading !==
                                  null
                              }
                              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition text-sm font-medium"
                            >
                              {actionLoading ===
                              `${booking._id}-confirmed` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}

                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateBookingStatus(
                                  booking,
                                  "rejected"
                                )
                              }
                              disabled={
                                actionLoading !==
                                  null
                              }
                              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition text-sm font-medium"
                            >
                              {actionLoading ===
                              `${booking._id}-rejected` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}

                              Reject
                            </button>
                          </>
                        )}

                        {/* Active */}
                        {status ===
                          "confirmed" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateBookingStatus(
                                booking,
                                "active"
                              )
                            }
                            disabled={
                              actionLoading !==
                                null
                            }
                            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition text-sm font-medium"
                          >
                            {actionLoading ===
                            `${booking._id}-active` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Car className="w-4 h-4" />
                            )}

                            Mark Active
                          </button>
                        )}

                        {/* Complete */}
                        {status ===
                          "active" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateBookingStatus(
                                booking,
                                "completed"
                              )
                            }
                            disabled={
                              actionLoading !==
                                null
                            }
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition text-sm font-medium"
                          >
                            {actionLoading ===
                            `${booking._id}-completed` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}

                            Complete
                          </button>
                        )}

                        {/* View */}
                        <button
                          type="button"
                          onClick={() =>
                            openDetails(
                              booking
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* =======================================================
          DETAILS MODAL
      ======================================================== */}

      {showDetails &&
        selectedBooking && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-6">

            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Booking Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {selectedBooking.bookingId ||
                      selectedBooking._id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeDetails}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">

                {/* Vehicle */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">

                  <img
                    src={getVehicleImage(
                      selectedBooking
                    )}
                    alt={getVehicleName(
                      selectedBooking
                    )}
                    className="w-full sm:w-44 h-32 object-cover rounded-lg"
                  />

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {getVehicleName(
                        selectedBooking
                      )}
                    </h3>

                    {getVehicle(
                      selectedBooking
                    )?.category && (
                      <p className="text-gray-500 mt-1">
                        {
                          getVehicle(
                            selectedBooking
                          )?.category
                        }
                      </p>
                    )}

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                        getBookingStatus(
                          selectedBooking
                        )
                      )}`}
                    >
                      {getStatusLabel(
                        getBookingStatus(
                          selectedBooking
                        )
                      )}
                    </span>
                  </div>
                </div>

                {/* Customer */}
                <div className="border border-gray-200 rounded-xl p-5 mb-5">

                  <h3 className="font-semibold text-gray-900 mb-4">
                    Customer Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="flex gap-3">
                      <User className="w-5 h-5 text-blue-500" />

                      <div>
                        <p className="text-xs text-gray-400">
                          Name
                        </p>

                        <p className="font-medium text-gray-800">
                          {getCustomer(
                            selectedBooking
                          )?.name ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Mail className="w-5 h-5 text-blue-500" />

                      <div>
                        <p className="text-xs text-gray-400">
                          Email
                        </p>

                        <p className="font-medium text-gray-800 break-all">
                          {getCustomer(
                            selectedBooking
                          )?.email ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Phone className="w-5 h-5 text-blue-500" />

                      <div>
                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        <p className="font-medium text-gray-800">
                          {getCustomer(
                            selectedBooking
                          )?.phone ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="border border-gray-200 rounded-xl p-5 mb-5">

                  <h3 className="font-semibold text-gray-900 mb-4">
                    Booking Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div>
                      <p className="text-xs text-gray-400">
                        Pickup Date
                      </p>

                      <p className="font-medium text-gray-800 mt-1">
                        {formatDate(
                          getStartDate(
                            selectedBooking
                          )
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Return Date
                      </p>

                      <p className="font-medium text-gray-800 mt-1">
                        {formatDate(
                          getEndDate(
                            selectedBooking
                          )
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Pickup Location
                      </p>

                      <p className="font-medium text-gray-800 mt-1">
                        {selectedBooking.pickupLocation ||
                          selectedBooking.location ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Return Location
                      </p>

                      <p className="font-medium text-gray-800 mt-1">
                        {selectedBooking.returnLocation ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Payment Status
                      </p>

                      <p className="font-medium text-gray-800 mt-1">
                        {selectedBooking.paymentStatus ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Payment Method
                      </p>

                      <p className="font-medium text-gray-800 mt-1">
                        {selectedBooking.paymentMethod ||
                          "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Total Amount
                      </p>

                      <p className="font-bold text-blue-600 text-lg mt-1">
                        {formatPrice(
                          getAmount(
                            selectedBooking
                          )
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Created At
                      </p>

                      <p className="font-medium text-gray-800 mt-1">
                        {formatDateTime(
                          selectedBooking.createdAt
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {getBookingStatus(
                  selectedBooking
                ) === "pending" && (
                  <div className="flex flex-col sm:flex-row gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        updateBookingStatus(
                          selectedBooking,
                          "confirmed"
                        )
                      }
                      disabled={
                        actionLoading !==
                        null
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                    >
                      {actionLoading ===
                      `${selectedBooking._id}-confirmed` ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}

                      Approve Booking
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateBookingStatus(
                          selectedBooking,
                          "rejected"
                        )
                      }
                      disabled={
                        actionLoading !==
                        null
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                    >
                      {actionLoading ===
                      `${selectedBooking._id}-rejected` ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <X className="w-5 h-5" />
                      )}

                      Reject Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default OwnerBookings;
```
