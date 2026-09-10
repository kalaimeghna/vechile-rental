import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Car,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Search,
  Filter,
  RefreshCw,
  Phone,
  User,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type BookingStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled";

type PaymentStatus =
  | "paid"
  | "pending"
  | "failed";

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
   SAMPLE BOOKINGS
   Replace this with your API response later.
============================================================ */

const sampleBookings: Booking[] = [
  {
    _id: "booking-001",
    bookingId: "VR-2026-1001",

    vehicle: {
      _id: "vehicle-001",
      name: "Toyota Fortuner",
      brand: "Toyota",
      model: "Fortuner",
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
      location: "Chennai, Tamil Nadu",
    },

    owner: {
      _id: "owner-001",
      name: "Arun Kumar",
      phone: "9876543210",
    },

    pickupDate: "2026-08-20T10:00:00",
    returnDate: "2026-08-23T10:00:00",

    pickupLocation: "Chennai Airport",
    returnLocation: "Chennai Airport",

    totalAmount: 10500,

    bookingStatus: "confirmed",
    paymentStatus: "paid",

    createdAt: "2026-08-18T08:00:00",
  },

  {
    _id: "booking-002",
    bookingId: "VR-2026-1002",

    vehicle: {
      _id: "vehicle-002",
      name: "Hyundai Creta",
      brand: "Hyundai",
      model: "Creta",
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80",
      location: "Chennai, Tamil Nadu",
    },

    owner: {
      _id: "owner-002",
      name: "Priya Motors",
      phone: "9123456789",
    },

    pickupDate: "2026-08-12T09:00:00",
    returnDate: "2026-08-14T09:00:00",

    pickupLocation: "T Nagar",
    returnLocation: "T Nagar",

    totalAmount: 5000,

    bookingStatus: "completed",
    paymentStatus: "paid",

    createdAt: "2026-08-10T12:00:00",
  },

  {
    _id: "booking-003",
    bookingId: "VR-2026-1003",

    vehicle: {
      _id: "vehicle-003",
      name: "Honda City",
      brand: "Honda",
      model: "City",
      image:
        "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80",
      location: "Coimbatore, Tamil Nadu",
    },

    pickupDate: "2026-09-02T10:00:00",
    returnDate: "2026-09-05T10:00:00",

    pickupLocation: "Coimbatore Railway Station",
    returnLocation: "Coimbatore Railway Station",

    totalAmount: 7500,

    bookingStatus: "pending",
    paymentStatus: "pending",

    createdAt: "2026-08-17T15:00:00",
  },

  {
    _id: "booking-004",
    bookingId: "VR-2026-1004",

    vehicle: {
      _id: "vehicle-004",
      name: "Mahindra Thar",
      brand: "Mahindra",
      model: "Thar",
      image:
        "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=900&q=80",
      location: "Bangalore, Karnataka",
    },

    pickupDate: "2026-07-20T10:00:00",
    returnDate: "2026-07-23T10:00:00",

    pickupLocation: "Bangalore Airport",
    returnLocation: "Bangalore Airport",

    totalAmount: 9000,

    bookingStatus: "cancelled",
    paymentStatus: "failed",

    createdAt: "2026-07-18T11:00:00",
  },
];

/* ============================================================
   HELPERS
============================================================ */

const formatDate = (
  dateString: string
): string => {
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

const formatDateTime = (
  dateString: string
): string => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (
  amount: number
): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/* ============================================================
   STATUS BADGE
============================================================ */

const BookingStatusBadge = ({
  status,
}: {
  status: BookingStatus;
}) => {
  const config = {
    confirmed: {
      label: "Confirmed",
      className:
        "bg-green-50 text-green-700 border-green-200",
      icon: <CheckCircle2 size={14} />,
    },

    pending: {
      label: "Pending",
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: <Clock size={14} />,
    },

    completed: {
      label: "Completed",
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
      icon: <CheckCircle2 size={14} />,
    },

    cancelled: {
      label: "Cancelled",
      className:
        "bg-red-50 text-red-700 border-red-200",
      icon: <XCircle size={14} />,
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${current.className}`}
    >
      {current.icon}
      {current.label}
    </span>
  );
};

/* ============================================================
   PAYMENT BADGE
============================================================ */

const PaymentStatusBadge = ({
  status,
}: {
  status: PaymentStatus;
}) => {
  const config = {
    paid: {
      label: "Paid",
      className:
        "bg-green-50 text-green-700",
    },

    pending: {
      label: "Payment Pending",
      className:
        "bg-yellow-50 text-yellow-700",
    },

    failed: {
      label: "Payment Failed",
      className:
        "bg-red-50 text-red-700",
    },
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

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function MyBookings() {
  const [bookings, setBookings] =
    useState<Booking[]>(sampleBookings);

  const [activeFilter, setActiveFilter] =
    useState<
      "all" | BookingStatus
    >("all");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  /* ==========================================================
     FILTER BOOKINGS
  ========================================================== */

  const filteredBookings =
    useMemo(() => {
      return bookings.filter(
        (booking) => {
          const matchesFilter =
            activeFilter === "all" ||
            booking.bookingStatus ===
              activeFilter;

          const searchValue =
            search.toLowerCase().trim();

          const matchesSearch =
            !searchValue ||
            booking.vehicle.name
              .toLowerCase()
              .includes(searchValue) ||
            booking.bookingId
              .toLowerCase()
              .includes(searchValue) ||
            booking.pickupLocation
              .toLowerCase()
              .includes(searchValue);

          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );
    }, [
      bookings,
      activeFilter,
      search,
    ]);

  /* ==========================================================
     COUNTS
  ========================================================== */

  const counts = useMemo(() => {
    return {
      all: bookings.length,

      confirmed:
        bookings.filter(
          (item) =>
            item.bookingStatus ===
            "confirmed"
        ).length,

      pending:
        bookings.filter(
          (item) =>
            item.bookingStatus ===
            "pending"
        ).length,

      completed:
        bookings.filter(
          (item) =>
            item.bookingStatus ===
            "completed"
        ).length,

      cancelled:
        bookings.filter(
          (item) =>
            item.bookingStatus ===
            "cancelled"
        ).length,
    };
  }, [bookings]);

  /* ==========================================================
     REFRESH
  ========================================================== */

  const handleRefresh = async () => {
    try {
      setLoading(true);

      /*
        Later:

        const response =
          await axiosInstance.get(
            "/bookings/my"
          );

        setBookings(
          response.data.bookings
        );
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );
    } catch (error) {
      console.error(
        "Failed to refresh bookings:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     CANCEL BOOKING
  ========================================================== */

  const handleCancelBooking = async (
    bookingId: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmed) {
      return;
    }

    try {
      /*
        Backend:

        await axiosInstance.put(
          `/bookings/${bookingId}/cancel`
        );
      */

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                bookingStatus:
                  "cancelled",
              }
            : booking
        )
      );
    } catch (error) {
      console.error(
        "Failed to cancel booking:",
        error
      );
    }
  };

  /* ==========================================================
     DOWNLOAD RECEIPT
  ========================================================== */

  const handleDownloadReceipt = (
    booking: Booking
  ) => {
    /*
      Later connect this to your backend:

      window.open(
        `${API_URL}/bookings/${booking._id}/receipt`,
        "_blank"
      );
    */

    alert(
      `Receipt for ${booking.bookingId} will be available here.`
    );
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        =================================================== */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-black text-slate-900">
              My Bookings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all your vehicle rentals.
            </p>

          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

        {/* ==================================================
            STAT CARDS
        =================================================== */}

        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-5">

          <button
            type="button"
            onClick={() =>
              setActiveFilter("all")
            }
            className={`rounded-2xl border p-4 text-left transition ${
              activeFilter === "all"
                ? "border-blue-300 bg-blue-50"
                : "border-slate-200 bg-white hover:border-blue-200"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Total
            </p>

            <p className="mt-2 text-2xl font-black text-slate-900">
              {counts.all}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveFilter("confirmed")
            }
            className={`rounded-2xl border p-4 text-left transition ${
              activeFilter ===
              "confirmed"
                ? "border-green-300 bg-green-50"
                : "border-slate-200 bg-white hover:border-green-200"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Confirmed
            </p>

            <p className="mt-2 text-2xl font-black text-green-600">
              {counts.confirmed}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveFilter("pending")
            }
            className={`rounded-2xl border p-4 text-left transition ${
              activeFilter ===
              "pending"
                ? "border-yellow-300 bg-yellow-50"
                : "border-slate-200 bg-white hover:border-yellow-200"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Pending
            </p>

            <p className="mt-2 text-2xl font-black text-yellow-600">
              {counts.pending}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveFilter("completed")
            }
            className={`rounded-2xl border p-4 text-left transition ${
              activeFilter ===
              "completed"
                ? "border-blue-300 bg-blue-50"
                : "border-slate-200 bg-white hover:border-blue-200"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Completed
            </p>

            <p className="mt-2 text-2xl font-black text-blue-600">
              {counts.completed}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveFilter("cancelled")
            }
            className={`col-span-2 rounded-2xl border p-4 text-left transition lg:col-span-1 ${
              activeFilter ===
              "cancelled"
                ? "border-red-300 bg-red-50"
                : "border-slate-200 bg-white hover:border-red-200"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Cancelled
            </p>

            <p className="mt-2 text-2xl font-black text-red-600">
              {counts.cancelled}
            </p>
          </button>

        </div>

        {/* ==================================================
            SEARCH
        =================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by vehicle, booking ID or location..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                ×
              </button>
            )}

          </div>

        </div>

        {/* ==================================================
            BOOKING LIST
        =================================================== */}

        {filteredBookings.length ===
        0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Car size={30} />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-800">
              No bookings found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              {search
                ? "Try changing your search or filter."
                : "You haven't made any vehicle bookings yet."}
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {filteredBookings.map(
              (booking) => (
                <div
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* ========================================
                      TOP
                  ========================================= */}

                  <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex flex-wrap items-center gap-3">

                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
                        {booking.bookingId}
                      </span>

                      <BookingStatusBadge
                        status={
                          booking.bookingStatus
                        }
                      />

                      <PaymentStatusBadge
                        status={
                          booking.paymentStatus
                        }
                      />

                    </div>

                    <p className="text-xs text-slate-400">
                      Booked on{" "}
                      {formatDate(
                        booking.createdAt
                      )}
                    </p>

                  </div>

                  {/* ========================================
                      BODY
                  ========================================= */}

                  <div className="grid lg:grid-cols-[280px_1fr]">

                    {/* Vehicle Image */}

                    <div className="h-56 bg-slate-100 lg:h-full">

                      {booking.vehicle
                        .image ? (
                        <img
                          src={
                            booking
                              .vehicle
                              .image
                          }
                          alt={
                            booking
                              .vehicle
                              .name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <Car
                            size={50}
                          />
                        </div>
                      )}

                    </div>

                    {/* Details */}

                    <div className="p-5 sm:p-6">

                      <div className="flex flex-col gap-5 xl:flex-row xl:justify-between">

                        <div>

                          <h2 className="text-xl font-black text-slate-900">
                            {
                              booking
                                .vehicle
                                .name
                            }
                          </h2>

                          <p className="mt-1 text-sm font-medium text-slate-500">
                            {
                              booking
                                .vehicle
                                .brand
                            }{" "}
                            {
                              booking
                                .vehicle
                                .model
                            }
                          </p>

                          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                            <MapPin
                              size={16}
                              className="text-blue-500"
                            />

                            {
                              booking
                                .vehicle
                                .location
                            }
                          </div>

                        </div>

                        <div className="xl:text-right">

                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Total Amount
                          </p>

                          <p className="mt-1 text-2xl font-black text-slate-900">
                            {formatPrice(
                              booking.totalAmount
                            )}
                          </p>

                        </div>

                      </div>

                      {/* Dates */}

                      <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">

                        <div>

                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                            <CalendarDays
                              size={14}
                            />
                            Pickup
                          </div>

                          <p className="mt-2 text-sm font-bold text-slate-800">
                            {formatDate(
                              booking.pickupDate
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(
                              booking.pickupDate
                            ).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute:
                                  "2-digit",
                              }
                            )}
                          </p>

                          <p className="mt-2 text-xs text-slate-500">
                            {
                              booking.pickupLocation
                            }
                          </p>

                        </div>

                        <div>

                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                            <CalendarDays
                              size={14}
                            />
                            Return
                          </div>

                          <p className="mt-2 text-sm font-bold text-slate-800">
                            {formatDate(
                              booking.returnDate
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(
                              booking.returnDate
                            ).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute:
                                  "2-digit",
                              }
                            )}
                          </p>

                          <p className="mt-2 text-xs text-slate-500">
                            {
                              booking.returnLocation
                            }
                          </p>

                        </div>

                      </div>

                      {/* Owner */}

                      {booking.owner && (
                        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                              <User
                                size={17}
                              />
                            </div>

                            <div>

                              <p className="text-xs text-slate-400">
                                Vehicle Owner
                              </p>

                              <p className="text-sm font-bold text-slate-700">
                                {
                                  booking
                                    .owner
                                    .name
                                }
                              </p>

                            </div>

                          </div>

                          {booking.owner
                            .phone && (
                            <a
                              href={`tel:${booking.owner.phone}`}
                              className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                            >
                              <Phone
                                size={15}
                              />
                              Contact Owner
                            </a>
                          )}

                        </div>
                      )}

                      {/* Actions */}

                      <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedBooking(
                              booking
                            )
                          }
                          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                          <Eye
                            size={16}
                          />
                          View Details
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDownloadReceipt(
                              booking
                            )
                          }
                          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Download
                            size={16}
                          />
                          Receipt
                        </button>

                        {booking.bookingStatus ===
                          "confirmed" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCancelBooking(
                                booking._id
                              )
                            }
                            className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                          >
                            <XCircle
                              size={16}
                            />
                            Cancel Booking
                          </button>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* ======================================================
          DETAILS MODAL
      ======================================================= */}

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white p-5">

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Booking Details
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  {
                    selectedBooking.bookingId
                  }
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedBooking(
                    null
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                ×
              </button>

            </div>

            {/* Modal Body */}

            <div className="space-y-6 p-5">

              {/* Vehicle */}

              <div className="flex gap-4">

                <img
                  src={
                    selectedBooking
                      .vehicle
                      .image
                  }
                  alt={
                    selectedBooking
                      .vehicle
                      .name
                  }
                  className="h-24 w-32 rounded-xl object-cover"
                />

                <div>

                  <h3 className="text-lg font-black text-slate-900">
                    {
                      selectedBooking
                        .vehicle
                        .name
                  }
                  </h3>

                  <p className="text-sm text-slate-500">
                    {
                      selectedBooking
                        .vehicle
                        .brand
                    }{" "}
                    {
                      selectedBooking
                        .vehicle
                        .model
                    }
                  </p>

                  <div className="mt-2">
                    <BookingStatusBadge
                      status={
                        selectedBooking.bookingStatus
                      }
                    />
                  </div>

                </div>

              </div>

              {/* Booking Information */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase text-slate-400">
                    Pickup Date
                  </p>

                  <p className="mt-2 font-bold text-slate-800">
                    {formatDateTime(
                      selectedBooking.pickupDate
                    )}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase text-slate-400">
                    Return Date
                  </p>

                  <p className="mt-2 font-bold text-slate-800">
                    {formatDateTime(
                      selectedBooking.returnDate
                    )}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase text-slate-400">
                    Pickup Location
                  </p>

                  <p className="mt-2 font-bold text-slate-800">
                    {
                      selectedBooking.pickupLocation
                    }
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase text-slate-400">
                    Return Location
                  </p>

                  <p className="mt-2 font-bold text-slate-800">
                    {
                      selectedBooking.returnLocation
                    }
                  </p>

                </div>

              </div>

              {/* Payment */}

              <div className="rounded-xl border border-slate-200 p-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                      <CreditCard
                        size={18}
                      />
                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Payment Status
                      </p>

                      <PaymentStatusBadge
                        status={
                          selectedBooking.paymentStatus
                        }
                      />

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-xs text-slate-400">
                      Total
                    </p>

                    <p className="text-xl font-black text-slate-900">
                      {formatPrice(
                        selectedBooking.totalAmount
                      )}
                    </p>

                  </div>

                </div>

              </div>

              {/* Owner */}

              {selectedBooking.owner && (
                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Vehicle Owner
                  </p>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <User
                          size={18}
                        />
                      </div>

                      <div>

                        <p className="font-bold text-slate-800">
                          {
                            selectedBooking
                              .owner
                              .name
                          }
                        </p>

                        {selectedBooking
                          .owner
                          .phone && (
                          <p className="text-sm text-slate-500">
                            {
                              selectedBooking
                                .owner
                                .phone
                            }
                          </p>
                        )}

                      </div>

                    </div>

                    {selectedBooking
                      .owner
                      .phone && (
                      <a
                        href={`tel:${selectedBooking.owner.phone}`}
                        className="rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700"
                      >
                        <Phone
                          size={17}
                        />
                      </a>
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer */}

            <div className="border-t border-slate-100 p-5">

              <button
                type="button"
                onClick={() =>
                  setSelectedBooking(
                    null
                  )
                }
                className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}