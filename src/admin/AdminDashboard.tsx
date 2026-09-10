import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Car,
  CalendarDays,
  IndianRupee,
  UserCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Activity,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import axiosInstance from "../api/axios";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";

// =========================================================
// TYPES
// =========================================================

interface UserData {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
}

interface Vehicle {
  _id: string;
  name?: string;
  brand?: string;
  model?: string;
  type?: string;
  status?: string;
  isAvailable?: boolean;
  pricePerDay?: number;
  createdAt?: string;
}

interface BookingPerson {
  _id?: string;
  name?: string;
  email?: string;
}

interface BookingVehicle {
  _id?: string;
  name?: string;
  brand?: string;
  model?: string;
  image?: string;
  images?: string[];
}

interface Booking {
  _id: string;

  user?: BookingPerson | null;
  renter?: BookingPerson | null;
  customer?: BookingPerson | null;

  vehicle?: BookingVehicle | null;

  owner?: BookingPerson | null;

  startDate?: string;
  endDate?: string;

  pickupDate?: string;
  returnDate?: string;

  totalAmount?: number;
  totalPrice?: number;
  amount?: number;

  status?: string;
  bookingStatus?: string;

  paymentStatus?: string;

  createdAt?: string;
}

interface Payment {
  _id: string;

  amount?: number;
  totalAmount?: number;

  status?: string;
  paymentStatus?: string;

  createdAt?: string;

  booking?: {
    _id?: string;
  } | null;
}

interface ApiResponse<T> {
  data?: T[];
  users?: UserData[];
  vehicles?: Vehicle[];
  bookings?: Booking[];
  payments?: Payment[];
}

interface ApiErrorResponse {
  message?: string;
}

interface AxiosLikeError {
  response?: {
    data?: ApiErrorResponse;
  };
  message?: string;
}

// =========================================================
// ERROR HELPER
// =========================================================

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as AxiosLikeError;

    return axiosError.response?.data?.message || axiosError.message || fallback;
  }

  return fallback;
};

// =========================================================
// RESPONSE HELPERS
// =========================================================

const extractUsers = (
  response: ApiResponse<UserData> | UserData[],
): UserData[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.users)) {
    return response.users;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};

const extractVehicles = (
  response: ApiResponse<Vehicle> | Vehicle[],
): Vehicle[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.vehicles)) {
    return response.vehicles;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};

const extractBookings = (
  response: ApiResponse<Booking> | Booking[],
): Booking[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.bookings)) {
    return response.bookings;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};

const extractPayments = (
  response: ApiResponse<Payment> | Payment[],
): Payment[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.payments)) {
    return response.payments;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};

// =========================================================
// BOOKING HELPERS
// =========================================================

const getBookingStatus = (booking: Booking): string => {
  return (booking.status || booking.bookingStatus || "pending")
    .toLowerCase()
    .trim();
};

const getBookingAmount = (booking: Booking): number => {
  return Number(
    booking.totalAmount ?? booking.totalPrice ?? booking.amount ?? 0,
  );
};

const getPaymentAmount = (payment: Payment): number => {
  return Number(payment.amount ?? payment.totalAmount ?? 0);
};

const getPaymentStatus = (payment: Payment): string => {
  return (payment.status || payment.paymentStatus || "pending")
    .toLowerCase()
    .trim();
};

const getCustomer = (booking: Booking): BookingPerson | null => {
  return booking.user || booking.renter || booking.customer || null;
};

const getVehicleName = (booking: Booking): string => {
  const vehicle = booking.vehicle;

  if (!vehicle) {
    return "Vehicle";
  }

  if (vehicle.name) {
    return vehicle.name;
  }

  return `${vehicle.brand || ""} ${vehicle.model || ""}`.trim() || "Vehicle";
};

// =========================================================
// FORMAT HELPERS
// =========================================================

const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
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

// =========================================================
// COMPONENT
// =========================================================

const AdminDashboard: React.FC = () => {
  // =======================================================
  // STATES
  // =======================================================

  const [users, setUsers] = useState<UserData[]>([]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [payments, setPayments] = useState<Payment[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  // =======================================================
  // FETCH DASHBOARD DATA
  // =======================================================

  const fetchDashboardData = async (isRefresh = false): Promise<void> => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }

      setError("");

      const [
        usersResponse,
        vehiclesResponse,
        bookingsResponse,
        paymentsResponse,
      ] = await Promise.all([
        axiosInstance.get("/users"),
        axiosInstance.get("/vehicles"),
        axiosInstance.get("/bookings"),
        axiosInstance.get("/payments"),
      ]);

      const usersData = usersResponse.data as
        | ApiResponse<UserData>
        | UserData[];

      const vehiclesData = vehiclesResponse.data as
        | ApiResponse<Vehicle>
        | Vehicle[];

      const bookingsData = bookingsResponse.data as
        | ApiResponse<Booking>
        | Booking[];

      const paymentsData = paymentsResponse.data as
        | ApiResponse<Payment>
        | Payment[];

      setUsers(extractUsers(usersData));

      setVehicles(extractVehicles(vehiclesData));

      setBookings(extractBookings(bookingsData));

      setPayments(extractPayments(paymentsData));
    } catch (error: unknown) {
      console.error("Dashboard fetch error:", error);

      setError(getErrorMessage(error, "Unable to load dashboard data."));
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      }

      setLoading(false);
    }
  };

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    let cancelled = false;

    const loadInitialDashboard = async (): Promise<void> => {
      try {
        const [
          usersResponse,
          vehiclesResponse,
          bookingsResponse,
          paymentsResponse,
        ] = await Promise.all([
          axiosInstance.get("/users"),
          axiosInstance.get("/vehicles"),
          axiosInstance.get("/bookings"),
          axiosInstance.get("/payments"),
        ]);

        if (cancelled) {
          return;
        }

        const usersData = usersResponse.data as
          | ApiResponse<UserData>
          | UserData[];

        const vehiclesData = vehiclesResponse.data as
          | ApiResponse<Vehicle>
          | Vehicle[];

        const bookingsData = bookingsResponse.data as
          | ApiResponse<Booking>
          | Booking[];

        const paymentsData = paymentsResponse.data as
          | ApiResponse<Payment>
          | Payment[];

        const nextUsers = extractUsers(usersData);

        const nextVehicles = extractVehicles(vehiclesData);

        const nextBookings = extractBookings(bookingsData);

        const nextPayments = extractPayments(paymentsData);

        if (cancelled) {
          return;
        }

        setUsers(nextUsers);
        setVehicles(nextVehicles);
        setBookings(nextBookings);
        setPayments(nextPayments);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        console.error("Initial dashboard fetch error:", error);

        setError(getErrorMessage(error, "Unable to load dashboard data."));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    // Important:
    // The async function performs the API request first.
    // State updates happen after the awaited request.
    void loadInitialDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  // =======================================================
  // CALCULATIONS
  // =======================================================

  const stats = useMemo(() => {
    const totalUsers = users.length;

    const owners = users.filter((user) =>
      user.role?.toLowerCase().includes("owner"),
    ).length;

    const customers = users.filter((user) => {
      const role = user.role?.toLowerCase() || "";

      return (
        role.includes("customer") ||
        role.includes("renter") ||
        role === "user" ||
        role === "jobseeker"
      );
    }).length;

    const totalVehicles = vehicles.length;

    const availableVehicles = vehicles.filter(
      (vehicle) =>
        vehicle.isAvailable === true ||
        vehicle.status?.toLowerCase().trim() === "available",
    ).length;

    const totalBookings = bookings.length;

    const pendingBookings = bookings.filter(
      (booking) => getBookingStatus(booking) === "pending",
    ).length;

    const confirmedBookings = bookings.filter((booking) => {
      const status = getBookingStatus(booking);

      return status === "confirmed" || status === "approved";
    }).length;

    const completedBookings = bookings.filter(
      (booking) => getBookingStatus(booking) === "completed",
    ).length;

    const cancelledBookings = bookings.filter((booking) => {
      const status = getBookingStatus(booking);

      return (
        status === "cancelled" || status === "canceled" || status === "rejected"
      );
    }).length;

    const bookingRevenue = bookings.reduce((total, booking) => {
      const status = getBookingStatus(booking);

      if (
        status === "confirmed" ||
        status === "approved" ||
        status === "completed"
      ) {
        return total + getBookingAmount(booking);
      }

      return total;
    }, 0);

    const paymentRevenue = payments.reduce((total, payment) => {
      const status = getPaymentStatus(payment);

      if (
        status === "paid" ||
        status === "success" ||
        status === "successful" ||
        status === "completed"
      ) {
        return total + getPaymentAmount(payment);
      }

      return total;
    }, 0);

    const revenue = paymentRevenue > 0 ? paymentRevenue : bookingRevenue;

    return {
      totalUsers,
      owners,
      customers,
      totalVehicles,
      availableVehicles,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      revenue,
    };
  }, [users, vehicles, bookings, payments]);

  // =======================================================
  // RECENT BOOKINGS
  // =======================================================

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();

        const dateB = new Date(b.createdAt || 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 6);
  }, [bookings]);

  // =======================================================
  // RECENT USERS
  // =======================================================

  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();

        const dateB = new Date(b.createdAt || 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [users]);

  // =======================================================
  // BOOKING PERCENTAGE
  // =======================================================

  const bookingPercentage = useMemo(() => {
    if (stats.totalBookings === 0) {
      return {
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
      };
    }

    return {
      pending: Math.round((stats.pendingBookings / stats.totalBookings) * 100),

      confirmed: Math.round(
        (stats.confirmedBookings / stats.totalBookings) * 100,
      ),

      completed: Math.round(
        (stats.completedBookings / stats.totalBookings) * 100,
      ),

      cancelled: Math.round(
        (stats.cancelledBookings / stats.totalBookings) * 100,
      ),
    };
  }, [stats]);

  // =======================================================
  // STATUS BADGE
  // =======================================================

  const renderStatus = (status: string): React.ReactNode => {
    const normalized = status.toLowerCase().trim();

    if (normalized === "confirmed" || normalized === "approved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Confirmed
        </span>
      );
    }

    if (normalized === "completed") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Completed
        </span>
      );
    }

    if (
      normalized === "cancelled" ||
      normalized === "canceled" ||
      normalized === "rejected"
    ) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
          <XCircle className="h-3.5 w-3.5" />
          Cancelled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
        <Clock3 className="h-3.5 w-3.5" />
        Pending
      </span>
    );
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  // =======================================================
  // MAIN UI
  // =======================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
              <Activity className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Overview of your vehicle rental platform.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => void fetchDashboardData(true)}
          disabled={refreshing}
          leftIcon={
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          }
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />

            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* MAIN STATS */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat
          title="Total Users"
          value={stats.totalUsers}
          subtitle={`${stats.owners} owners registered`}
          icon={<Users className="h-6 w-6" />}
          trend="+12%"
          trendUp
        />

        <DashboardStat
          title="Total Vehicles"
          value={stats.totalVehicles}
          subtitle={`${stats.availableVehicles} currently available`}
          icon={<Car className="h-6 w-6" />}
          trend="+8%"
          trendUp
        />

        <DashboardStat
          title="Total Bookings"
          value={stats.totalBookings}
          subtitle={`${stats.pendingBookings} pending bookings`}
          icon={<CalendarDays className="h-6 w-6" />}
          trend="+15%"
          trendUp
        />

        <DashboardStat
          title="Total Revenue"
          value={formatCurrency(stats.revenue)}
          subtitle="Successful rental revenue"
          icon={<IndianRupee className="h-6 w-6" />}
          trend="+18%"
          trendUp
        />
      </div>

      {/* SECONDARY STATS */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <MiniStat
          title="Owners"
          value={stats.owners}
          icon={<UserCheck className="h-5 w-5" />}
        />

        <MiniStat
          title="Customers"
          value={stats.customers}
          icon={<Users className="h-5 w-5" />}
        />

        <MiniStat
          title="Available Vehicles"
          value={stats.availableVehicles}
          icon={<Car className="h-5 w-5" />}
        />
      </div>

      {/* BOOKING OVERVIEW + QUICK ACTIONS */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* BOOKING OVERVIEW */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Booking Overview</h2>

              <p className="mt-1 text-xs text-gray-500">
                Current booking distribution
              </p>
            </div>

            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <BookingProgress
              title="Pending"
              value={stats.pendingBookings}
              percentage={bookingPercentage.pending}
              icon={<Clock3 className="h-5 w-5" />}
            />

            <BookingProgress
              title="Confirmed"
              value={stats.confirmedBookings}
              percentage={bookingPercentage.confirmed}
              icon={<CheckCircle2 className="h-5 w-5" />}
            />

            <BookingProgress
              title="Completed"
              value={stats.completedBookings}
              percentage={bookingPercentage.completed}
              icon={<CheckCircle2 className="h-5 w-5" />}
            />

            <BookingProgress
              title="Cancelled"
              value={stats.cancelledBookings}
              percentage={bookingPercentage.cancelled}
              icon={<XCircle className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Quick Actions</h2>

          <p className="mt-1 text-xs text-gray-500">
            Navigate to frequently used sections.
          </p>

          <div className="mt-5 space-y-3">
            <QuickAction
              href="/admin/bookings"
              icon={<CalendarDays className="h-5 w-5" />}
              title="Manage Bookings"
              subtitle={`${stats.totalBookings} total bookings`}
            />

            <QuickAction
              href="/admin/vehicles"
              icon={<Car className="h-5 w-5" />}
              title="Manage Vehicles"
              subtitle={`${stats.totalVehicles} vehicles`}
            />

            <QuickAction
              href="/admin/owners"
              icon={<UserCheck className="h-5 w-5" />}
              title="Manage Owners"
              subtitle={`${stats.owners} owners`}
            />

            <QuickAction
              href="/admin/users"
              icon={<Users className="h-5 w-5" />}
              title="Manage Users"
              subtitle={`${stats.totalUsers} users`}
            />

            <QuickAction
              href="/admin/payments"
              icon={<CreditCard className="h-5 w-5" />}
              title="View Payments"
              subtitle="Payment transactions"
            />
          </div>
        </div>
      </div>

      {/* RECENT BOOKINGS */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <div>
            <h2 className="font-semibold text-gray-900">Recent Bookings</h2>

            <p className="mt-1 text-xs text-gray-500">Latest rental activity</p>
          </div>

          <a
            href="/admin/bookings"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-10 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-gray-300" />

            <p className="mt-3 text-sm text-gray-500">No bookings available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Booking
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Vehicle
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((booking) => {
                  const customer = getCustomer(booking);

                  return (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          #{booking._id.slice(-8)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                            {(customer?.name || "U").charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {customer?.name || "Unknown"}
                            </p>

                            <p className="text-xs text-gray-400">
                              {customer?.email || ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-gray-400" />

                          <span className="text-sm text-gray-700">
                            {getVehicleName(booking)}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(getBookingAmount(booking))}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {renderStatus(getBookingStatus(booking))}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-500">
                          {formatDate(booking.createdAt)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RECENT USERS + PLATFORM HEALTH */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* RECENT USERS */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 p-5">
            <div>
              <h2 className="font-semibold text-gray-900">Recent Users</h2>

              <p className="mt-1 text-xs text-gray-500">
                Recently registered accounts
              </p>
            </div>

            <a
              href="/admin/users"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </a>
          </div>

          <div className="divide-y divide-gray-100">
            {recentUsers.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No users found.
              </div>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {user.name || "Unnamed User"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {user.email || "No email"}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                    {user.role || "user"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PLATFORM HEALTH */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />

            <h2 className="font-semibold text-gray-900">Platform Overview</h2>
          </div>

          <div className="mt-5 space-y-5">
            <HealthRow
              label="Vehicle Availability"
              value={
                stats.totalVehicles > 0
                  ? Math.round(
                      (stats.availableVehicles / stats.totalVehicles) * 100,
                    )
                  : 0
              }
            />

            <HealthRow
              label="Booking Completion"
              value={
                stats.totalBookings > 0
                  ? Math.round(
                      (stats.completedBookings / stats.totalBookings) * 100,
                    )
                  : 0
              }
            />

            <HealthRow
              label="Booking Confirmation"
              value={
                stats.totalBookings > 0
                  ? Math.round(
                      (stats.confirmedBookings / stats.totalBookings) * 100,
                    )
                  : 0
              }
            />

            <HealthRow
              label="Active Users"
              value={
                stats.totalUsers > 0
                  ? Math.round(
                      (users.filter(
                        (user) =>
                          user.isActive !== false &&
                          user.status?.toLowerCase() !== "inactive",
                      ).length /
                        stats.totalUsers) *
                        100,
                    )
                  : 0
              }
            />
          </div>

          <div className="mt-6 rounded-xl bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-blue-600" />

              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Platform is running
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Dashboard data is being loaded from your current API
                  endpoints.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// DASHBOARD STAT
// =========================================================

interface DashboardStatProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

const DashboardStat: React.FC<DashboardStatProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendUp,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="truncate text-xs text-gray-400">{subtitle}</p>

        <span
          className={`inline-flex shrink-0 items-center gap-1 text-xs font-semibold ${
            trendUp ? "text-green-600" : "text-red-600"
          }`}
        >
          {trendUp ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}

          {trend}
        </span>
      </div>
    </div>
  );
};

// =========================================================
// MINI STAT
// =========================================================

interface MiniStatProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const MiniStat: React.FC<MiniStatProps> = ({ title, value, icon }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500">{title}</p>

        <p className="mt-1 text-xl font-bold text-gray-900">
          {value.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
};

// =========================================================
// BOOKING PROGRESS
// =========================================================

interface BookingProgressProps {
  title: string;
  value: number;
  percentage: number;
  icon: React.ReactNode;
}

const BookingProgress: React.FC<BookingProgressProps> = ({
  title,
  value,
  percentage,
  icon,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-gray-500">{icon}</div>

          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>

        <span className="text-sm font-bold text-gray-900">{value}</span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${Math.min(100, Math.max(0, percentage))}%`,
          }}
        />
      </div>

      <p className="mt-2 text-right text-xs text-gray-400">{percentage}%</p>
    </div>
  );
};

// =========================================================
// QUICK ACTION
// =========================================================

interface QuickActionProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const QuickAction: React.FC<QuickActionProps> = ({
  href,
  icon,
  title,
  subtitle,
}) => {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-blue-100 group-hover:text-blue-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-gray-500">{subtitle}</p>
      </div>

      <ArrowUpRight className="h-4 w-4 text-gray-400 transition group-hover:text-blue-600" />
    </a>
  );
};

// =========================================================
// HEALTH ROW
// =========================================================

interface HealthRowProps {
  label: string;
  value: number;
}

const HealthRow: React.FC<HealthRowProps> = ({ label, value }) => {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>

        <span className="text-sm font-bold text-gray-900">{safeValue}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
