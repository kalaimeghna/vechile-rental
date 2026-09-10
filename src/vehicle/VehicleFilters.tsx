import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { VehicleType, FuelType, Transmission } from "../../types";

export interface VehicleFilterValues {
  vehicleType: VehicleType | "all";
  fuelType: FuelType | "all";
  transmission: Transmission | "all";
  minPrice: string;
  maxPrice: string;
  seats: string;
  sortBy: "default" | "price-low" | "price-high" | "newest";
}

interface VehicleFiltersProps {
  filters: VehicleFilterValues;
  onChange: (filters: VehicleFilterValues) => void;
  onReset: () => void;
}

export default function VehicleFilters({
  filters,
  onChange,
  onReset,
}: VehicleFiltersProps) {
  const updateFilter = (key: keyof VehicleFilterValues, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <SlidersHorizontal size={19} />
          </div>

          <div>
            <h2 className="font-black text-slate-900">Filters</h2>

            <p className="text-xs text-slate-500">Find your perfect vehicle</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>

      <div className="space-y-6">
        {/* Vehicle Type */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Vehicle Type
          </label>

          <select
            value={filters.vehicleType}
            onChange={(e) => updateFilter("vehicleType", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All Vehicles</option>
            <option value="car">Cars</option>
            <option value="bike">Bikes</option>
            <option value="suv">SUVs</option>
            <option value="van">Vans</option>
            <option value="luxury">Luxury</option>
            <option value="truck">Trucks</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Fuel Type
          </label>

          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "all", label: "All" },
              { value: "petrol", label: "Petrol" },
              { value: "diesel", label: "Diesel" },
              { value: "electric", label: "Electric" },
              { value: "hybrid", label: "Hybrid" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => updateFilter("fuelType", item.value)}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  filters.fuelType === item.value
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Transmission
          </label>

          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "all", label: "All" },
              { value: "manual", label: "Manual" },
              { value: "automatic", label: "Auto" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => updateFilter("transmission", item.value)}
                className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                  filters.transmission === item.value
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Price Per Day
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-400">
                Minimum
              </label>

              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                placeholder="₹0"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400">
                Maximum
              </label>

              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                placeholder="₹10000"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Seats */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Seats
          </label>

          <select
            value={filters.seats}
            onChange={(e) => updateFilter("seats", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Any number of seats</option>
            <option value="2">2+ Seats</option>
            <option value="4">4+ Seats</option>
            <option value="5">5+ Seats</option>
            <option value="7">7+ Seats</option>
            <option value="8">8+ Seats</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Sort By
          </label>

          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="default">Recommended</option>

            <option value="price-low">Price: Low to High</option>

            <option value="price-high">Price: High to Low</option>

            <option value="newest">Newest Vehicles</option>
          </select>
        </div>
      </div>
    </div>
  );
}
