import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Fuel,
  MapPin,
  Settings2,
  Users,
} from "lucide-react";

const VehicleDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/vehicles"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to vehicles
        </Link>

        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
          <div className="h-[400px] lg:h-full">
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e"
              alt="Vehicle"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-8 lg:p-12">
            <p className="font-bold uppercase tracking-wider text-blue-600">
              Premium SUV
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-900">BMW X5</h1>

            <p className="mt-2 text-slate-500">BMW · X5 · 2025</p>

            <div className="mt-6 text-3xl font-black text-blue-600">
              ₹3,500
              <span className="text-base font-medium text-slate-400">
                {" "}
                / day
              </span>
            </div>

            <div className="my-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <Fuel className="mb-2 text-blue-600" size={20} />
                <p className="text-xs text-slate-400">Fuel</p>
                <p className="font-bold">Petrol</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <Settings2 className="mb-2 text-blue-600" size={20} />
                <p className="text-xs text-slate-400">Transmission</p>
                <p className="font-bold">Automatic</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <Users className="mb-2 text-blue-600" size={20} />
                <p className="text-xs text-slate-400">Seats</p>
                <p className="font-bold">5</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <MapPin className="mb-2 text-blue-600" size={20} />
                <p className="text-xs text-slate-400">Location</p>
                <p className="font-bold">Chennai</p>
              </div>
            </div>

            <p className="leading-7 text-slate-600">
              Experience a comfortable and premium ride with this
              well-maintained BMW X5. Perfect for business trips, family
              journeys and weekend travel.
            </p>

            <Link
              to={`/vehicles/${id}/book`}
              className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700"
            >
              <CalendarDays size={19} />
              Book This Vehicle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
