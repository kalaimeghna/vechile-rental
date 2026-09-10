import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Search,
  MapPin,
  Users,
  Fuel,
  Settings,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

import axiosInstance from "../api/axios";
import type { Vehicle } from "../types/vehicle";

// ======================================================
// TYPES
// ======================================================

interface VehiclesResponse {
  vehicles?: Vehicle[];
  data?: Vehicle[];
  message?: string;
}

type AvailabilityFilter = "all" | "available" | "unavailable";

// ======================================================
// HELPERS
// ======================================================

const getVehicleId = (vehicle: Vehicle): string => {
  const item = vehicle as Vehicle & {
    _id?: string;
    id?: string;
  };

  return item._id || item.id || "";
};

const getVehicleName = (vehicle: Vehicle): string => {
  const item = vehicle as Vehicle & {
    name?: string;
    vehicleName?: string;
    brand?: string;
    model?: string;
  };

  if (item.name) {
    return item.name;
  }

  if (item.vehicleName) {
    return item.vehicleName;
  }

  if (item.brand && item.model) {
    return `${item.brand} ${item.model}`;
  }

  if (item.brand) {
    return item.brand;
  }

  if (item.model) {
    return item.model;
  }

  return "Vehicle";
};

const getVehicleBrand = (vehicle: Vehicle): string => {
  const item = vehicle as Vehicle & {
    brand?: string;
  };

  return item.brand || "";
};

const getVehicleModel = (vehicle: Vehicle): string => {
  const item = vehicle as Vehicle & {
    model?: string;
  };

  return item.model || "";
};

const getVehicleImage = (vehicle: Vehicle): string => {
  const item = vehicle as Vehicle & {
    image?: string;
    imageUrl?: string;
    photo?: string;
    thumbnail?: string;
    images?: string[];
    gallery?: string[];
  };

  if (item.image) {
    return item.image;
  }

  if (item.imageUrl) {
    return item.imageUrl;
  }

  if (item.photo) {
    return item.photo;
  }

  if (item.thumbnail) {
    return item.thumbnail;
  }

  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0];
  }

  if (Array.isArray(item.gallery) && item.gallery.length > 0) {
    return item.gallery[0];
  }

  return "";
};

const getVehicleLocation = (vehicle: Vehicle): string => {
  const item = vehicle as Vehicle & {
    location?: string;
    city?: string;
    address?: string;
  };

  return item.location || item.city || item.address || "Location unavailable";
};

const getVehicleCategory = (vehicle: Vehicle): string => {
  const item = vehicle as Vehicle & {
    category?: string;
    vehicleType?: string;
    type?: string;
  };

  return item.category || item.vehicleType || item.type || "Other";
};

const getVehiclePrice = (vehicle: Vehicle): number => {
  const item = vehicle as Vehicle & {
    pricePerDay?: number;
    rentPerDay?: number;
    rentalPrice?: number;
    price?: number;
    dailyRate?: number;
  };

  return Number(
    item.pricePerDay ??
      item.rentPerDay ??
      item.rentalPrice ??
      item.dailyRate ??
      item.price ??
      0,
  );
};

const getVehicleSeats = (vehicle: Vehicle): number => {
  const item = vehicle as Vehicle & {
    seats?: number;
    seatingCapacity?: number;
    capacity?: number;
  };

  return Number(item.seats ?? item.seatingCapacity ?? item.capacity ?? 0);
};

const getVehicleFuel = (vehicle: Vehicle): string => {
  const item = vehicle as Vehicle & {
    fuelType?: string;
    fuel?: string;
  };

  return item.fuelType || item.fuel || "Fuel";
};

const getVehicleTransmission = (vehicle: Vehicle): string => {
  const item = vehicle as Vehicle & {
    transmission?: string;
    transmissionType?: string;
  };

  return item.transmission || item.transmissionType || "Automatic";
};

const isVehicleAvailable = (vehicle: Vehicle): boolean => {
  const item = vehicle as Vehicle & {
    available?: boolean;
    isAvailable?: boolean;
    availability?: boolean | string;
    status?: string;
  };

  if (typeof item.available === "boolean") {
    return item.available;
  }

  if (typeof item.isAvailable === "boolean") {
    return item.isAvailable;
  }

  if (typeof item.availability === "boolean") {
    return item.availability;
  }

  if (typeof item.availability === "string") {
    return item.availability.toLowerCase() === "available";
  }

  if (typeof item.status === "string") {
    return item.status.toLowerCase() === "available";
  }

  // If the backend does not provide availability,
  // consider the vehicle available by default.
  return true;
};

// ======================================================
// COMPONENT
// ======================================================

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");

  // ====================================================
  // FETCH VEHICLES
  // ====================================================

  useEffect(() => {
    let mounted = true;

    const fetchVehicles = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get<VehiclesResponse | Vehicle[]>(
          "/vehicles",
        );

        if (!mounted) {
          return;
        }

        const responseData = response.data;

        if (Array.isArray(responseData)) {
          setVehicles(responseData);
        } else if (Array.isArray(responseData.vehicles)) {
          setVehicles(responseData.vehicles);
        } else if (Array.isArray(responseData.data)) {
          setVehicles(responseData.data);
        } else {
          setVehicles([]);
        }
      } catch (err: unknown) {
        if (!mounted) {
          return;
        }

        console.error("Failed to fetch vehicles:", err);

        setError(
          "Unable to load vehicles. Please check your connection and try again.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchVehicles();

    return () => {
      mounted = false;
    };
  }, []);

  // ====================================================
  // CATEGORIES
  // ====================================================

  const categories = useMemo(() => {
    const categorySet = new Set<string>();

    vehicles.forEach((vehicle) => {
      const vehicleCategory = getVehicleCategory(vehicle);

      if (vehicleCategory && vehicleCategory !== "Other") {
        categorySet.add(vehicleCategory);
      }
    });

    return Array.from(categorySet).sort();
  }, [vehicles]);

  // ====================================================
  // FILTER VEHICLES
  // ====================================================

  const filteredVehicles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const name = getVehicleName(vehicle).toLowerCase();
      const brand = getVehicleBrand(vehicle).toLowerCase();
      const model = getVehicleModel(vehicle).toLowerCase();
      const location = getVehicleLocation(vehicle).toLowerCase();
      const vehicleCategory = getVehicleCategory(vehicle).toLowerCase();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        brand.includes(searchValue) ||
        model.includes(searchValue) ||
        location.includes(searchValue) ||
        vehicleCategory.includes(searchValue);

      const matchesCategory =
        category === "all" ||
        vehicleCategory.toLowerCase() === category.toLowerCase();

      const available = isVehicleAvailable(vehicle);

      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && available) ||
        (availability === "unavailable" && !available);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [vehicles, search, category, availability]);

  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters = (): void => {
    setSearch("");
    setCategory("all");
    setAvailability("all");
  };

  // ====================================================
  // RETRY
  // ====================================================

  const handleRetry = (): void => {
    window.location.reload();
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading vehicles...
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <section className="bg-blue-600 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3">
              <Car className="h-8 w-8" />

              <span className="text-sm font-semibold uppercase tracking-wide text-blue-100">
                Vehicle Rental
              </span>
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Find Your Perfect Vehicle
            </h1>

            <p className="mt-3 text-blue-100">
              Browse available cars and choose the right vehicle for your
              journey.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* FILTER BOX */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="md:col-span-1">
              <label
                htmlFor="vehicle-search"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Search
              </label>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  id="vehicle-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search vehicle, brand, model..."
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="vehicle-category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <select
                id="vehicle-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <label
                htmlFor="vehicle-availability"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Availability
              </label>

              <select
                id="vehicle-availability"
                value={availability}
                onChange={(event) =>
                  setAvailability(event.target.value as AvailabilityFilter)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Vehicles</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Filter summary */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
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

            {(search || category !== "all" || availability !== "all") && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <h2 className="font-semibold text-red-800">
                  Unable to load vehicles
                </h2>

                <p className="mt-1 text-sm text-red-700">{error}</p>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!error && filteredVehicles.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Car className="h-8 w-8 text-gray-400" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              No vehicles found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              We couldn't find any vehicles matching your current search and
              filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* VEHICLES GRID */}
        {!error && filteredVehicles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => {
              const id = getVehicleId(vehicle);
              const name = getVehicleName(vehicle);
              const image = getVehicleImage(vehicle);
              const location = getVehicleLocation(vehicle);
              const vehicleCategory = getVehicleCategory(vehicle);
              const price = getVehiclePrice(vehicle);
              const seats = getVehicleSeats(vehicle);
              const fuel = getVehicleFuel(vehicle);
              const transmission = getVehicleTransmission(vehicle);
              const available = isVehicleAvailable(vehicle);

              return (
                <article
                  key={id || `${name}-${location}`}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* IMAGE */}
                  <div className="relative h-52 bg-gray-100">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Car className="h-16 w-16 text-gray-300" />
                      </div>
                    )}

                    {/* Availability */}
                    <div className="absolute right-3 top-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                        {vehicleCategory}
                      </span>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="p-5">
                    <div className="mb-2">
                      <h2 className="line-clamp-1 text-xl font-bold text-gray-900">
                        {name}
                      </h2>

                      {getVehicleBrand(vehicle) || getVehicleModel(vehicle) ? (
                        <p className="mt-1 text-sm text-gray-500">
                          {getVehicleBrand(vehicle)} {getVehicleModel(vehicle)}
                        </p>
                      ) : null}
                    </div>

                    {/* Location */}
                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 shrink-0" />

                      <span className="line-clamp-1">{location}</span>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-2 border-y border-gray-100 py-4">
                      <div className="text-center">
                        <Users className="mx-auto mb-1 h-4 w-4 text-gray-500" />

                        <p className="text-xs text-gray-500">Seats</p>

                        <p className="mt-0.5 text-sm font-semibold text-gray-800">
                          {seats || "-"}
                        </p>
                      </div>

                      <div className="border-x border-gray-100 text-center">
                        <Fuel className="mx-auto mb-1 h-4 w-4 text-gray-500" />

                        <p className="text-xs text-gray-500">Fuel</p>

                        <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-gray-800">
                          {fuel}
                        </p>
                      </div>

                      <div className="text-center">
                        <Settings className="mx-auto mb-1 h-4 w-4 text-gray-500" />

                        <p className="text-xs text-gray-500">Gear</p>

                        <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-gray-800">
                          {transmission}
                        </p>
                      </div>
                    </div>

                    {/* PRICE + BUTTON */}
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Starting from</p>

                        <p className="mt-1 text-xl font-bold text-blue-600">
                          ₹{price.toLocaleString("en-IN")}
                          <span className="text-xs font-normal text-gray-500">
                            {" "}
                            / day
                          </span>
                        </p>
                      </div>

                      {id ? (
                        <Link
                          to={`/vehicles/${id}`}
                          className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                            available
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "pointer-events-none bg-gray-200 text-gray-500"
                          }`}
                        >
                          {available ? "View Details" : "Unavailable"}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-500"
                        >
                          Details Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Vehicles;
