import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axios";
import {
  BarChart3,
  RefreshCw,
  Car,
  Users,
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";

// =======================================================
// TYPES
// =======================================================

interface Booking {
  _id: string;

  vehicle?: {
    _id?: string;
    name?: string;
    brand?: string;
    model?: string;
  } | null;

  user?: {
    _id?: string;
    name?: string;
    email?: string;
  } | null;

  customer?: {
    _id?: string;
    name?: string;
    email?: string;
  } | null;

  startDate?: string;
  endDate?: string;
  pickupDate?: string;
  returnDate?: string;

  totalAmount?: number;
  amount?: number;
  totalPrice?: number;

  status?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface ReportResponse {
  bookings?: Booking[];
  data?: Booking[];
  reports?: Booking[];
}

interface Payment {
  _id: string;
  amount?: number;
  status?: string;
  booking?: string | null;
  createdAt?: string;
}

interface PaymentsResponse {
  payments?: Payment[];
  data?: Payment[];
}

// =======================================================
// ERROR HELPER
// =======================================================

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data;

    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData
    ) {
      const message: unknown = (
        responseData as {
          message?: unknown;
        }
      ).message;

      if (typeof message === "string") {
        return message;
      }
    }

    if (typeof responseData === "string") {
      return responseData;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

// =======================================================
// HELPERS
// =======================================================

const getBookingAmount = (booking: Booking): number => {
  return booking.totalAmount ?? booking.totalPrice ?? booking.amount ?? 0;
};

const getBookingStatus = (booking: Booking): string => {
  return booking.status?.toLowerCase() || "pending";
};

const getBookingDate = (booking: Booking): string | undefined => {
  return booking.startDate || booking.pickupDate || booking.createdAt;
};

const formatCurrency = (value: number): string => {
  return `₹${value.toLocaleString("en-IN")}`;
};

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

// =======================================================
// COMPONENT
// =======================================================

const Reports: React.FC = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [payments, setPayments] = useState<Payment[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const [dateFilter, setDateFilter] = useState<string>("all");

  // =====================================================
  // LOAD REPORT DATA
  // =====================================================

  const loadReports = async (showRefresh = false): Promise<void> => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [bookingsResponse, paymentsResponse] = await Promise.all([
        axiosInstance.get<Booking[] | ReportResponse>("/bookings"),

        axiosInstance.get<Payment[] | PaymentsResponse>("/payments"),
      ]);

      // -------------------------------
      // BOOKINGS
      // -------------------------------

      const bookingData = bookingsResponse.data;

      let bookingList: Booking[] = [];

      if (Array.isArray(bookingData)) {
        bookingList = bookingData;
      } else if (Array.isArray(bookingData.bookings)) {
        bookingList = bookingData.bookings;
      } else if (Array.isArray(bookingData.reports)) {
        bookingList = bookingData.reports;
      } else if (Array.isArray(bookingData.data)) {
        bookingList = bookingData.data;
      }

      // -------------------------------
      // PAYMENTS
      // -------------------------------

      const paymentData = paymentsResponse.data;

      let paymentList: Payment[] = [];

      if (Array.isArray(paymentData)) {
        paymentList = paymentData;
      } else if (Array.isArray(paymentData.payments)) {
        paymentList = paymentData.payments;
      } else if (Array.isArray(paymentData.data)) {
        paymentList = paymentData.data;
      }

      setBookings(bookingList);
      setPayments(paymentList);
    } catch (error: unknown) {
      console.error("Failed to load reports:", error);

      setError(
        getErrorMessage(error, "Failed to load report data. Please try again."),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const fetchReportData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const [bookingsResponse, paymentsResponse] = await Promise.all([
          axiosInstance.get<Booking[] | ReportResponse>("/bookings"),

          axiosInstance.get<Payment[] | PaymentsResponse>("/payments"),
        ]);

        if (cancelled) {
          return;
        }

        // -----------------------------
        // BOOKINGS
        // -----------------------------

        const bookingData = bookingsResponse.data;

        let bookingList: Booking[] = [];

        if (Array.isArray(bookingData)) {
          bookingList = bookingData;
        } else if (Array.isArray(bookingData.bookings)) {
          bookingList = bookingData.bookings;
        } else if (Array.isArray(bookingData.reports)) {
          bookingList = bookingData.reports;
        } else if (Array.isArray(bookingData.data)) {
          bookingList = bookingData.data;
        }

        // -----------------------------
        // PAYMENTS
        // -----------------------------

        const paymentData = paymentsResponse.data;

        let paymentList: Payment[] = [];

        if (Array.isArray(paymentData)) {
          paymentList = paymentData;
        } else if (Array.isArray(paymentData.payments)) {
          paymentList = paymentData.payments;
        } else if (Array.isArray(paymentData.data)) {
          paymentList = paymentData.data;
        }

        setBookings(bookingList);
        setPayments(paymentList);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load reports:", error);

        setError(
          getErrorMessage(
            error,
            "Failed to load report data. Please try again.",
          ),
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchReportData();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // FILTER BOOKINGS BY DATE
  // =====================================================

  const filteredBookings = useMemo(() => {
    if (dateFilter === "all") {
      return bookings;
    }

    const now = new Date();

    let startDate: Date;

    if (dateFilter === "7") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (dateFilter === "30") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
    } else {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 12);
    }

    return bookings.filter((booking) => {
      const bookingDate = getBookingDate(booking);

      if (!bookingDate) {
        return false;
      }

      const date = new Date(bookingDate);

      return date >= startDate;
    });
  }, [bookings, dateFilter]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    const totalBookings = filteredBookings.length;

    const confirmedBookings = filteredBookings.filter(
      (booking) => getBookingStatus(booking) === "confirmed",
    ).length;

    const completedBookings = filteredBookings.filter(
      (booking) => getBookingStatus(booking) === "completed",
    ).length;

    const pendingBookings = filteredBookings.filter(
      (booking) => getBookingStatus(booking) === "pending",
    ).length;

    const cancelledBookings = filteredBookings.filter(
      (booking) => getBookingStatus(booking) === "cancelled",
    ).length;

    const totalRevenue = filteredBookings.reduce(
      (total, booking) => total + getBookingAmount(booking),
      0,
    );

    const averageBookingValue =
      totalBookings > 0 ? totalRevenue / totalBookings : 0;

    const uniqueUsers = new Set(
      filteredBookings
        .map((booking) => booking.user?._id || booking.customer?._id)
        .filter((id): id is string => Boolean(id)),
    ).size;

    const uniqueVehicles = new Set(
      filteredBookings
        .map((booking) => booking.vehicle?._id)
        .filter((id): id is string => Boolean(id)),
    ).size;

    return {
      totalBookings,
      confirmedBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      averageBookingValue,
      uniqueUsers,
      uniqueVehicles,
    };
  }, [filteredBookings]);

  // =====================================================
  // PAYMENT STATISTICS
  // =====================================================

  const paymentStatistics = useMemo(() => {
    const successfulPayments = payments.filter((payment) => {
      const status = payment.status?.toLowerCase();

      return (
        status === "completed" || status === "success" || status === "paid"
      );
    });

    const paymentRevenue = successfulPayments.reduce(
      (total, payment) => total + (payment.amount ?? 0),
      0,
    );

    return {
      count: successfulPayments.length,
      revenue: paymentRevenue,
    };
  }, [payments]);

  // =====================================================
  // MONTHLY REVENUE
  // =====================================================

  const monthlyRevenue = useMemo(() => {
    const monthlyData: Record<string, number> = {};

    filteredBookings.forEach((booking) => {
      const bookingDate = getBookingDate(booking);

      if (!bookingDate) {
        return;
      }

      const date = new Date(bookingDate);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const month = date.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });

      monthlyData[month] =
        (monthlyData[month] ?? 0) + getBookingAmount(booking);
    });

    return Object.entries(monthlyData).slice(-6);
  }, [filteredBookings]);

  // =====================================================
  // TOP VEHICLES
  // =====================================================

  const topVehicles = useMemo(() => {
    const vehicleMap = new Map<
      string,
      {
        name: string;
        bookings: number;
        revenue: number;
      }
    >();

    filteredBookings.forEach((booking) => {
      const vehicleId =
        booking.vehicle?._id || booking.vehicle?.name || "unknown";

      const vehicleName =
        booking.vehicle?.name ||
        `${booking.vehicle?.brand || ""} ${
          booking.vehicle?.model || ""
        }`.trim() ||
        "Unknown Vehicle";

      const existing = vehicleMap.get(vehicleId);

      if (existing) {
        existing.bookings += 1;
        existing.revenue += getBookingAmount(booking);
      } else {
        vehicleMap.set(vehicleId, {
          name: vehicleName,
          bookings: 1,
          revenue: getBookingAmount(booking),
        });
      }
    });

    return Array.from(vehicleMap.values())
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }, [filteredBookings]);

  // =====================================================
  // STATUS PERCENTAGE
  // =====================================================

  const getPercentage = (value: number): number => {
    if (statistics.totalBookings === 0) {
      return 0;
    }

    return Math.round((value / statistics.totalBookings) * 100);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <BarChart3 size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

                <p className="mt-1 text-sm text-gray-500">
                  View booking, revenue and vehicle performance reports.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {/* DATE FILTER */}

            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Time</option>

              <option value="7">Last 7 Days</option>

              <option value="30">Last 30 Days</option>

              <option value="365">Last 12 Months</option>
            </select>

            {/* REFRESH */}

            <button
              type="button"
              onClick={() => void loadReports(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={() => void loadReports()}
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            MAIN STAT CARDS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* REVENUE */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(statistics.totalRevenue)}
                </p>
              </div>

              <div className="rounded-lg bg-green-100 p-3 text-green-600">
                <IndianRupee size={22} />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp size={14} />
              Revenue from bookings
            </div>
          </div>

          {/* BOOKINGS */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {statistics.totalBookings}
                </p>
              </div>

              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <CalendarCheck size={22} />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Average value:{" "}
              <span className="font-semibold">
                {formatCurrency(statistics.averageBookingValue)}
              </span>
            </p>
          </div>

          {/* USERS */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Customers</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {statistics.uniqueUsers}
                </p>
              </div>

              <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                <Users size={22} />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">Unique customers</p>
          </div>

          {/* VEHICLES */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vehicles Booked</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {statistics.uniqueVehicles}
                </p>
              </div>

              <div className="rounded-lg bg-orange-100 p-3 text-orange-600">
                <Car size={22} />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">Unique vehicles</p>
          </div>
        </div>

        {/* =================================================
            BOOKING STATUS
        ================================================= */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />

            <h2 className="text-lg font-semibold text-gray-900">
              Booking Status
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {/* CONFIRMED */}

            <div className="rounded-lg bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">
                  Confirmed
                </span>

                <CheckCircle size={18} className="text-green-600" />
              </div>

              <p className="mt-2 text-2xl font-bold text-green-800">
                {statistics.confirmedBookings}
              </p>

              <p className="mt-1 text-xs text-green-600">
                {getPercentage(statistics.confirmedBookings)}%
              </p>
            </div>

            {/* COMPLETED */}

            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">
                  Completed
                </span>

                <CheckCircle size={18} className="text-blue-600" />
              </div>

              <p className="mt-2 text-2xl font-bold text-blue-800">
                {statistics.completedBookings}
              </p>

              <p className="mt-1 text-xs text-blue-600">
                {getPercentage(statistics.completedBookings)}%
              </p>
            </div>

            {/* PENDING */}

            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-700">
                  Pending
                </span>

                <Clock size={18} className="text-yellow-600" />
              </div>

              <p className="mt-2 text-2xl font-bold text-yellow-800">
                {statistics.pendingBookings}
              </p>

              <p className="mt-1 text-xs text-yellow-600">
                {getPercentage(statistics.pendingBookings)}%
              </p>
            </div>

            {/* CANCELLED */}

            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-700">
                  Cancelled
                </span>

                <XCircle size={18} className="text-red-600" />
              </div>

              <p className="mt-2 text-2xl font-bold text-red-800">
                {statistics.cancelledBookings}
              </p>

              <p className="mt-1 text-xs text-red-600">
                {getPercentage(statistics.cancelledBookings)}%
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            TWO COLUMN SECTION
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* =================================================
              MONTHLY REVENUE
          ================================================= */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Revenue Overview
                </h2>

                <p className="mt-1 text-xs text-gray-500">Revenue by month</p>
              </div>

              <BarChart3 size={21} className="text-blue-600" />
            </div>

            {monthlyRevenue.length === 0 ? (
              <div className="flex h-56 items-center justify-center text-sm text-gray-400">
                No revenue data available
              </div>
            ) : (
              <div className="space-y-4">
                {monthlyRevenue.map(([month, revenue]) => {
                  const maxRevenue = Math.max(
                    ...monthlyRevenue.map((item) => item[1]),
                    1,
                  );

                  const percentage = Math.max(4, (revenue / maxRevenue) * 100);

                  return (
                    <div key={month}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-gray-600">{month}</span>

                        <span className="font-semibold text-gray-900">
                          {formatCurrency(revenue)}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* =================================================
              TOP VEHICLES
          ================================================= */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Top Vehicles
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Most frequently booked vehicles
                </p>
              </div>

              <Car size={21} className="text-blue-600" />
            </div>

            {topVehicles.length === 0 ? (
              <div className="flex h-56 items-center justify-center text-sm text-gray-400">
                No vehicle booking data available
              </div>
            ) : (
              <div className="space-y-4">
                {topVehicles.map((vehicle, index) => (
                  <div
                    key={`${vehicle.name}-${index}`}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {vehicle.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {vehicle.bookings} bookings
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(vehicle.revenue)}
                      </p>

                      <p className="text-xs text-gray-400">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            PAYMENT SUMMARY
        ================================================= */}

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3 text-green-600">
                <IndianRupee size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">Payment Summary</h2>

                <p className="text-sm text-gray-500">
                  Successfully completed payments
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs text-gray-500">Payments</p>

                <p className="text-xl font-bold text-gray-900">
                  {paymentStatistics.count}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Payment Revenue</p>

                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(paymentStatistics.revenue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            RECENT BOOKINGS
        ================================================= */}

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest booking activity
            </p>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">
              No bookings available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Vehicle
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Date
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.slice(0, 10).map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {booking.user?.name ||
                            booking.customer?.name ||
                            "Unknown"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {booking.user?.email || booking.customer?.email || ""}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {booking.vehicle?.name ||
                            `${booking.vehicle?.brand || ""} ${
                              booking.vehicle?.model || ""
                            }`.trim() ||
                            "Unknown Vehicle"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(getBookingDate(booking))}
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {formatCurrency(getBookingAmount(booking))}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
                          {getBookingStatus(booking)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
