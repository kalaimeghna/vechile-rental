import { useMemo, useState } from "react";
import {
  Heart,
  Search,
  MapPin,
  Star,
  Car,
  Fuel,
  Users,
  Settings2,
  Eye,
  Trash2,
  CalendarDays,
  ArrowRight,
  HeartOff,
  SlidersHorizontal,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

interface Vehicle {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  image?: string;
  location: string;
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  seats: number;
  fuelType: string;
  transmission: string;
  category: string;
  isAvailable: boolean;
  owner?: {
    _id: string;
    name: string;
  };
}

/* ============================================================
   SAMPLE FAVORITES
   Replace this with API data later.
============================================================ */

const sampleFavorites: Vehicle[] = [
  {
    _id: "vehicle-001",
    name: "Toyota Fortuner",
    brand: "Toyota",
    model: "Fortuner",
    year: 2025,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",
    location: "Chennai, Tamil Nadu",
    pricePerDay: 3500,
    rating: 4.8,
    reviewCount: 124,
    seats: 7,
    fuelType: "Diesel",
    transmission: "Automatic",
    category: "SUV",
    isAvailable: true,
    owner: {
      _id: "owner-001",
      name: "Chennai Car Rentals",
    },
  },
  {
    _id: "vehicle-002",
    name: "Hyundai Creta",
    brand: "Hyundai",
    model: "Creta",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80",
    location: "Chennai, Tamil Nadu",
    pricePerDay: 2500,
    rating: 4.6,
    reviewCount: 89,
    seats: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    category: "SUV",
    isAvailable: true,
    owner: {
      _id: "owner-002",
      name: "DriveEasy Rentals",
    },
  },
  {
    _id: "vehicle-003",
    name: "Honda City",
    brand: "Honda",
    model: "City",
    year: 2023,
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1000&q=80",
    location: "Coimbatore, Tamil Nadu",
    pricePerDay: 2200,
    rating: 4.5,
    reviewCount: 76,
    seats: 5,
    fuelType: "Petrol",
    transmission: "Manual",
    category: "Sedan",
    isAvailable: true,
    owner: {
      _id: "owner-003",
      name: "Coimbatore Rentals",
    },
  },
  {
    _id: "vehicle-004",
    name: "Mahindra Thar",
    brand: "Mahindra",
    model: "Thar",
    year: 2025,
    image:
      "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=1000&q=80",
    location: "Bangalore, Karnataka",
    pricePerDay: 3000,
    rating: 4.9,
    reviewCount: 152,
    seats: 4,
    fuelType: "Diesel",
    transmission: "Manual",
    category: "SUV",
    isAvailable: false,
    owner: {
      _id: "owner-004",
      name: "Urban Drive",
    },
  },
];

/* ============================================================
   HELPERS
============================================================ */

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

/* ============================================================
   COMPONENT
============================================================ */

export default function Favorites() {
  const [favorites, setFavorites] = useState<Vehicle[]>(sampleFavorites);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [removingId, setRemovingId] = useState<string | null>(null);

  /* ==========================================================
     CATEGORIES
  ========================================================== */

  const categories = useMemo(() => {
    const values = favorites.map((vehicle) => vehicle.category);
    return ["All", ...Array.from(new Set(values))];
  }, [favorites]);

  /* ==========================================================
     FILTER + SEARCH + SORT
  ========================================================== */

  const filteredFavorites = useMemo(() => {
    let result = favorites.filter((vehicle) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        vehicle.name.toLowerCase().includes(searchValue) ||
        vehicle.brand.toLowerCase().includes(searchValue) ||
        vehicle.location.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All" || vehicle.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.pricePerDay - b.pricePerDay);
    }

    if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.pricePerDay - a.pricePerDay);
    }

    if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [favorites, search, category, sortBy]);

  /* ==========================================================
     REMOVE FAVORITE
  ========================================================== */

  const handleRemoveFavorite = async (vehicleId: string) => {
    try {
      setRemovingId(vehicleId);

      /*
         Connect backend here later:

         await axiosInstance.delete(`/favorites/${vehicleId}`);
      */

      await new Promise((resolve) => setTimeout(resolve, 300));

      setFavorites((previous) =>
        previous.filter((vehicle) => vehicle._id !== vehicleId),
      );
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    } finally {
      setRemovingId(null);
    }
  };

  /* ==========================================================
     VIEW VEHICLE
  ========================================================== */

  const handleViewVehicle = (vehicleId: string) => {
    /*
       With React Router:

       navigate(`/vehicles/${vehicleId}`);
    */
    console.log("View vehicle:", vehicleId);
  };

  /* ==========================================================
     BOOK VEHICLE
  ========================================================== */

  const handleBookVehicle = (vehicleId: string) => {
    /*
       With React Router:

       navigate(`/vehicles/${vehicleId}/book`);
    */
    console.log("Book vehicle:", vehicleId);
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
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Heart size={24} fill="currentColor" />
            </div>

            <div>
              <h1 className="text-3xl font-black text-slate-900">
                My Favorites
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {favorites.length}{" "}
                {favorites.length === 1 ? "vehicle" : "vehicles"} saved
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            SEARCH + FILTER
        =================================================== */}

        {favorites.length > 0 && (
          <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search your favorite vehicles..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Category */}
              <div className="relative">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-full min-w-[150px] appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        )}

        {/* ==================================================
            EMPTY STATE
        =================================================== */}

        {favorites.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-400">
              <HeartOff size={34} />
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-800">
              No favorite vehicles
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              You haven't added any vehicles to your favorites yet. Browse
              vehicles and tap the heart icon to save them.
            </p>

            <button
              type="button"
              onClick={() => console.log("Browse vehicles")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Browse Vehicles
              <ArrowRight size={17} />
            </button>
          </div>
        )}

        {/* ==================================================
            NO FILTER RESULTS
        =================================================== */}

        {favorites.length > 0 && filteredFavorites.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Search size={28} />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-800">
              No vehicles found
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Try changing your search or category filter.
            </p>
          </div>
        )}

        {/* ==================================================
            FAVORITE CARDS
        =================================================== */}

        {filteredFavorites.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredFavorites.map((vehicle) => {
              const isRemoving = removingId === vehicle._id;

              return (
                <div
                  key={vehicle._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* ======================================
                      IMAGE
                  ======================================= */}

                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    {vehicle.image ? (
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <Car size={55} />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-slate-700 shadow-sm">
                        {vehicle.category}
                      </span>

                      {/* Remove */}
                      <button
                        type="button"
                        title="Remove from favorites"
                        onClick={() => handleRemoveFavorite(vehicle._id)}
                        disabled={isRemoving}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-sm transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {isRemoving ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
                        ) : (
                          <Heart size={20} fill="currentColor" />
                        )}
                      </button>
                    </div>

                    {/* Availability */}
                    <div className="absolute bottom-4 left-4">
                      {vehicle.isAvailable ? (
                        <span className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                          Available
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-800/90 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                          Currently Unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ======================================
                      CONTENT
                  ======================================= */}

                  <div className="p-5">
                    {/* Vehicle name */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-black text-slate-900">
                          {vehicle.name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          {vehicle.brand} {vehicle.model} • {vehicle.year}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 rounded-lg bg-yellow-50 px-2 py-1">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span className="text-xs font-black text-yellow-700">
                          {vehicle.rating}
                        </span>
                      </div>
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {vehicle.reviewCount} reviews
                    </p>

                    {/* Location */}
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={16} className="shrink-0 text-blue-500" />
                      <span className="truncate">{vehicle.location}</span>
                    </div>

                    {/* Specifications */}
                    <div className="mt-5 grid grid-cols-3 gap-2 border-y border-slate-100 py-4">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Users size={17} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-600">
                          {vehicle.seats} Seats
                        </span>
                      </div>

                      <div className="flex flex-col items-center gap-1 border-x border-slate-100 text-center">
                        <Fuel size={17} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-600">
                          {vehicle.fuelType}
                        </span>
                      </div>

                      <div className="flex flex-col items-center gap-1 text-center">
                        <Settings2 size={17} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-600">
                          {vehicle.transmission}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-black text-slate-900">
                          {formatPrice(vehicle.pricePerDay)}
                        </span>
                        <span className="ml-1 text-xs text-slate-400">
                          / day
                        </span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleViewVehicle(vehicle._id)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        type="button"
                        disabled={!vehicle.isAvailable}
                        onClick={() => handleBookVehicle(vehicle._id)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        <CalendarDays size={16} />
                        Book Now
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFavorite(vehicle._id)}
                      disabled={isRemoving}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      {isRemoving ? "Removing..." : "Remove from Favorites"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
