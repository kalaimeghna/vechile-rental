import React from "react";
import { AlertTriangle, ArrowLeft, Car, Home, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl text-center">
        {/* Icon */}

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
          <div className="relative">
            <Car className="h-12 w-12 text-blue-600" />

            <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* 404 */}

        <p className="mt-8 text-7xl font-extrabold tracking-tight text-blue-600 sm:text-8xl">
          404
        </p>

        {/* Heading */}

        <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          Page Not Found
        </h1>

        {/* Description */}

        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
          Sorry, the page you are looking for doesn't exist, has been moved, or
          may no longer be available.
        </p>

        {/* Buttons */}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>

          <Link
            to="/vehicles"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            <Search className="h-4 w-4" />
            Browse Vehicles
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Bottom Card */}

        <div className="mx-auto mt-12 max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <Car className="h-5 w-5 text-blue-600" />

            <span className="font-semibold text-gray-900">
              Vehicle Rental Platform
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Find the perfect vehicle for your next journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
