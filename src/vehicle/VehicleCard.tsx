import { Link } from "react-router-dom";
import { Heart, Fuel, Users, Settings2, MapPin } from "lucide-react";
import type { Vehicle } from "../types/vehicle";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addFavorite, removeFavorite } from "../redux/favorite/favoriteSlice";

interface Props {
  vehicle: Vehicle;
}

const VehicleCard = ({ vehicle }: Props) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorite.favorites);
  const isFavorite = favorites.includes(vehicle._id);

  const handleToggleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isFavorite) {
      dispatch(removeFavorite(vehicle._id));
    } else {
      dispatch(addFavorite(vehicle._id));
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={
            vehicle.images?.[0] ||
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
          }
          alt={vehicle.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-4 top-4 rounded-full bg-white/95 p-2.5 shadow transition hover:scale-105"
        >
          <Heart
            size={19}
            className={
              isFavorite ? "fill-red-500 text-red-500" : "text-slate-700"
            }
          />
        </button>

        <div className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-slate-800 shadow">
          {vehicle.vehicleType}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{vehicle.name}</h3>

            <p className="text-sm text-slate-500">
              {vehicle.brand} · {vehicle.model}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xl font-black text-blue-600">
              ₹{vehicle.pricePerDay.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-slate-400">/day</p>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-1 text-sm text-slate-500">
          <MapPin size={15} />
          {vehicle.location}
        </div>

        <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-4 text-xs text-slate-600">
          <div className="flex flex-col items-center gap-1">
            <Fuel size={16} />
            {vehicle.fuelType}
          </div>

          <div className="flex flex-col items-center gap-1">
            <Settings2 size={16} />
            {vehicle.transmission}
          </div>

          <div className="flex flex-col items-center gap-1">
            <Users size={16} />
            {vehicle.seats} Seats
          </div>
        </div>

        <Link
          to={`/vehicles/${vehicle._id}`}
          className="mt-4 block rounded-xl bg-slate-900 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;
