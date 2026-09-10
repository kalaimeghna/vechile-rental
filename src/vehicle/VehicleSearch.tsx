import { Search, X, MapPin } from "lucide-react";
import { useState } from "react";

interface VehicleSearchProps {
  value?: string;
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export default function VehicleSearch({
  value = "",
  onSearch,
  placeholder = "Search by vehicle, brand, model or location...",
}: VehicleSearchProps) {
  const [searchValue, setSearchValue] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSearchValue(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setSearchValue("");
    onSearch?.("");
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:flex-row md:items-center">
        {/* Location */}
        <div className="hidden items-center gap-2 border-r border-slate-200 px-3 md:flex">
          <MapPin size={19} className="text-blue-600" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Location
            </p>

            <p className="text-sm font-bold text-slate-700">Chennai</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-1 items-center gap-3 px-2">
          <Search size={21} className="flex-shrink-0 text-slate-400" />

          <input
            type="text"
            value={searchValue}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />

          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
