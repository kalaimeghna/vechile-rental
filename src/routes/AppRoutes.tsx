import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

import Home from "../pages/Home";
import Vehicles from "../pages/Vehicles";
import VehicleDetails from "../pages/VehicleDetails";
import About from "../pages/About";
import Contact from "../pages/Contact";
import VehicleBooking from "../pages/VehicleBooking";

import Login from "../auth/Login";
import Register from "../auth/Register";

import UserDashboard from "../user/UserDashboard";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <h1 className="text-3xl font-black">{title}</h1>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/:id" element={<VehicleDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/vehicles/:id/book" element={<VehicleBooking />} />
            <Route
              path="/user/bookings"
              element={<Placeholder title="My Bookings" />}
            />
            <Route
              path="/user/profile"
              element={<Placeholder title="Profile" />}
            />
            <Route
              path="/favorites"
              element={<Placeholder title="Favorites" />}
            />
          </Route>
        </Route>

        {/* Owner */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={["owner"]} />}>
            <Route
              path="/owner/dashboard"
              element={<Placeholder title="Owner Dashboard" />}
            />
            <Route
              path="/owner/vehicles"
              element={<Placeholder title="My Vehicles" />}
            />
            <Route
              path="/owner/add-vehicle"
              element={<Placeholder title="Add Vehicle" />}
            />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route
              path="/admin/dashboard"
              element={<Placeholder title="Admin Dashboard" />}
            />
            <Route
              path="/admin/users"
              element={<Placeholder title="Users" />}
            />
            <Route
              path="/admin/vehicles"
              element={<Placeholder title="Vehicles" />}
            />
            <Route
              path="/admin/bookings"
              element={<Placeholder title="Bookings" />}
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={<Placeholder title="404 - Page Not Found" />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default AppRoutes;
