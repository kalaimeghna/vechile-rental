```tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  CalendarDays,
  IndianRupee,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  MapPin,
  Users,
  Eye,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "../../api/axios";

// =========================================================
// TYPES
// =========================================================

interface Vehicle {
  _id: string;
  name?: string;
  brand?: string;
  model?: string;
  year?: number | string;
  category?: string;
  pricePerDay?: number | string;
  location?: string;
  images?: string[];
  isAvailable?: boolean;
  available?: boolean;
  status?: string;
}

interface UserData {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface Booking {
  _id: string;
  bookingId?: string;

  user?: UserData | null;
  renter?: UserData | null;
  customer?: UserData | null;

  vehicle?: Vehicle | null;

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

  pickupLocation?: string;
  returnLocation?: string;
  location?: string;

  createdAt?: string;
}

// =========================================================
// COMPONENT
// =========================================================

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  // =========================================================
  // FETCH DASHBOARD DATA
  // =========================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [vehiclesResponse, bookingsResponse] =
        await Promise.all([
          axiosInstance.get("/vehicles/my"),
          axiosInstance.get("/bookings/owner"),
        ]);

      console.log(
        "Vehicles:",
        vehiclesResponse.data
      );

      console.log(
        "Bookings:",
        bookingsResponse.data
      );

      const vehiclesData =
        vehiclesResponse.data?.vehicles ||
        vehiclesResponse.data?.data ||
        vehiclesResponse.data ||
        [];

      const bookingsData =
        bookingsResponse.data?.bookings ||
        bookingsResponse.data?.data ||
        bookingsResponse.data ||
        [];

      setVehicles(
        Array.isArray(vehiclesData)
          ? vehiclesData
          : []
      );

      setBookings(
        Array.isArray(bookingsData)
          ? bookingsData
          : []
      );
    } catch (err: any) {
      console.error(
        "Dashboard fetch error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getBookingStatus = (
    booking: Booking
  ): string => {
    return (
      booking.status || "pending"
    ).toLowerCase();
  };

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

  const getVehicleName = (
    vehicle?: Vehicle | null
  ): string => {
    if (!vehicle) {
      return "Vehicle";
    }

    if (vehicle.name) {
      return vehicle.name;
    }

    const name =
      `${vehicle.brand || ""} ${
        vehicle.model || ""
      }`.trim();

    return name || "Vehicle";
  };

  const getVehicleImage = (
    vehicle?: Vehicle | null
  ): string => {
    if (
      vehicle?.images &&
      Array.isArray(vehicle.images) &&
      vehicle.images.length > 0
    ) {
      return vehicle.images[0];
    }

    return "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80";
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

  const getBookingAmount = (
    booking: Booking
  ): number => {
    const amount = Number(
      booking.totalAmount ??
        booking.totalPrice ??
        booking.price ??
        0
    );

    return Number.isNaN(amount)
      ? 0
      : amount;
  };

  const formatPrice = (
    amount: number
  ): string => {
    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  };

  const formatDate = (
    date?: string
  ): string => {
    if (!date) {
      return "N/A";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "N/A";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const isVehicleAvailable = (
    vehicle: Vehicle
  ): boolean => {
    if (
      typeof vehicle.isAvailable ===
      "boolean"
    ) {
      return vehicle.isAvailable;
    }

    if (
      typeof vehicle.available ===
      "boolean"
    ) {
      return vehicle.available;
    }

    if (vehicle.status) {
      return (
        vehicle.status.toLowerCase() ===
        "available"
      );
    }

    return true;
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const stats = useMemo(() => {
    const totalVehicles =
      vehicles.length;

    const availableVehicles =
      vehicles.filter(
        isVehicleAvailable
      ).length;

    const unavailableVehicles =
      totalVehicles -
      availableVehicles;

    const totalBookings =
      bookings.length;

    const pendingBookings =
      bookings.filter(
        (booking) =>
          getBookingStatus(
            booking
          ) === "pending"
      ).length;

    const confirmedBookings =
      bookings.filter((booking) => {
        const status =
          getBookingStatus(
            booking
          );

        return (
          status === "confirmed" ||
          status === "approved"
        );
      }).length;

    const completedBookings =
      bookings.filter(
        (booking) =>
          getBookingStatus(
            booking
          ) === "completed"
      ).length;

    const cancelledBookings =
      bookings.filter((booking) => {
        const status =
          getBookingStatus(
            booking
          );

        return (
          status === "cancelled" ||
          status === "canceled" ||
          status === "rejected"
        );
      }).length;

    const totalRevenue =
      bookings
        .filter((booking) => {
          const status =
            getBookingStatus(
              booking
            );

          return (
            status === "confirmed" ||
            status === "approved" ||
            status === "completed" ||
            status === "active"
          );
        })
        .reduce(
          (total, booking) =>
            total +
            getBookingAmount(
              booking
            ),
          0
        );

    const completedRevenue =
      bookings
        .filter(
          (booking) =>
            getBookingStatus(
              booking
            ) === "completed"
        )
        .reduce(
          (total, booking) =>
            total +
            getBookingAmount(
              booking
            ),
          0
        );

    return {
      totalVehicles,
      availableVehicles,
      unavailableVehicles,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      completedRevenue,
    };
  }, [vehicles, bookings]);

  // =========================================================
  // RECENT BOOKINGS
  // =========================================================

  const recentBookings =
    useMemo(() => {
      return [...bookings]
        .sort((a, b) => {
          const dateA = new Date(
            a.createdAt || 0
          ).getTime();

          const dateB = new Date(
            b.createdAt || 0
          ).getTime();

          return dateB - dateA;
        })
        .slice(0, 5);
    }, [bookings]);

  // =========================================================
  // TOP VEHICLES
  // =========================================================

  const vehicleBookingCounts =
    useMemo(() => {
      const counts: Record<
        string,
        number
      > = {};

      bookings.forEach(
        (booking) => {
          const vehicleId =
            booking.vehicle?._id;

          if (!vehicleId) {
            return;
          }

          counts[vehicleId] =
            (counts[vehicleId] || 0) +
            1;
        }
      );

      return counts;
    }, [bookings]);

  const popularVehicles =
    useMemo(() => {
      return [...vehicles]
        .sort(
          (a, b) =>
            (vehicleBookingCounts[
              b._id
            ] || 0) -
            (vehicleBookingCounts[
              a._id
            ] || 0)
        )
        .slice(0, 4);
    }, [
      vehicles,
      vehicleBookingCounts,
    ]);

  // =========================================================
  // STATUS CLASS
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

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "active":
        return "bg-purple-100 text-purple-700";

      case "rejected":
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-700";

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

      case "completed":
        return "Completed";

      case "active":
        return "Active";

      case "rejected":
        return "Rejected";

      case "cancelled":
      case "canceled":
        return "Cancelled";

      default:
        return (
          status.charAt(0).toUpperCase() +
          status.slice(1)
        );
    }
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
            Loading owner dashboard...
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

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">
              Owner Dashboard
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome Back 👋
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your vehicles, bookings and
              rental earnings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/owner/vehicles/create"
                )
              }
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              <Plus className="w-5 h-5" />
              Add Vehicle
            </button>
          </div>
        </div>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">

            <AlertCircle className="w-5 h-5 mt-0.5" />

            <div>
              <p className="font-medium">
                Dashboard Error
              </p>

              <p className="text-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            STAT CARDS
        ==================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          {/* Vehicles */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Vehicles
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalVehicles}
                </p>

                <p className="text-sm text-green-600 mt-2">
                  {stats.availableVehicles} available
                </p>
              </div>

              <div className="p-3 bg-blue-100 rounded-xl">
                <Car className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Bookings
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalBookings}
                </p>

                <p className="text-sm text-yellow-600 mt-2">
                  {stats.pendingBookings} pending
                </p>
              </div>

              <div className="p-3 bg-yellow-100 rounded-xl">
                <CalendarDays className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Revenue
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatPrice(
                    stats.totalRevenue
                  )}
                </p>

                <p className="text-sm text-green-600 mt-2">
                  Rental earnings
                </p>
              </div>

              <div className="p-3 bg-green-100 rounded-xl">
                <IndianRupee className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Completed
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.completedBookings}
                </p>

                <p className="text-sm text-blue-600 mt-2">
                  {formatPrice(
                    stats.completedRevenue
                  )}{" "}
                  earned
                </p>
              </div>

              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckCircle2 className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            MAIN GRID
        ==================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          {/* =================================================
              RECENT BOOKINGS
          ================================================== */}

          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm">

            <div className="p-5 border-b border-gray-100 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Bookings
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Latest activity on your vehicles
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/owner/bookings"
                  )
                }
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">

              {recentBookings.length ===
              0 ? (
                <div className="py-12 text-center">

                  <CalendarDays className="w-10 h-10 mx-auto text-gray-300" />

                  <p className="text-gray-500 mt-3">
                    No bookings yet
                  </p>
                </div>
              ) : (
                recentBookings.map(
                  (booking) => {
                    const customer =
                      getCustomer(
                        booking
                      );

                    const status =
                      getBookingStatus(
                        booking
                      );

                    return (
                      <div
                        key={
                          booking._id
                        }
                        className="p-5 hover:bg-gray-50 transition"
                      >

                        <div className="flex flex-col sm:flex-row gap-4">

                          {/* Image */}
                          <img
                            src={getVehicleImage(
                              booking.vehicle
                            )}
                            alt={getVehicleName(
                              booking.vehicle
                            )}
                            className="w-full sm:w-24 h-20 object-cover rounded-lg"
                          />

                          {/* Content */}
                          <div className="flex-1 min-w-0">

                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {getVehicleName(
                                    booking.vehicle
                                  )}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                  {customer?.name ||
                                    "Customer"}
                                </p>
                              </div>

                              <span
                                className={`self-start px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                  status
                                )}`}
                              >
                                {getStatusLabel(
                                  status
                                )}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">

                              <span className="flex items-center gap-1.5">
                                <CalendarDays className="w-4 h-4" />
                                {formatDate(
                                  getStartDate(
                                    booking
                                  )
                                )}
                                {" - "}
                                {formatDate(
                                  getEndDate(
                                    booking
                                  )
                                )}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <IndianRupee className="w-4 h-4" />
                                {formatPrice(
                                  getBookingAmount(
                                    booking
                                  )
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>
          </div>

          {/* =================================================
              BOOKING SUMMARY
          ================================================== */}

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Booking Summary
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Current booking status
              </p>
            </div>

            <div className="p-5 space-y-5">

              {/* Pending */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />

                    <span className="text-sm text-gray-600">
                      Pending
                    </span>
                  </div>

                  <span className="font-bold text-gray-900">
                    {stats.pendingBookings}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{
                      width:
                        stats.totalBookings >
                        0
                          ? `${
                              (stats.pendingBookings /
                                stats.totalBookings) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* Confirmed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />

                    <span className="text-sm text-gray-600">
                      Confirmed
                    </span>
                  </div>

                  <span className="font-bold text-gray-900">
                    {stats.confirmedBookings}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width:
                        stats.totalBookings >
                        0
                          ? `${
                              (stats.confirmedBookings /
                                stats.totalBookings) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* Completed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />

                    <span className="text-sm text-gray-600">
                      Completed
                    </span>
                  </div>

                  <span className="font-bold text-gray-900">
                    {stats.completedBookings}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width:
                        stats.totalBookings >
                        0
                          ? `${
                              (stats.completedBookings /
                                stats.totalBookings) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* Cancelled */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />

                    <span className="text-sm text-gray-600">
                      Cancelled / Rejected
                    </span>
                  </div>

                  <span className="font-bold text-gray-900">
                    {stats.cancelledBookings}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width:
                        stats.totalBookings >
                        0
                          ? `${
                              (stats.cancelledBookings /
                                stats.totalBookings) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/owner/bookings"
                  )
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
              >
                Manage Bookings
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================
            POPULAR VEHICLES
        ==================================================== */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

          <div className="p-5 border-b border-gray-100 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                My Vehicles
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your vehicles and their booking activity
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/owner/vehicles"
                )
              }
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {popularVehicles.length ===
          0 ? (
            <div className="p-12 text-center">

              <Car className="w-12 h-12 mx-auto text-gray-300" />

              <h3 className="font-semibold text-gray-900 mt-4">
                No vehicles added
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Add a vehicle to start receiving bookings.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/owner/vehicles/create"
                  )
                }
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                Add Vehicle
              </button>
            </div>
          ) : (
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

              {popularVehicles.map(
                (vehicle) => {
                  const bookingCount =
                    vehicleBookingCounts[
                      vehicle._id
                    ] || 0;

                  const available =
                    isVehicleAvailable(
                      vehicle
                    );

                  return (
                    <div
                      key={
                        vehicle._id
                      }
                      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
                    >

                      <div className="relative h-40">

                        <img
                          src={getVehicleImage(
                            vehicle
                          )}
                          alt={getVehicleName(
                            vehicle
                          )}
                          className="w-full h-full object-cover"
                        />

                        <span
                          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {available
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>

                      <div className="p-4">

                        <h3 className="font-bold text-gray-900 truncate">
                          {getVehicleName(
                            vehicle
                          )}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                          <MapPin className="w-4 h-4" />

                          <span className="truncate">
                            {vehicle.location ||
                              "Location not set"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-4">

                          <div>
                            <p className="text-xs text-gray-400">
                              Price / day
                            </p>

                            <p className="font-bold text-blue-600">
                              {formatPrice(
                                Number(
                                  vehicle.pricePerDay ||
                                    0
                                )
                              )}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-400">
                              Bookings
                            </p>

                            <p className="font-bold text-gray-900">
                              {bookingCount}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/owner/vehicles/edit/${vehicle._id}`
                            )
                          }
                          className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Manage Vehicle
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* ===================================================
            QUICK ACTIONS
        ==================================================== */}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/owner/vehicles/create"
              )
            }
            className="flex items-center gap-4 p-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-left"
          >
            <div className="p-3 bg-white/20 rounded-lg">
              <Plus className="w-6 h-6" />
            </div>

            <div>
              <p className="font-semibold">
                Add Vehicle
              </p>

              <p className="text-sm text-blue-100 mt-1">
                List a new vehicle for rent
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/owner/vehicles"
              )
            }
            className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition text-left"
          >
            <div className="p-3 bg-blue-100 rounded-lg">
              <Car className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                Manage Vehicles
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Edit and manage your vehicles
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/owner/bookings"
              )
            }
            className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition text-left"
          >
            <div className="p-3 bg-green-100 rounded-lg">
              <CalendarDays className="w-6 h-6 text-green-600" />
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                Manage Bookings
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Review and approve bookings
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
```
