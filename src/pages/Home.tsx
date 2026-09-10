import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  Car,
  ShieldCheck,
  Wallet,
  Search,
  MapPin,
} from "lucide-react";

const Home = () => {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7"
            alt="Luxury vehicle"
            className="h-full w-full object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-slate-950/60" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
              <Car size={16} />
              Your journey starts here
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
              Rent the perfect vehicle for your{" "}
              <span className="text-blue-400">next journey.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Choose from a wide range of reliable cars, SUVs, bikes and premium
              vehicles. Simple booking, flexible rentals and transparent prices.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/vehicles"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white hover:bg-blue-700"
              >
                Explore Vehicles
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur hover:bg-white/20"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* SEARCH BOX */}
          <div className="mt-12 rounded-2xl bg-white p-4 shadow-2xl">
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-slate-200 p-3">
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  LOCATION
                </label>

                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  <input
                    placeholder="Chennai"
                    className="w-full outline-none"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  PICK-UP DATE
                </label>

                <div className="flex items-center gap-2">
                  <CalendarCheck size={18} className="text-blue-600" />
                  <input type="date" className="w-full outline-none" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  RETURN DATE
                </label>

                <div className="flex items-center gap-2">
                  <CalendarCheck size={18} className="text-blue-600" />
                  <input type="date" className="w-full outline-none" />
                </div>
              </div>

              <Link
                to="/vehicles"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-bold text-white hover:bg-blue-700"
              >
                <Search size={18} />
                Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-bold uppercase tracking-widest text-blue-600">
              Why RideRent?
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Everything you need for a smooth rental
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Car,
                title: "Wide Vehicle Selection",
                text: "Choose from cars, SUVs, bikes and premium vehicles.",
              },
              {
                icon: ShieldCheck,
                title: "Verified Vehicles",
                text: "Every vehicle is checked for quality and reliability.",
              },
              {
                icon: Wallet,
                title: "Transparent Pricing",
                text: "Know exactly what you're paying with no hidden costs.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 p-7"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-500">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-white">
              Ready to hit the road?
            </h2>

            <p className="mt-2 text-blue-100">
              Find your perfect vehicle and start your journey today.
            </p>
          </div>

          <Link
            to="/vehicles"
            className="rounded-xl bg-white px-6 py-3 font-bold text-blue-600 hover:bg-slate-100"
          >
            Browse Vehicles
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
