import { Link } from "react-router-dom";
import { CalendarCheck, Car, Heart, Clock } from "lucide-react";
import { useAppSelector } from "../hooks/redux";

const UserDashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-black">Welcome, {user?.name}</h1>

        <p className="mt-2 text-slate-500">
          Manage your vehicle rentals from one place.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: CalendarCheck,
              title: "Bookings",
              value: "0",
            },
            {
              icon: Car,
              title: "Active Rentals",
              value: "0",
            },
            {
              icon: Heart,
              title: "Favorites",
              value: "0",
            },
            {
              icon: Clock,
              title: "Pending",
              value: "0",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-2xl border bg-white p-6">
                <Icon className="text-blue-600" size={25} />

                <p className="mt-5 text-sm text-slate-500">{item.title}</p>

                <p className="mt-1 text-3xl font-black">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-8">
          <h2 className="text-xl font-bold">Ready for your next trip?</h2>

          <p className="mt-2 text-slate-500">
            Browse our vehicles and find the perfect ride.
          </p>

          <Link
            to="/vehicles"
            className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
          >
            Browse Vehicles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
