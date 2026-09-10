```tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Fuel,
  Users,
  Settings2,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
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

  fuelType?: string;

  transmission?: string;

  seats?: number | string;

  pricePerDay?: number | string;

  location?: string;

  description?: string;

  images?: string[];

  photos?: string[];

  imageUrls?: string[];

  features?: string[];

  isAvailable?: boolean;

  available?: boolean;

  status?: string;

  createdAt?: string;

  updatedAt?: string;
}

// =========================================================
// COMPONENT
// =========================================================

const MyVehicles: React.FC = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState<string>("");

  const [category, setCategory] = useState<string>("All");

  const [deleteLoading, setDeleteLoading] = useState<string | null>(
    null
  );

  const [showDeleteModal, setShowDeleteModal] =
    useState<boolean>(false);

  const [vehicleToDelete, setVehicleToDelete] =
    useState<Vehicle | null>(null);

  // =========================================================
  // FETCH VEHICLES
  // =========================================================

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/vehicles/my");

      console.log("My vehicles response:", response.data);

      const data =
        response.data?.vehicles ||
        response.data?.data ||
        response.data ||
        [];

      setVehicles(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Fetch vehicles error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load your vehicles."
      );

      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GET IMAGE
  // =========================================================

  const getVehicleImage = (vehicle: Vehicle): string => {
    const images =
      vehicle.images ||
      vehicle.photos ||
      vehicle.imageUrls ||
      [];

    if (Array.isArray(images) && images.length > 0) {
      return images[0];
    }

    return "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80";
  };

  // =========================================================
  // GET VEHICLE NAME
  // =========================================================

  const getVehicleName = (vehicle: Vehicle): string => {
    if (vehicle.name) {
      return vehicle.name;
    }

    const brand = vehicle.brand || "";
    const model = vehicle.model || "";

    const combined = `${brand} ${model}`.trim();

    return combined || "Unnamed Vehicle";
  };

  // =========================================================
  // GET AVAILABILITY
  // =========================================================

  const isVehicleAvailable = (vehicle: Vehicle): boolean => {
    if (typeof vehicle.isAvailable === "boolean") {
      return vehicle.isAvailable;
    }

    if (typeof vehicle.available === "boolean") {
      return vehicle.available;
    }

    if (vehicle.status) {
      return vehicle.status.toLowerCase() === "available";
    }

    return true;
  };

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = useMemo(() => {
    const categorySet = new Set<string>();

    vehicles.forEach((vehicle) => {
      if (vehicle.category) {
        categorySet.add(vehicle.category);
      }
    });

    return ["All", ...Array.from(categorySet).sort()];
  }, [vehicles]);

  // =========================================================
  // FILTER VEHICLES
  // =========================================================

  const filteredVehicles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const vehicleName = getVehicleName(vehicle).toLowerCase();

      const brand = (vehicle.brand || "").toLowerCase();

      const model = (vehicle.model || "").toLowerCase();

      const location = (vehicle.location || "").toLowerCase();

      const vehicleCategory =
        (vehicle.category || "").toLowerCase();

      const matchesSearch =
        !searchValue ||
        vehicleName.includes(searchValue) ||
        brand.includes(searchValue) ||
        model.includes(searchValue) ||
        location.includes(searchValue) ||
        vehicleCategory.includes(searchValue);

      const matchesCategory =
        category === "All" ||
        vehicle.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [vehicles, search, category]);

  // =========================================================
  // DELETE CONFIRMATION
  // =========================================================

  const openDeleteModal = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setShowDeleteModal(false);
    setVehicleToDelete(null);
  };

  // =========================================================
  // DELETE VEHICLE
  // =========================================================

  const handleDelete = async () => {
    if (!vehicleToDelete?._id) {
      return;
    }

    try {
      setDeleteLoading(vehicleToDelete._id);

      await axiosInstance.delete(
        `/vehicles/${vehicleToDelete._id}`
      );

      setVehicles((previous) =>
        previous.filter(
          (vehicle) =>
            vehicle._id !== vehicleToDelete._id
        )
      );

      closeDeleteModal();
    } catch (err: any) {
      console.error("Delete vehicle error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete vehicle."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // =========================================================
  // PRICE
  // =========================================================

  const formatPrice = (
    price: number | string | undefined
  ): string => {
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return "₹0";
    }

    return `₹${numericPrice.toLocaleString("en-IN")}`;
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
            Loading your vehicles...
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
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Car className="w-7 h-7 text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  My Vehicles
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage all your rental vehicles
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/owner/vehicles/create")
            }
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />

            <div className="flex-1">
              <p className="font-medium">
                Something went wrong
              </p>

              <p className="text-sm mt-1">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* =====================================================
            STATS
        ====================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          {/* Total */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Vehicles
                </p>

                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {vehicles.length}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-blue-100">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Available */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Available
                </p>

                <p className="text-2xl font-bold text-green-600 mt-1">
                  {
                    vehicles.filter((vehicle) =>
                      isVehicleAvailable(vehicle)
                    ).length
                  }
                </p>
              </div>

              <div className="p-3 rounded-lg bg-green-100">
                <Car className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Unavailable */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Unavailable
                </p>

                <p className="text-2xl font-bold text-red-600 mt-1">
                  {
                    vehicles.filter(
                      (vehicle) =>
                        !isVehicleAvailable(vehicle)
                    ).length
                  }
                </p>
              </div>

              <div className="p-3 rounded-lg bg-red-100">
                <Car className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SEARCH + FILTER
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
                  setSearch(e.target.value)
                }
                placeholder="Search by vehicle, brand, model or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div className="relative md:w-56">
              <Settings2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchMyVehicles}
              className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              title="Refresh vehicles"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="md:hidden">
                Refresh
              </span>
            </button>
          </div>
        </div>

        {/* =====================================================
            RESULT COUNT
        ====================================================== */}

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredVehicles.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {vehicles.length}
            </span>{" "}
            vehicles
          </p>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredVehicles.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm py-16 px-6 text-center">

            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <Car className="w-10 h-10 text-gray-400" />
            </div>

            {vehicles.length === 0 ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900">
                  No vehicles yet
                </h2>

                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  You haven't added any vehicles yet.
                  Add your first vehicle to start renting
                  it out.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/owner/vehicles/create"
                    )
                  }
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Vehicle
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900">
                  No vehicles found
                </h2>

                <p className="text-gray-500 mt-2">
                  Try changing your search or category
                  filter.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                  className="mt-5 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          /* ===================================================
             VEHICLE GRID
          ==================================================== */

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredVehicles.map((vehicle) => {
              const available =
                isVehicleAvailable(vehicle);

              return (
                <div
                  key={vehicle._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition"
                >

                  {/* Image */}
                  <div className="relative h-56 bg-gray-100">

                    <img
                      src={getVehicleImage(vehicle)}
                      alt={getVehicleName(vehicle)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (
                          e.currentTarget as HTMLImageElement
                        ).src =
                          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80";
                      }}
                    />

                    {/* Status */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
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

                    {/* Category */}
                    {vehicle.category && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-medium">
                          {vehicle.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">

                    {/* Name */}
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-900 truncate">
                        {getVehicleName(vehicle)}
                      </h2>

                      {vehicle.year && (
                        <p className="text-sm text-gray-500 mt-1">
                          {vehicle.brand}{" "}
                          {vehicle.model} •{" "}
                          {vehicle.year}
                        </p>
                      )}
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 mb-4">

                      {/* Fuel */}
                      {vehicle.fuelType && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Fuel className="w-4 h-4 text-blue-500" />

                          <span>
                            {vehicle.fuelType}
                          </span>
                        </div>
                      )}

                      {/* Seats */}
                      {vehicle.seats && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-blue-500" />

                          <span>
                            {vehicle.seats} Seats
                          </span>
                        </div>
                      )}

                      {/* Transmission */}
                      {vehicle.transmission && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Settings2 className="w-4 h-4 text-blue-500" />

                          <span className="truncate">
                            {vehicle.transmission}
                          </span>
                        </div>
                      )}

                      {/* Location */}
                      {vehicle.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-blue-500 shrink-0" />

                          <span className="truncate">
                            {vehicle.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-end justify-between border-t border-gray-100 pt-4">

                      <div>
                        <p className="text-xs text-gray-500">
                          Rental Price
                        </p>

                        <p className="text-xl font-bold text-blue-600">
                          {formatPrice(
                            vehicle.pricePerDay
                          )}
                          <span className="text-sm font-normal text-gray-500">
                            {" "}
                            / day
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-2 mt-5">

                      {/* View */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/vehicles/${vehicle._id}`
                          )
                        }
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/owner/vehicles/edit/${vehicle._id}`
                          )
                        }
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          openDeleteModal(vehicle)
                        }
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =======================================================
          DELETE MODAL
      ======================================================== */}

      {showDeleteModal && vehicleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

            {/* Icon */}
            <div className="mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 text-center">
              Delete Vehicle?
            </h2>

            <p className="text-gray-500 text-center mt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {getVehicleName(vehicleToDelete)}
              </span>
              ?
            </p>

            <p className="text-sm text-red-600 text-center mt-2">
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={!!deleteLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={!!deleteLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVehicles;
```
