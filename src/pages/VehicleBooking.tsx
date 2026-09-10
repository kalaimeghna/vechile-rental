import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Vehicle {
  _id: string;
  name: string;
  brand: string;
  model: string;
  pricePerDay: number;
  location: string;
}

export default function VehicleBooking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/vehicles/${id}`,
        );
        setVehicle(response.data.vehicle || response.data);
      } catch {
        setError("Failed to load vehicle details.");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/bookings",
        {
          vehicle: id,
          startTime,
          endTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Booking successful!");
      navigate("/user/bookings");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Booking failed.");
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  if (loading)
    return <div className="text-center py-20 font-bold">Loading...</div>;
  if (error || !vehicle)
    return (
      <div className="text-center py-20 text-red-500 font-bold">
        {error || "Vehicle not found"}
      </div>
    );

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-6">Book: {vehicle.name}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border mb-6">
        <p className="text-gray-600 mb-2">
          Brand: {vehicle.brand} ({vehicle.model})
        </p>
        <p className="text-gray-600 mb-2">Location: {vehicle.location}</p>
        <p className="text-lg font-bold text-blue-600">
          Price: ${vehicle.pricePerDay} / day
        </p>
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Start Time / Date
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            End Time / Date
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}
