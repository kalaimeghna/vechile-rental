import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axios";
import {
  Search,
  RefreshCw,
  IndianRupee,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  User,
  Car,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

// =======================================================
// TYPES
// =======================================================

type PaymentStatus =
  | "pending"
  | "paid"
  | "completed"
  | "success"
  | "failed"
  | "cancelled"
  | string;

interface PaymentUser {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface PaymentVehicle {
  _id?: string;
  name?: string;
  brand?: string;
  model?: string;
  registrationNumber?: string;
}

interface PaymentBooking {
  _id?: string;
  bookingId?: string;
  startDate?: string;
  endDate?: string;
  pickupDate?: string;
  returnDate?: string;
  status?: string;
  totalAmount?: number;
}

interface Payment {
  _id: string;

  amount?: number;
  totalAmount?: number;
  price?: number;

  status?: PaymentStatus;

  paymentMethod?: string;
  method?: string;

  transactionId?: string;
  paymentId?: string;

  user?: PaymentUser | null;
  customer?: PaymentUser | null;

  vehicle?: PaymentVehicle | null;

  booking?: PaymentBooking | string | null;

  createdAt?: string;
  updatedAt?: string;
}

interface PaymentsResponse {
  payments?: Payment[];
  data?: Payment[];
  results?: Payment[];
  total?: number;
  count?: number;
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

const getPaymentAmount = (payment: Payment): number => {
  return payment.amount ?? payment.totalAmount ?? payment.price ?? 0;
};

const getPaymentStatus = (payment: Payment): string => {
  return payment.status?.toLowerCase() ?? "pending";
};

const getPaymentUser = (payment: Payment): PaymentUser | null => {
  return payment.user ?? payment.customer ?? null;
};

const getVehicleName = (vehicle?: PaymentVehicle | null): string => {
  if (!vehicle) {
    return "Unknown Vehicle";
  }

  if (vehicle.name) {
    return vehicle.name;
  }

  const fullName = `${vehicle.brand ?? ""} ${vehicle.model ?? ""}`.trim();

  return fullName || "Unknown Vehicle";
};

const getBookingId = (booking?: PaymentBooking | string | null): string => {
  if (!booking) {
    return "N/A";
  }

  if (typeof booking === "string") {
    return booking;
  }

  return booking.bookingId ?? booking._id ?? "N/A";
};

const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
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

const formatDateTime = (date?: string): string => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// =======================================================
// COMPONENT
// =======================================================

const Payments: React.FC = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [payments, setPayments] = useState<Payment[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [dateFilter, setDateFilter] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const itemsPerPage = 10;

  // =====================================================
  // FETCH PAYMENTS
  // =====================================================

  const fetchPayments = async (showRefresh = false): Promise<void> => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axiosInstance.get<Payment[] | PaymentsResponse>(
        "/payments",
      );

      const responseData = response.data;

      let paymentList: Payment[] = [];

      if (Array.isArray(responseData)) {
        paymentList = responseData;
      } else if (Array.isArray(responseData.payments)) {
        paymentList = responseData.payments;
      } else if (Array.isArray(responseData.data)) {
        paymentList = responseData.data;
      } else if (Array.isArray(responseData.results)) {
        paymentList = responseData.results;
      }

      setPayments(paymentList);
    } catch (error: unknown) {
      console.error("Failed to fetch payments:", error);

      setError(
        getErrorMessage(error, "Failed to load payments. Please try again."),
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

    const loadPayments = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get<Payment[] | PaymentsResponse>(
          "/payments",
        );

        if (cancelled) {
          return;
        }

        const responseData = response.data;

        let paymentList: Payment[] = [];

        if (Array.isArray(responseData)) {
          paymentList = responseData;
        } else if (Array.isArray(responseData.payments)) {
          paymentList = responseData.payments;
        } else if (Array.isArray(responseData.data)) {
          paymentList = responseData.data;
        } else if (Array.isArray(responseData.results)) {
          paymentList = responseData.results;
        }

        setPayments(paymentList);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        console.error("Failed to fetch payments:", error);

        setError(
          getErrorMessage(error, "Failed to load payments. Please try again."),
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPayments();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // FILTER PAYMENTS
  // =====================================================

  const filteredPayments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    const now = new Date();

    let minimumDate: Date | null = null;

    if (dateFilter === "7") {
      minimumDate = new Date(now);
      minimumDate.setDate(now.getDate() - 7);
    }

    if (dateFilter === "30") {
      minimumDate = new Date(now);
      minimumDate.setDate(now.getDate() - 30);
    }

    if (dateFilter === "365") {
      minimumDate = new Date(now);
      minimumDate.setFullYear(now.getFullYear() - 1);
    }

    return payments.filter((payment) => {
      const user = getPaymentUser(payment);

      const bookingId = getBookingId(payment.booking);

      const searchableText = [
        user?.name,
        user?.email,
        payment.transactionId,
        payment.paymentId,
        payment.paymentMethod,
        payment.method,
        bookingId,
        getVehicleName(payment.vehicle),
      ]
        .filter((value): value is string => typeof value === "string")
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchValue === "" || searchableText.includes(searchValue);

      const paymentStatus = getPaymentStatus(payment);

      const matchesStatus =
        statusFilter === "all" || paymentStatus === statusFilter;

      let matchesDate = true;

      if (minimumDate) {
        if (!payment.createdAt) {
          matchesDate = false;
        } else {
          const paymentDate = new Date(payment.createdAt);

          matchesDate =
            !Number.isNaN(paymentDate.getTime()) && paymentDate >= minimumDate;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [payments, search, statusFilter, dateFilter]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / itemsPerPage),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  // =====================================================
  // STATUS
  // =====================================================

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  // =====================================================
  // DATE
  // =====================================================

  const handleDateChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setDateFilter(event.target.value);
    setCurrentPage(1);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const handleClearFilters = (): void => {
    setSearch("");
    setStatusFilter("all");
    setDateFilter("all");
    setCurrentPage(1);
  };

  // =====================================================
  // PAYMENT STATUS BADGE
  // =====================================================

  const renderStatusBadge = (payment: Payment): React.ReactNode => {
    const status = getPaymentStatus(payment);

    if (status === "paid" || status === "completed" || status === "success") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700">
          <CheckCircle size={13} />
          {status}
        </span>
      );
    }

    if (status === "failed" || status === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold capitalize text-red-700">
          <XCircle size={13} />
          {status}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold capitalize text-yellow-700">
        <Clock size={13} />
        {status}
      </span>
    );
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    const total = payments.length;

    const successful = payments.filter((payment) => {
      const status = getPaymentStatus(payment);

      return (
        status === "paid" || status === "completed" || status === "success"
      );
    });

    const pending = payments.filter(
      (payment) => getPaymentStatus(payment) === "pending",
    );

    const failed = payments.filter((payment) => {
      const status = getPaymentStatus(payment);

      return status === "failed" || status === "cancelled";
    });

    const totalRevenue = successful.reduce(
      (totalAmount, payment) => totalAmount + getPaymentAmount(payment),
      0,
    );

    const pendingAmount = pending.reduce(
      (totalAmount, payment) => totalAmount + getPaymentAmount(payment),
      0,
    );

    const failedAmount = failed.reduce(
      (totalAmount, payment) => totalAmount + getPaymentAmount(payment),
      0,
    );

    return {
      total,
      successful: successful.length,
      pending: pending.length,
      failed: failed.length,
      totalRevenue,
      pendingAmount,
      failedAmount,
    };
  }, [payments]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">Loading payments...</p>
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
              <div className="rounded-lg bg-green-100 p-2 text-green-600">
                <CreditCard size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage and monitor all rental payments.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void fetchPayments(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
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
                onClick={() => void fetchPayments()}
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* TOTAL REVENUE */}

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
          </div>

          {/* TOTAL PAYMENTS */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Payments</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {statistics.total}
                </p>
              </div>

              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <CreditCard size={22} />
              </div>
            </div>
          </div>

          {/* SUCCESSFUL */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Successful</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {statistics.successful}
                </p>
              </div>

              <div className="rounded-lg bg-green-100 p-3 text-green-600">
                <CheckCircle size={22} />
              </div>
            </div>
          </div>

          {/* FAILED */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Failed</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {statistics.failed}
                </p>
              </div>

              <div className="rounded-lg bg-red-100 p-3 text-red-600">
                <XCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* SEARCH */}

            <div className="relative md:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by customer, email, transaction ID..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Status</option>

              <option value="paid">Paid</option>

              <option value="completed">Completed</option>

              <option value="success">Success</option>

              <option value="pending">Pending</option>

              <option value="failed">Failed</option>

              <option value="cancelled">Cancelled</option>
            </select>

            {/* DATE */}

            <select
              value={dateFilter}
              onChange={handleDateChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Time</option>

              <option value="7">Last 7 Days</option>

              <option value="30">Last 30 Days</option>

              <option value="365">Last 12 Months</option>
            </select>
          </div>

          {(search || statusFilter !== "all" || dateFilter !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredPayments.length}
                </span>{" "}
                matching payments
              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* =================================================
            PAYMENT TABLE
        ================================================= */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {paginatedPayments.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <CreditCard size={36} className="text-gray-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                No payments found
              </h3>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                {search || statusFilter !== "all" || dateFilter !== "all"
                  ? "Try changing your search or filters."
                  : "There are no payments available yet."}
              </p>

              {(search || statusFilter !== "all" || dateFilter !== "all") && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Vehicle
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Booking
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Method
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Date
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedPayments.map((payment) => {
                      const user = getPaymentUser(payment);

                      return (
                        <tr
                          key={payment._id}
                          className="transition hover:bg-gray-50"
                        >
                          {/* CUSTOMER */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <User size={18} />
                              </div>

                              <div>
                                <p className="font-medium text-gray-900">
                                  {user?.name || "Unknown Customer"}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {user?.email || "No email"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* VEHICLE */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Car size={16} className="text-gray-400" />

                              <span className="text-sm text-gray-700">
                                {getVehicleName(payment.vehicle)}
                              </span>
                            </div>
                          </td>

                          {/* BOOKING */}

                          <td className="px-6 py-4">
                            <span className="font-mono text-xs text-gray-600">
                              {getBookingId(payment.booking)}
                            </span>
                          </td>

                          {/* AMOUNT */}

                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(getPaymentAmount(payment))}
                            </span>
                          </td>

                          {/* METHOD */}

                          <td className="px-6 py-4">
                            <span className="capitalize text-sm text-gray-600">
                              {payment.paymentMethod || payment.method || "N/A"}
                            </span>
                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-4">
                            {renderStatusBadge(payment)}
                          </td>

                          {/* DATE */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={14} />

                              {formatDate(payment.createdAt)}
                            </div>
                          </td>

                          {/* ACTION */}

                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedPayment(payment)}
                              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                            >
                              <Eye size={16} />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE CARDS
              ================================================= */}

              <div className="divide-y divide-gray-100 md:hidden">
                {paginatedPayments.map((payment) => {
                  const user = getPaymentUser(payment);

                  return (
                    <div key={payment._id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <CreditCard size={20} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {user?.name || "Unknown Customer"}
                            </p>

                            <p className="text-sm text-gray-500">
                              {user?.email || "No email"}
                            </p>
                          </div>
                        </div>

                        {renderStatusBadge(payment)}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Amount</p>

                          <p className="mt-1 font-semibold text-gray-900">
                            {formatCurrency(getPaymentAmount(payment))}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Method</p>

                          <p className="mt-1 text-sm capitalize text-gray-700">
                            {payment.paymentMethod || payment.method || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Vehicle</p>

                          <p className="mt-1 text-sm text-gray-700">
                            {getVehicleName(payment.vehicle)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Date</p>

                          <p className="mt-1 text-sm text-gray-700">
                            {formatDate(payment.createdAt)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedPayment(payment)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      >
                        <Eye size={16} />
                        View Payment
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* =================================================
                  PAGINATION
              ================================================= */}

              <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {filteredPayments.length === 0 ? 0 : startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-700">
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredPayments.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {filteredPayments.length}
                  </span>{" "}
                  payments
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={safeCurrentPage === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <span className="px-2 text-sm text-gray-600">
                    Page {safeCurrentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={safeCurrentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* =================================================
            PAYMENT DETAILS MODAL
        ================================================= */}

        {selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Payment Details
                    </h2>

                    <p className="text-xs text-gray-500">
                      Transaction information
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <XCircle size={22} />
                </button>
              </div>

              {/* MODAL BODY */}

              <div className="space-y-5 p-6">
                {/* AMOUNT */}

                <div className="rounded-xl bg-gray-50 p-5 text-center">
                  <p className="text-sm text-gray-500">Payment Amount</p>

                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {formatCurrency(getPaymentAmount(selectedPayment))}
                  </p>

                  <div className="mt-3">
                    {renderStatusBadge(selectedPayment)}
                  </div>
                </div>

                {/* CUSTOMER */}

                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-900">
                    Customer
                  </p>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <User size={18} />
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {getPaymentUser(selectedPayment)?.name ||
                            "Unknown Customer"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {getPaymentUser(selectedPayment)?.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PAYMENT INFO */}

                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-900">
                    Payment Information
                  </p>

                  <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-500">
                        Transaction ID
                      </span>

                      <span className="max-w-[220px] break-all text-right font-mono text-xs text-gray-700">
                        {selectedPayment.transactionId ||
                          selectedPayment.paymentId ||
                          "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Method</span>

                      <span className="text-sm font-medium capitalize text-gray-800">
                        {selectedPayment.paymentMethod ||
                          selectedPayment.method ||
                          "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Date</span>

                      <span className="text-sm text-gray-700">
                        {formatDateTime(selectedPayment.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Booking ID</span>

                      <span className="font-mono text-xs text-gray-700">
                        {getBookingId(selectedPayment.booking)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* VEHICLE */}

                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-900">
                    Vehicle
                  </p>

                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                    <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                      <Car size={20} />
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">
                        {getVehicleName(selectedPayment.vehicle)}
                      </p>

                      {selectedPayment.vehicle?.registrationNumber && (
                        <p className="text-sm text-gray-500">
                          {selectedPayment.vehicle.registrationNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}

              <div className="border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
