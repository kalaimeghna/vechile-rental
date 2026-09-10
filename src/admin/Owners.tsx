import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Users,
  Car,
  CheckCircle2,
  XCircle,
  Clock3,
  Mail,
  Phone,
  MapPin,
  X,
} from "lucide-react";

import axiosInstance from "../api/axios";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";

// =========================================================
// TYPES
// =========================================================

interface Owner {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  avatar?: string;
  location?: string;
  address?: string;
  role?: string;
  status?: string;
  isActive?: boolean;
  verified?: boolean;
  isVerified?: boolean;
  vehicleCount?: number;
  totalVehicles?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

interface ApiError {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
  };
  message?: string;
}

interface OwnersResponse {
  owners?: Owner[];
  users?: Owner[];
  data?: Owner[];
  results?: Owner[];
}

interface OwnerStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface OwnerDetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

// =========================================================
// ERROR HELPER
// =========================================================

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null) {
    const apiError = error as ApiError;

    const responseMessage = apiError.response?.data?.message;

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }

    const responseError = apiError.response?.data?.error;

    if (typeof responseError === "string" && responseError.trim()) {
      return responseError;
    }

    if (typeof apiError.message === "string" && apiError.message.trim()) {
      return apiError.message;
    }
  }

  return fallback;
};

// =========================================================
// RESPONSE HELPER
// =========================================================

const extractOwners = (data: unknown): Owner[] => {
  if (Array.isArray(data)) {
    return data as Owner[];
  }

  if (typeof data !== "object" || data === null) {
    return [];
  }

  const responseData = data as OwnersResponse;

  if (Array.isArray(responseData.owners)) {
    return responseData.owners;
  }

  if (Array.isArray(responseData.users)) {
    return responseData.users;
  }

  if (Array.isArray(responseData.data)) {
    return responseData.data;
  }

  if (Array.isArray(responseData.results)) {
    return responseData.results;
  }

  return [];
};

// =========================================================
// HELPERS
// =========================================================

const getOwnerName = (owner: Owner): string => {
  return owner.name?.trim() || "Unnamed Owner";
};

const getOwnerEmail = (owner: Owner): string => {
  return owner.email?.trim() || "No email";
};

const getOwnerPhone = (owner: Owner): string => {
  return owner.phone?.trim() || "Not provided";
};

const getOwnerLocation = (owner: Owner): string => {
  return owner.location?.trim() || owner.address?.trim() || "Not provided";
};

const getOwnerStatus = (owner: Owner): string => {
  if (owner.status?.trim()) {
    return owner.status.toLowerCase().trim();
  }

  if (owner.isActive === false) {
    return "inactive";
  }

  return "active";
};

const getVehicleCount = (owner: Owner): number => {
  const count = owner.vehicleCount ?? owner.totalVehicles ?? 0;

  const numericCount = Number(count);

  return Number.isFinite(numericCount) ? numericCount : 0;
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

const Owners: React.FC = () => {
  const [owners, setOwners] = useState<Owner[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  const [deleteOwner, setDeleteOwner] = useState<Owner | null>(null);

  const [deleting, setDeleting] = useState<boolean>(false);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  // =======================================================
  // FETCH OWNERS
  // =======================================================

  const loadOwners = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      try {
        const response = await axiosInstance.get("/owners");

        const ownerList = extractOwners(response.data);

        setOwners(ownerList);
      } catch (ownersError: unknown) {
        console.warn(
          "GET /owners failed. Trying /users?role=owner",
          ownersError,
        );

        const response = await axiosInstance.get("/users", {
          params: {
            role: "owner",
          },
        });

        const ownerList = extractOwners(response.data);

        setOwners(ownerList);
      }
    } catch (error: unknown) {
      console.error("Fetch owners error:", error);

      setError(getErrorMessage(error, "Unable to load owners."));
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // INITIAL FETCH
  // =======================================================

  useEffect(() => {
    let mounted = true;

    const loadInitialOwners = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        let ownerList: Owner[] = [];

        try {
          const response = await axiosInstance.get("/owners");

          ownerList = extractOwners(response.data);
        } catch (ownersError: unknown) {
          console.warn(
            "GET /owners failed. Trying /users?role=owner",
            ownersError,
          );

          const response = await axiosInstance.get("/users", {
            params: {
              role: "owner",
            },
          });

          ownerList = extractOwners(response.data);
        }

        if (mounted) {
          setOwners(ownerList);
        }
      } catch (error: unknown) {
        console.error("Fetch owners error:", error);

        if (mounted) {
          setError(getErrorMessage(error, "Unable to load owners."));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadInitialOwners();

    return () => {
      mounted = false;
    };
  }, []);

  // =======================================================
  // REFRESH
  // =======================================================

  const handleRefresh = async (): Promise<void> => {
    try {
      setRefreshing(true);
      await loadOwners();
    } finally {
      setRefreshing(false);
    }
  };

  // =======================================================
  // FILTER
  // =======================================================

  const filteredOwners = useMemo<Owner[]>(() => {
    const value = search.trim().toLowerCase();

    return owners.filter((owner) => {
      const status = getOwnerStatus(owner);

      if (statusFilter !== "all") {
        if (
          statusFilter === "pending" &&
          status !== "pending" &&
          status !== "pending_verification"
        ) {
          return false;
        }

        if (statusFilter !== "pending" && status !== statusFilter) {
          return false;
        }
      }

      if (!value) {
        return true;
      }

      const searchable = [
        owner._id,
        owner.name,
        owner.email,
        owner.phone,
        owner.location,
        owner.address,
      ]
        .filter((item): item is string => Boolean(item))
        .join(" ")
        .toLowerCase();

      return searchable.includes(value);
    });
  }, [owners, search, statusFilter]);

  // =======================================================
  // SUMMARY
  // =======================================================

  const summary = useMemo(() => {
    const total = owners.length;

    const active = owners.filter(
      (owner) => getOwnerStatus(owner) === "active",
    ).length;

    const inactive = owners.filter(
      (owner) => getOwnerStatus(owner) === "inactive",
    ).length;

    const verified = owners.filter(
      (owner) => owner.verified === true || owner.isVerified === true,
    ).length;

    const vehicles = owners.reduce(
      (totalVehicles, owner) => totalVehicles + getVehicleCount(owner),
      0,
    );

    return {
      total,
      active,
      inactive,
      verified,
      vehicles,
    };
  }, [owners]);

  // =======================================================
  // DELETE OWNER
  // =======================================================

  const handleDelete = async (): Promise<void> => {
    if (!deleteOwner) {
      return;
    }

    try {
      setDeleting(true);

      await axiosInstance.delete(`/owners/${deleteOwner._id}`);

      setOwners((currentOwners) =>
        currentOwners.filter((owner) => owner._id !== deleteOwner._id),
      );

      setDeleteOwner(null);
    } catch (error: unknown) {
      console.error("Delete owner error:", error);

      alert(getErrorMessage(error, "Unable to delete owner."));
    } finally {
      setDeleting(false);
    }
  };

  // =======================================================
  // STATUS UI
  // =======================================================

  const renderStatus = (owner: Owner): React.ReactNode => {
    const status = getOwnerStatus(owner);

    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Active
        </span>
      );
    }

    if (status === "pending" || status === "pending_verification") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
          <Clock3 className="h-3.5 w-3.5" />
          Pending
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
        <XCircle className="h-3.5 w-3.5" />
        Inactive
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
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
            <Users className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Owners</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage vehicle owners registered on the platform.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void handleRefresh();
            }}
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
      </div>

      {/* =================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => {
                void handleRefresh();
              }}
              className="text-sm font-semibold text-red-700 hover:text-red-900"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          STAT CARDS
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <OwnerStatCard
          title="Total Owners"
          value={summary.total.toLocaleString("en-IN")}
          subtitle="Registered owners"
          icon={<Users className="h-6 w-6" />}
        />

        <OwnerStatCard
          title="Active Owners"
          value={summary.active.toLocaleString("en-IN")}
          subtitle="Currently active"
          icon={<CheckCircle2 className="h-6 w-6" />}
        />

        <OwnerStatCard
          title="Verified Owners"
          value={summary.verified.toLocaleString("en-IN")}
          subtitle="Verified accounts"
          icon={<CheckCircle2 className="h-6 w-6" />}
        />

        <OwnerStatCard
          title="Total Vehicles"
          value={summary.vehicles.toLocaleString("en-IN")}
          subtitle="Listed by owners"
          icon={<Car className="h-6 w-6" />}
        />
      </div>

      {/* =================================================
          FILTER
      ================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* SEARCH */}

          <div className="md:col-span-2">
            <label
              htmlFor="owner-search"
              className="mb-1.5 block text-xs font-medium text-gray-600"
            >
              Search Owners
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                id="owner-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, phone or location..."
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  pl-10
                  pr-3
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>
          </div>

          {/* STATUS */}

          <div>
            <label
              htmlFor="owner-status"
              className="mb-1.5 block text-xs font-medium text-gray-600"
            >
              Status
            </label>

            <select
              id="owner-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="
                h-11
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                text-sm
                outline-none
                focus:border-blue-500
              "
            >
              <option value="all">All Owners</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* =================================================
          OWNER TABLE
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <div>
            <h2 className="font-semibold text-gray-900">Owners List</h2>

            <p className="mt-1 text-xs text-gray-500">
              Showing {filteredOwners.length} of {owners.length} owners
            </p>
          </div>

          <UserPlus className="h-5 w-5 text-gray-400" />
        </div>

        {filteredOwners.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-300" />

            <h3 className="mt-4 text-base font-semibold text-gray-800">
              No owners found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Owner
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Vehicles
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Joined
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOwners.map((owner) => (
                  <tr key={owner._id} className="transition hover:bg-gray-50">
                    {/* OWNER */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {owner.profilePicture || owner.avatar ? (
                          <img
                            src={owner.profilePicture || owner.avatar}
                            alt={getOwnerName(owner)}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                            {getOwnerName(owner).charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {getOwnerName(owner)}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            ID: {owner._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}

                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />

                          <span>{getOwnerEmail(owner)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />

                          <span>{getOwnerPhone(owner)}</span>
                        </div>
                      </div>
                    </td>

                    {/* LOCATION */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />

                        <span className="max-w-[160px] truncate">
                          {getOwnerLocation(owner)}
                        </span>
                      </div>
                    </td>

                    {/* VEHICLES */}

                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                        <Car className="h-4 w-4 text-blue-600" />

                        <span className="text-sm font-semibold text-blue-700">
                          {getVehicleCount(owner)}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">{renderStatus(owner)}</td>

                    {/* JOINED */}

                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">
                        {formatDate(owner.createdAt)}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          title="View owner"
                          onClick={() => setSelectedOwner(owner)}
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-gray-200
                            text-gray-600
                            transition
                            hover:bg-blue-50
                            hover:text-blue-600
                          "
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          title="Edit owner"
                          onClick={() =>
                            alert(
                              "Connect this button to your Edit Owner page.",
                            )
                          }
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-gray-200
                            text-gray-600
                            transition
                            hover:bg-gray-100
                            hover:text-gray-900
                          "
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          title="Delete owner"
                          onClick={() => setDeleteOwner(owner)}
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-red-200
                            text-red-500
                            transition
                            hover:bg-red-50
                            hover:text-red-700
                          "
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =================================================
          VIEW OWNER MODAL
      ================================================== */}

      {selectedOwner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setSelectedOwner(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Owner Details
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Owner account information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOwner(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* BODY */}

            <div className="space-y-5 p-6">
              {/* PROFILE */}

              <div className="flex items-center gap-4">
                {selectedOwner.profilePicture || selectedOwner.avatar ? (
                  <img
                    src={selectedOwner.profilePicture || selectedOwner.avatar}
                    alt={getOwnerName(selectedOwner)}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                    {getOwnerName(selectedOwner).charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {getOwnerName(selectedOwner)}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {getOwnerEmail(selectedOwner)}
                  </p>

                  <div className="mt-2">{renderStatus(selectedOwner)}</div>
                </div>
              </div>

              {/* DETAILS */}

              <div className="space-y-3">
                <OwnerDetailRow
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={getOwnerEmail(selectedOwner)}
                />

                <OwnerDetailRow
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={getOwnerPhone(selectedOwner)}
                />

                <OwnerDetailRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={getOwnerLocation(selectedOwner)}
                />

                <OwnerDetailRow
                  icon={<Car className="h-4 w-4" />}
                  label="Vehicles"
                  value={String(getVehicleCount(selectedOwner))}
                />

                <OwnerDetailRow
                  icon={<Users className="h-4 w-4" />}
                  label="Owner ID"
                  value={selectedOwner._id}
                />

                <OwnerDetailRow
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Joined"
                  value={formatDate(selectedOwner.createdAt)}
                />
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex justify-end border-t border-gray-200 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedOwner(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          DELETE MODAL
      ================================================== */}

      {deleteOwner && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
          onClick={() => !deleting && setDeleteOwner(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-900">
              Delete Owner?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <strong className="text-gray-800">
                {getOwnerName(deleteOwner)}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={deleting}
                onClick={() => setDeleteOwner(null)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={deleting}
                onClick={() => {
                  void handleDelete();
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Delete Owner"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================
// STAT CARD
// =========================================================

const OwnerStatCard: React.FC<OwnerStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
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

      <p className="mt-3 text-xs text-gray-400">{subtitle}</p>
    </div>
  );
};

// =========================================================
// OWNER DETAIL ROW
// =========================================================

const OwnerDetailRow: React.FC<OwnerDetailRowProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500">{label}</p>

        <p className="mt-0.5 break-all text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
};

export default Owners;
