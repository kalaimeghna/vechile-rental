```tsx
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Car,
  Save,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import axiosInstance from "../../api/axios";

interface VehicleFormData {
  name: string;
  brand: string;
  model: string;
  year: string;
  category: string;
  fuelType: string;
  transmission: string;
  seats: string;
  pricePerDay: string;
  location: string;
  description: string;
  features: string[];
}

const vehicleCategories = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Luxury",
  "Sports",
  "MUV",
  "Convertible",
  "Pickup",
];

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];

const transmissionTypes = ["Manual", "Automatic"];

const availableFeatures = [
  "Air Conditioning",
  "Bluetooth",
  "GPS",
  "USB Charging",
  "Sunroof",
  "Leather Seats",
  "Parking Sensors",
  "Backup Camera",
  "Cruise Control",
  "Apple CarPlay",
  "Android Auto",
];

const EditVehicle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<VehicleFormData>({
    name: "",
    brand: "",
    model: "",
    year: "",
    category: "",
    fuelType: "",
    transmission: "",
    seats: "",
    pricePerDay: "",
    location: "",
    description: "",
    features: [],
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // =========================================================
  // FETCH VEHICLE
  // =========================================================

  useEffect(() => {
    if (!id) {
      setError("Vehicle ID is missing.");
      setLoading(false);
      return;
    }

    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(`/vehicles/${id}`);

      const vehicle =
        response.data?.vehicle ||
        response.data?.data ||
        response.data;

      if (!vehicle) {
        throw new Error("Vehicle not found.");
      }

      setFormData({
        name: vehicle.name || "",
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        year: vehicle.year ? String(vehicle.year) : "",
        category: vehicle.category || "",
        fuelType: vehicle.fuelType || "",
        transmission: vehicle.transmission || "",
        seats: vehicle.seats ? String(vehicle.seats) : "",
        pricePerDay: vehicle.pricePerDay
          ? String(vehicle.pricePerDay)
          : "",
        location: vehicle.location || "",
        description: vehicle.description || "",
        features: Array.isArray(vehicle.features)
          ? vehicle.features
          : [],
      });

      // Support multiple possible image field names
      const images =
        vehicle.images ||
        vehicle.photos ||
        vehicle.imageUrls ||
        [];

      setExistingImages(
        Array.isArray(images)
          ? images.filter((image: unknown) => typeof image === "string")
          : []
      );
    } catch (err: any) {
      console.error("Fetch vehicle error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load vehicle."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // FEATURES
  // =========================================================

  const handleFeatureChange = (feature: string) => {
    setFormData((previous) => {
      const alreadySelected = previous.features.includes(feature);

      return {
        ...previous,
        features: alreadySelected
          ? previous.features.filter((item) => item !== feature)
          : [...previous.features, feature],
      };
    });
  };

  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        return false;
      }

      return true;
    });

    setNewImages((previous) => [...previous, ...validFiles]);

    const previews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setNewImagePreviews((previous) => [
      ...previous,
      ...previews,
    ]);

    e.target.value = "";
  };

  // =========================================================
  // REMOVE EXISTING IMAGE
  // =========================================================

  const removeExistingImage = (index: number) => {
    setExistingImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  // =========================================================
  // REMOVE NEW IMAGE
  // =========================================================

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);

    setNewImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );

    setNewImagePreviews((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      setError("Vehicle ID is missing.");
      return;
    }

    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.name.trim()) {
      setError("Vehicle name is required.");
      return;
    }

    if (!formData.brand.trim()) {
      setError("Brand is required.");
      return;
    }

    if (!formData.model.trim()) {
      setError("Model is required.");
      return;
    }

    if (!formData.year) {
      setError("Year is required.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.fuelType) {
      setError("Please select fuel type.");
      return;
    }

    if (!formData.transmission) {
      setError("Please select transmission type.");
      return;
    }

    if (!formData.seats) {
      setError("Number of seats is required.");
      return;
    }

    if (!formData.pricePerDay) {
      setError("Price per day is required.");
      return;
    }

    if (!formData.location.trim()) {
      setError("Location is required.");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("brand", formData.brand.trim());
      data.append("model", formData.model.trim());
      data.append("year", formData.year);
      data.append("category", formData.category);
      data.append("fuelType", formData.fuelType);
      data.append("transmission", formData.transmission);
      data.append("seats", formData.seats);
      data.append("pricePerDay", formData.pricePerDay);
      data.append("location", formData.location.trim());
      data.append("description", formData.description.trim());

      // Send features
      formData.features.forEach((feature) => {
        data.append("features", feature);
      });

      // Send remaining existing images
      existingImages.forEach((image) => {
        data.append("existingImages", image);
      });

      // Send newly selected images
      newImages.forEach((image) => {
        data.append("images", image);
      });

      const response = await axiosInstance.put(
        `/vehicles/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated vehicle:", response.data);

      setSuccess("Vehicle updated successfully.");

      setTimeout(() => {
        navigate("/owner/vehicles");
      }, 1200);
    } catch (err: any) {
      console.error("Update vehicle error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update vehicle."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-600">
            Loading vehicle...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/owner/vehicles")}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Edit Vehicle
              </h1>

              <p className="text-gray-500 mt-1">
                Update your vehicle information
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-blue-600">
            <Car className="w-6 h-6" />
            <span className="font-medium">
              Vehicle Rental
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Car className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Toyota Fortuner"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Toyota"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>

                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. Fortuner"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturing Year *
                </label>

                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  placeholder="2024"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select category
                  </option>

                  {vehicleCategories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type *
                </label>

                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select fuel type
                  </option>

                  {fuelTypes.map((fuel) => (
                    <option
                      key={fuel}
                      value={fuel}
                    >
                      {fuel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission *
                </label>

                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select transmission
                  </option>

                  {transmissionTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seats */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Seats *
                </label>

                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  placeholder="5"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Per Day (₹) *
                </label>

                <input
                  type="number"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  min="0"
                  placeholder="2500"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Chennai, Tamil Nadu"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your vehicle..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Vehicle Features
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableFeatures.map((feature) => {
                const selected =
                  formData.features.includes(feature);

                return (
                  <label
                    key={feature}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        handleFeatureChange(feature)
                      }
                      className="w-4 h-4 accent-blue-600"
                    />

                    <span className="text-sm text-gray-700">
                      {feature}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Existing Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <ImageIcon className="w-5 h-5 text-blue-600" />

              <h2 className="text-lg font-semibold text-gray-900">
                Vehicle Images
              </h2>
            </div>

            {existingImages.length > 0 && (
              <>
                <p className="text-sm text-gray-500 mb-3">
                  Existing Images
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {existingImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative group"
                    >
                      <img
                        src={image}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-36 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (
                            e.currentTarget as HTMLImageElement
                          ).style.display = "none";
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(index)
                        }
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* New Images */}
            {newImagePreviews.length > 0 && (
              <>
                <p className="text-sm text-gray-500 mb-3">
                  New Images
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {newImagePreviews.map((preview, index) => (
                    <div
                      key={preview}
                      className="relative group"
                    >
                      <img
                        src={preview}
                        alt={`New vehicle ${index + 1}`}
                        className="w-full h-36 object-cover rounded-lg border border-gray-200"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(index)
                        }
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Upload */}
            <label className="flex flex-col items-center justify-center w-full min-h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
              <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />

              <span className="text-sm font-medium text-gray-700">
                Click to upload new images
              </span>

              <span className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG up to 5MB each
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/owner/vehicles")}
              disabled={saving}
              className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Vehicle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;
```
