import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Car,
  Loader2,
  AlertCircle,
} from "lucide-react";

import axiosInstance from "../api/axios";

// =========================================================
// TYPES
// =========================================================

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginUser {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  token?: string;
}

interface LoginResponse {
  message?: string;
  token?: string;
  accessToken?: string;
  user?: LoginUser;
  data?: {
    token?: string;
    accessToken?: string;
    user?: LoginUser;
  };
}

interface ApiErrorData {
  message?: string;
  error?: string;
}

interface AxiosLikeError {
  response?: {
    status?: number;
    data?: ApiErrorData;
  };
  message?: string;
}

// =========================================================
// ERROR HELPER
// =========================================================

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const possibleError = error as AxiosLikeError;

    const responseMessage = possibleError.response?.data?.message;

    const responseError = possibleError.response?.data?.error;

    if (responseMessage) {
      return responseMessage;
    }

    if (responseError) {
      return responseError;
    }

    if (possibleError.message) {
      return possibleError.message;
    }
  }

  return fallback;
};

// =========================================================
// LOGIN COMPONENT
// =========================================================

const Login: React.FC = () => {
  const navigate = useNavigate();

  // =======================================================
  // STATE
  // =======================================================

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =======================================================
  // HANDLE INPUT CHANGE
  // =======================================================

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =======================================================
  // VALIDATE FORM
  // =======================================================

  const validateForm = (): boolean => {
    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      setError("Please enter your email address.");
      return false;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!password) {
      setError("Please enter your password.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return false;
    }

    return true;
  };

  // =======================================================
  // HANDLE LOGIN
  // =======================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post<LoginResponse>("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const data = response.data;

      // ===================================================
      // GET TOKEN
      // ===================================================

      const token =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken ||
        data.user?.token ||
        data.data?.user?.token;

      // ===================================================
      // GET USER
      // ===================================================

      const user = data.user || data.data?.user;

      // ===================================================
      // CHECK TOKEN
      // ===================================================

      if (!token) {
        setError(
          data.message ||
            "Login failed. Authentication token was not received.",
        );

        return;
      }

      // ===================================================
      // SAVE TOKEN
      // ===================================================

      localStorage.setItem("token", token);

      // ===================================================
      // SAVE USER
      // ===================================================

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // ===================================================
      // GET ROLE
      // ===================================================

      const role = (user?.role || data.data?.user?.role || "customer")
        .toLowerCase()
        .trim();

      localStorage.setItem("role", role);

      // ===================================================
      // REDIRECT BASED ON ROLE
      // ===================================================

      if (role === "admin") {
        navigate("/admin", {
          replace: true,
        });

        return;
      }

      if (
        role === "owner" ||
        role === "vehicleowner" ||
        role === "vehicle_owner" ||
        role === "vehicle-owner"
      ) {
        navigate("/owner", {
          replace: true,
        });

        return;
      }

      // ===================================================
      // CUSTOMER / USER
      // ===================================================

      navigate("/", {
        replace: true,
      });
    } catch (error: unknown) {
      console.error("Login error:", error);

      setError(
        getErrorMessage(error, "Invalid email or password. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="hidden w-1/2 bg-blue-600 lg:flex lg:flex-col lg:justify-between">
          {/* LOGO */}

          <div className="p-10">
            <Link to="/" className="inline-flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                <Car className="h-6 w-6" />
              </div>

              <span className="text-2xl font-bold">Vehicle Rental</span>
            </Link>
          </div>

          {/* HERO TEXT */}

          <div className="px-16 pb-20">
            <h1 className="max-w-xl text-5xl font-bold leading-tight text-white">
              Rent the right vehicle for your journey.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100">
              Find reliable cars, book your vehicle easily, and enjoy a smooth
              rental experience.
            </p>

            {/* STATISTICS */}

            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-bold text-white">100+</p>

                <p className="mt-1 text-sm text-blue-100">Vehicles</p>
              </div>

              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-bold text-white">500+</p>

                <p className="mt-1 text-sm text-blue-100">Customers</p>
              </div>

              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-bold text-white">24/7</p>

                <p className="mt-1 text-sm text-blue-100">Support</p>
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="px-10 pb-8 text-sm text-blue-100">
            © {new Date().getFullYear()} Vehicle Rental Platform
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* MOBILE LOGO */}

            <div className="mb-8 flex justify-center lg:hidden">
              <Link to="/" className="flex items-center gap-3 text-blue-600">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                  <Car className="h-6 w-6" />
                </div>

                <span className="text-2xl font-bold">Vehicle Rental</span>
              </Link>
            </div>

            {/* HEADER */}

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>

              <p className="mt-2 text-sm text-gray-500">
                Login to your Vehicle Rental account.
              </p>
            </div>

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <p className="text-sm leading-5 text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* =================================================
                LOGIN FORM
            ================================================= */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    disabled={loading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* =================================================
                REGISTER
            ================================================= */}

            <div className="mt-7 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* =================================================
                BACK TO HOME
            ================================================= */}

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
