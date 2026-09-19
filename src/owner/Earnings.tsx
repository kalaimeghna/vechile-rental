import { useMemo, useState } from "react";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Car,
  Download,
  ArrowUpRight,
  Wallet,
  Search,
  Filter,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

export type TransactionStatus = "completed" | "pending" | "refunded";

export interface Transaction {
  _id: string;
  bookingId: string;
  vehicleName: string;
  customerName: string;
  date: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: TransactionStatus;
  paymentMethod: string;
}

export interface MonthlyEarning {
  month: string;
  amount: number;
}

/* ============================================================
   SAMPLE DATA
   Replace with backend API data later.
============================================================ */

const monthlyEarnings: MonthlyEarning[] = [
  { month: "Mar", amount: 42000 },
  { month: "Apr", amount: 58000 },
  { month: "May", amount: 51000 },
  { month: "Jun", amount: 69000 },
  { month: "Jul", amount: 75000 },
  { month: "Aug", amount: 92000 },
];

const sampleTransactions: Transaction[] = [
  {
    _id: "transaction-001",
    bookingId: "VR-2026-1001",
    vehicleName: "Toyota Fortuner",
    customerName: "Rahul Kumar",
    date: "2026-08-18",
    amount: 11000,
    platformFee: 550,
    netAmount: 10450,
    status: "completed",
    paymentMethod: "UPI",
  },
  {
    _id: "transaction-002",
    bookingId: "VR-2026-1002",
    vehicleName: "Hyundai Creta",
    customerName: "Priya Sharma",
    date: "2026-08-16",
    amount: 7500,
    platformFee: 375,
    netAmount: 7125,
    status: "completed",
    paymentMethod: "Card",
  },
  {
    _id: "transaction-003",
    bookingId: "VR-2026-1003",
    vehicleName: "Mahindra Thar",
    customerName: "Arun Kumar",
    date: "2026-08-14",
    amount: 9000,
    platformFee: 450,
    netAmount: 8550,
    status: "pending",
    paymentMethod: "UPI",
  },
  {
    _id: "transaction-004",
    bookingId: "VR-2026-1004",
    vehicleName: "Honda City",
    customerName: "Sneha R",
    date: "2026-08-10",
    amount: 6600,
    platformFee: 330,
    netAmount: 6270,
    status: "completed",
    paymentMethod: "Cash",
  },
  {
    _id: "transaction-005",
    bookingId: "VR-2026-1005",
    vehicleName: "Kia Seltos",
    customerName: "Vijay Kumar",
    date: "2026-08-05",
    amount: 8400,
    platformFee: 420,
    netAmount: 7980,
    status: "refunded",
    paymentMethod: "Card",
  },
];

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

/* ============================================================
   STATUS BADGE COMPONENT
============================================================ */

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
        <CheckCircle2 size={14} />
        Completed
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700">
        <Clock3 size={14} />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
      <TrendingDown size={14} />
      Refunded
    </span>
  );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function Earnings() {
  const [transactions] = useState<Transaction[]>(sampleTransactions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [period, setPeriod] = useState("6-months");

  /* ==========================================================
     CALCULATIONS
  ========================================================== */

  const totalEarnings = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.status === "completed")
      .reduce((total, transaction) => total + transaction.netAmount, 0);
  }, [transactions]);

  const pendingEarnings = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.status === "pending")
      .reduce((total, transaction) => total + transaction.netAmount, 0);
  }, [transactions]);

  const refundedAmount = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.status === "refunded")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  const completedBookings = transactions.filter(
    (transaction) => transaction.status === "completed",
  ).length;

  const currentMonthEarnings =
    monthlyEarnings[monthlyEarnings.length - 1].amount;

  const previousMonthEarnings =
    monthlyEarnings[monthlyEarnings.length - 2].amount;

  const growthPercentage =
    previousMonthEarnings > 0
      ? (
          ((currentMonthEarnings - previousMonthEarnings) /
            previousMonthEarnings) *
          100
        ).toFixed(1)
      : "0";

  /* ==========================================================
     FILTER TRANSACTIONS
  ========================================================== */

  const filteredTransactions = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return transactions.filter((transaction) => {
      const matchesSearch =
        !searchValue ||
        transaction.bookingId.toLowerCase().includes(searchValue) ||
        transaction.vehicleName.toLowerCase().includes(searchValue) ||
        transaction.customerName.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  /* ==========================================================
     MAX CHART VALUE
  ========================================================== */

  const maxEarning = Math.max(...monthlyEarnings.map((item) => item.amount));

  /* ==========================================================
     DOWNLOAD REPORT
  ========================================================== */

  const handleDownloadReport = () => {
    alert("Earnings report will be generated.");
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Earnings</h1>
            <p className="mt-1 text-sm text-slate-500">
              Track your vehicle rental earnings and transactions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadReport}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            <Download size={17} />
            Download Report
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Earnings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Earnings
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {formatPrice(totalEarnings)}
                </h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <IndianRupee size={21} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-green-600">
              <ArrowUpRight size={15} />
              {growthPercentage}% this month
            </div>
          </div>

          {/* Current Month */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  This Month
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {formatPrice(currentMonthEarnings)}
                </h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <TrendingUp size={21} />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Compared with {formatPrice(previousMonthEarnings)} last month
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Pending Earnings
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {formatPrice(pendingEarnings)}
                </h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                <Clock3 size={21} />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Awaiting payment settlement
            </p>
          </div>

          {/* Bookings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Completed Bookings
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {completedBookings}
                </h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Car size={21} />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Successful rental bookings
            </p>
          </div>
        </div>

        {/* CHART + WALLET */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Chart */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Earnings Overview
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Your monthly rental earnings
                </p>
              </div>

              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 outline-none"
              >
                <option value="6-months">Last 6 Months</option>
                <option value="12-months">Last 12 Months</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="mt-8 flex h-64 items-end gap-3 sm:gap-6">
              {monthlyEarnings.map((item) => {
                const height = (item.amount / maxEarning) * 100;

                return (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <div className="group relative flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-lg bg-blue-500 transition-all duration-300 hover:bg-blue-600"
                        style={{
                          height: `${height}%`,
                          minHeight: "8px",
                        }}
                      >
                        <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white group-hover:block">
                          {formatPrice(item.amount)}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-slate-400">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Wallet */}
          <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Wallet size={22} />
              </div>
              <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-bold text-green-300">
                Active
              </span>
            </div>

            <p className="mt-8 text-sm text-slate-400">Available Balance</p>
            <h2 className="mt-2 text-3xl font-black">
              {formatPrice(totalEarnings)}
            </h2>

            <div className="mt-8 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Pending</span>
                <span className="font-bold">
                  {formatPrice(pendingEarnings)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-400">Refunded</span>
                <span className="font-bold text-red-300">
                  {formatPrice(refundedAmount)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-900 transition hover:bg-slate-100"
            >
              Withdraw Earnings
              <ArrowUpRight size={16} />
            </button>
          </section>
        </div>

        {/* TRANSACTIONS */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Transaction History
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  View all your rental transactions.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search transaction..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs font-medium outline-none focus:border-blue-500 sm:w-56"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <Filter
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-8 text-xs font-bold text-slate-600 outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-400">
                    Booking
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-400">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-400">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-400">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-400">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-slate-800">
                        {transaction.bookingId}
                      </span>
                      <p className="mt-1 text-xs text-slate-400">
                        {transaction.paymentMethod}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Car size={17} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          {transaction.vehicleName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm font-semibold text-slate-600">
                        {transaction.customerName}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-500">
                        {formatDate(transaction.date)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-slate-800">
                        {formatPrice(transaction.netAmount)}
                      </span>
                      <p className="mt-1 text-xs text-slate-400">
                        Fee: {formatPrice(transaction.platformFee)}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={transaction.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredTransactions.map((transaction) => (
              <div key={transaction._id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      {transaction.bookingId}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  <StatusBadge status={transaction.status} />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Car size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      {transaction.vehicleName}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {transaction.customerName}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs text-slate-400">Net Earnings</p>
                    <p className="mt-1 text-lg font-black text-slate-900">
                      {formatPrice(transaction.netAmount)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-400">Platform Fee</p>
                    <p className="mt-1 text-sm font-bold text-slate-600">
                      {formatPrice(transaction.platformFee)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty */}
          {filteredTransactions.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Search size={24} />
              </div>
              <h3 className="mt-4 font-black text-slate-800">
                No transactions found
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </section>

        {/* INFO */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <CalendarDays size={19} className="mt-0.5 shrink-0 text-blue-600" />
          <p className="text-xs leading-5 text-blue-700">
            Earnings are calculated after platform fees. Pending earnings will
            become available after the booking is successfully completed and the
            payment is settled.
          </p>
        </div>
      </div>
    </div>
  );
}
