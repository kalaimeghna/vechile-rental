import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axios";
import {
  Search,
  Car,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// =======================================================
// TYPES
// =======================================================

interface VehicleOwner {
  _id?: string;
  name?: string;
  email?: string;
}

interface Vehicle {
  _id: string;

  name?: string;
  brand?: string;
  model?: string;

  vehicleType?: string;
  type?: string;
  category?: string;

  registrationNumber?: string;

  location?: string;
  city?: string;

  pricePerDay?: number;
  price?: number;
  rentPerDay?: number;

  images?: string[];
  image?: string;

  status?: string;
  isAvailable?: boolean;
  available?: boolean;

  owner?: VehicleOwner;

  createdAt?: string;
  updatedAt?: string;
}

interface VehiclesResponse {
  vehicles?: Vehicle[];
  data?: Vehicle[];
}

// =======================================================
// ERROR HELPER
// =======================================================

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData
    ) {
      const message = (
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
// COMPONENT
// =======================================================

const Vehicles: React.FC = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");

  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const [error, setError] = useState<string>("");

  const itemsPerPage = 10;

  // =====================================================
  // FETCH VEHICLES
  // =====================================================

  const fetchVehicles = async (showRefresh = false): Promise<void> => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axiosInstance.get<Vehicle[] | VehiclesResponse>(
        "/vehicles",
      );

      const responseData = response.data;

      let vehicleList: Vehicle[] = [];

      if (Array.isArray(responseData)) {
        vehicleList = responseData;
      } else if (Array.isArray(responseData.vehicles)) {
        vehicleList = responseData.vehicles;
      } else if (Array.isArray(responseData.data)) {
        vehicleList = responseData.data;
      }

      setVehicles(vehicleList);
    } catch (error: unknown) {
      console.error("Failed to fetch vehicles:", error);

      setError(
        getErrorMessage(error, "Failed to load vehicles. Please try again."),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadVehicles = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get<Vehicle[] | VehiclesResponse>(
          "/vehicles",
        );

        if (cancelled) {
          return;
        }

        const responseData = response.data;

        let vehicleList: Vehicle[] = [];

        if (Array.isArray(responseData)) {
          vehicleList = responseData;
        } else if (Array.isArray(responseData.vehicles)) {
          vehicleList = responseData.vehicles;
        } else if (Array.isArray(responseData.data)) {
          vehicleList = responseData.data;
        }

        setVehicles(vehicleList);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        console.error("Failed to fetch vehicles:", error);

        setError(
          getErrorMessage(error, "Failed to load vehicles. Please try again."),
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // VEHICLE CATEGORY
  // =====================================================

  const getVehicleCategory = (vehicle: Vehicle): string => {
    return vehicle.category || vehicle.vehicleType || vehicle.type || "Other";
  };

  // =====================================================
  // VEHICLE STATUS
  // =====================================================

  const getVehicleStatus = (vehicle: Vehicle): "active" | "inactive" => {
    if (
      vehicle.status?.toLowerCase() === "inactive" ||
      vehicle.status?.toLowerCase() === "unavailable" ||
      vehicle.isAvailable === false ||
      vehicle.available === false
    ) {
      return "inactive";
    }

    return "active";
  };

  // =====================================================
  // FILTERED VEHICLES
  // =====================================================

  const filteredVehicles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const searchableText = [
        vehicle.name,
        vehicle.brand,
        vehicle.model,
        vehicle.vehicleType,
        vehicle.type,
        vehicle.category,
        vehicle.registrationNumber,
        vehicle.location,
        vehicle.city,
        vehicle.owner?.name,
        vehicle.owner?.email,
      ]
        .filter((value): value is string => typeof value === "string")
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchValue === "" || searchableText.includes(searchValue);

      const category = getVehicleCategory(vehicle).toLowerCase();

      const matchesCategory =
        categoryFilter === "all" || category === categoryFilter.toLowerCase();

      const status = getVehicleStatus(vehicle);

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [vehicles, search, categoryFilter, statusFilter]);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useMemo(() => {
    const categoryList = vehicles
      .map((vehicle) => getVehicleCategory(vehicle))
      .filter((category): category is string => Boolean(category));

    return Array.from(new Set(categoryList));
  }, [vehicles]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredVehicles.length / itemsPerPage),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedVehicles = filteredVehicles.slice(
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
  // CATEGORY
  // =====================================================

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setCategoryFilter(event.target.value);
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
  // CLEAR FILTERS
  // =====================================================

  const handleClearFilters = (): void => {
    setSearch("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // =====================================================
  // DELETE VEHICLE
  // =====================================================

  const handleDeleteVehicle = async (vehicleId: string): Promise<void> => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(vehicleId);

      await axiosInstance.delete(`/vehicles/${vehicleId}`);

      setVehicles((previousVehicles) =>
        previousVehicles.filter((vehicle) => vehicle._id !== vehicleId),
      );

      if (paginatedVehicles.length === 1 && safeCurrentPage > 1) {
        setCurrentPage((page) => Math.max(1, page - 1));
      }
    } catch (error: unknown) {
      console.error("Failed to delete vehicle:", error);

      alert(
        getErrorMessage(error, "Failed to delete vehicle. Please try again."),
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // =====================================================
  // PRICE
  // =====================================================

  const getPrice = (vehicle: Vehicle): string => {
    const price =
      vehicle.pricePerDay ?? vehicle.rentPerDay ?? vehicle.price ?? 0;

    return Number(price).toLocaleString("en-IN");
  };

  // =====================================================
  // DATE
  // =====================================================

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

  // =====================================================
  // IMAGE
  // =====================================================

  const getVehicleImage = (vehicle: Vehicle): string => {
    if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      return vehicle.images[0];
    }

    return vehicle.image || "";
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const renderStatus = (vehicle: Vehicle): React.ReactNode => {
    const status = getVehicleStatus(vehicle);

    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <CheckCircle size={13} />
          Available
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        <XCircle size={13} />
        Unavailable
      </span>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">Loading vehicles...</p>
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
        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage all vehicles available on the platform.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void fetchVehicles(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/vehicles/add")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Vehicle
            </button>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={() => void fetchVehicles()}
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* STATS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* TOTAL */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Vehicles</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {vehicles.length}
                </p>
              </div>

              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <Car size={22} />
              </div>
            </div>
          </div>

          {/* AVAILABLE */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Available</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {
                    vehicles.filter(
                      (vehicle) => getVehicleStatus(vehicle) === "active",
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-lg bg-green-100 p-3 text-green-600">
                <CheckCircle size={22} />
              </div>
            </div>
          </div>

          {/* UNAVAILABLE */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unavailable</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {
                    vehicles.filter(
                      (vehicle) => getVehicleStatus(vehicle) === "inactive",
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-lg bg-red-100 p-3 text-red-600">
                <XCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}

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
                placeholder="Search vehicle, brand, model, location..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* CATEGORY */}

            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Status</option>

              <option value="active">Available</option>

              <option value="inactive">Unavailable</option>
            </select>
          </div>

          {/* FILTER RESULT */}

          {(search || categoryFilter !== "all" || statusFilter !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredVehicles.length}
                </span>{" "}
                vehicles
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

        {/* VEHICLE TABLE */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {paginatedVehicles.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <Car size={36} className="text-gray-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                No vehicles found
              </h3>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                {search || categoryFilter !== "all" || statusFilter !== "all"
                  ? "Try changing your search or filters."
                  : "No vehicles have been added yet."}
              </p>

              {(search ||
                categoryFilter !== "all" ||
                statusFilter !== "all") && (
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
              {/* DESKTOP */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Vehicle
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Location
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Price / Day
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedVehicles.map((vehicle) => {
                      const image = getVehicleImage(vehicle);

                      return (
                        <tr
                          key={vehicle._id}
                          className="transition hover:bg-gray-50"
                        >
                          {/* VEHICLE */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {image ? (
                                <img
                                  src={image}
                                  alt={vehicle.name || "Vehicle"}
                                  className="h-14 w-20 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-gray-100">
                                  <Car size={24} className="text-gray-400" />
                                </div>
                              )}

                              <div>
                                <p className="font-semibold text-gray-900">
                                  {vehicle.name ||
                                    `${vehicle.brand || ""} ${vehicle.model || ""}`.trim() ||
                                    "Unnamed Vehicle"}
                                </p>

                                {(vehicle.brand || vehicle.model) && (
                                  <p className="text-sm text-gray-500">
                                    {vehicle.brand} {vehicle.model}
                                  </p>
                                )}

                                {vehicle.registrationNumber && (
                                  <p className="mt-1 text-xs text-gray-400">
                                    {vehicle.registrationNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* CATEGORY */}

                          <td className="px-6 py-4">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              {getVehicleCategory(vehicle)}
                            </span>
                          </td>

                          {/* LOCATION */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin size={15} />

                              {vehicle.location || vehicle.city || "N/A"}
                            </div>
                          </td>

                          {/* PRICE */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 font-semibold text-gray-900">
                              <IndianRupee size={15} />

                              {getPrice(vehicle)}

                              <span className="font-normal text-gray-400">
                                /day
                              </span>
                            </div>
                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-4">{renderStatus(vehicle)}</td>

                          {/* ACTION */}

                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/admin/vehicles/edit/${vehicle._id}`,
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                              >
                                <Edit size={16} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  void handleDeleteVehicle(vehicle._id)
                                }
                                disabled={deleteLoading === vehicle._id}
                                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                {deleteLoading === vehicle._id ? (
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div className="divide-y divide-gray-100 md:hidden">
                {paginatedVehicles.map((vehicle) => {
                  const image = getVehicleImage(vehicle);

                  return (
                    <div key={vehicle._id} className="p-4">
                      <div className="flex gap-3">
                        {image ? (
                          <img
                            src={image}
                            alt={vehicle.name || "Vehicle"}
                            className="h-20 w-28 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-28 items-center justify-center rounded-lg bg-gray-100">
                            <Car size={25} className="text-gray-400" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {vehicle.name ||
                                  `${vehicle.brand || ""} ${vehicle.model || ""}`.trim() ||
                                  "Unnamed Vehicle"}
                              </h3>

                              <p className="mt-1 text-sm text-gray-500">
                                {getVehicleCategory(vehicle)}
                              </p>
                            </div>

                            {renderStatus(vehicle)}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />

                              {vehicle.location || vehicle.city || "N/A"}
                            </span>

                            <span className="flex items-center gap-1 font-semibold text-gray-800">
                              <IndianRupee size={14} />
                              {getPrice(vehicle)}
                              /day
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/vehicles/edit/${vehicle._id}`)
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                          <Edit size={16} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDeleteVehicle(vehicle._id)}
                          disabled={deleteLoading === vehicle._id}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deleteLoading === vehicle._id ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Delete
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={13} />
                        Added {formatDate(vehicle.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION */}

              <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {filteredVehicles.length === 0 ? 0 : startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-700">
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredVehicles.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {filteredVehicles.length}
                  </span>{" "}
                  vehicles
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
      </div>
    </div>
  );
};

export default Vehicles;
