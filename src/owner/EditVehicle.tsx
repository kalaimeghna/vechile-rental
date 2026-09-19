import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { ArrowLeft, ImagePlus, Loader2, Save, X } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import axiosInstance from "../api/axios";

interface VehicleFormData {
  name: string;
  brand: string;
  model: string;
  type: string;
  description: string;
  pricePerDay: string;
  location: string;
  registrationNumber: string;
  seatingCapacity: string;
  fuelType: string;
  transmission: string;
  year: string;
  available: boolean;
}

interface VehicleResponse {
  _id: string;
  name?: string;
  brand?: string;
  model?: string;
  type?: string;
  description?: string;
  pricePerDay?: number;
  price?: number;
  location?: string;
  registrationNumber?: string;
  seatingCapacity?: number;
  fuelType?: string;
  transmission?: string;
  year?: number;
  available?: boolean;
  image?: string;
  images?: string[];
}

interface ApiResponse {
  vehicle?: VehicleResponse;
  data?: VehicleResponse | VehicleResponse[];
  message?: string;
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

const initialFormData: VehicleFormData = {
  name: "",
  brand: "",
  model: "",
  type: "",
  description: "",
  pricePerDay: "",
  location: "",
  registrationNumber: "",
  seatingCapacity: "",
  fuelType: "",
  transmission: "",
  year: "",
  available: true,
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as AxiosErrorResponse;

    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const getVehicleFromResponse = (data: unknown): VehicleResponse | null => {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const response = data as ApiResponse;

  if (response.vehicle) {
    return response.vehicle;
  }

  if (response.data && !Array.isArray(response.data)) {
    return response.data;
  }

  return null;
};

const EditVehicle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);

  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [newImages, setNewImages] = useState<File[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [saving, setSaving] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const [success, setSuccess] = useState<string>("");

  /*
   * Load vehicle details.
   *
   * Important:
   * We do NOT call setState synchronously at
   * the beginning of the effect.
   *
   * The state updates happen after the API
   * request completes.
   */
  useEffect(() => {
    if (!id) {
      return;
    }

    let active = true;

    const fetchVehicle = async (): Promise<void> => {
      try {
        const response = await axiosInstance.get<unknown>(`/vehicles/${id}`);

        if (!active) {
          return;
        }

        const vehicle = getVehicleFromResponse(response.data);

        if (!vehicle) {
          setError("Vehicle details were not found.");
          setLoading(false);
          return;
        }

        setFormData({
          name: vehicle.name ?? "",
          brand: vehicle.brand ?? "",
          model: vehicle.model ?? "",
          type: vehicle.type ?? "",
          description: vehicle.description ?? "",
          pricePerDay: String(vehicle.pricePerDay ?? vehicle.price ?? ""),
          location: vehicle.location ?? "",
          registrationNumber: vehicle.registrationNumber ?? "",
          seatingCapacity: String(vehicle.seatingCapacity ?? ""),
          fuelType: vehicle.fuelType ?? "",
          transmission: vehicle.transmission ?? "",
          year: String(vehicle.year ?? ""),
          available: vehicle.available !== false,
        });

        const images: string[] = [];

        if (Array.isArray(vehicle.images)) {
          images.push(
            ...vehicle.images.filter(
              (image): image is string =>
                typeof image === "string" && image.trim().length > 0,
            ),
          );
        }

        if (
          typeof vehicle.image === "string" &&
          vehicle.image.trim().length > 0 &&
          !images.includes(vehicle.image)
        ) {
          images.unshift(vehicle.image);
        }

        setExistingImages(images);
        setLoading(false);
      } catch (requestError: unknown) {
        if (!active) {
          return;
        }

        setError(
          getErrorMessage(requestError, "Failed to load vehicle details."),
        );

        setLoading(false);
      }
    };

    void fetchVehicle();

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAvailableChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setFormData((previous) => ({
      ...previous,
      available: event.target.checked,
    }));
  };

  const handleNewImages = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    const selectedFiles = Array.from(files);

    setNewImages((previous) => [...previous, ...selectedFiles]);

    event.target.value = "";
  };

  const removeExistingImage = (image: string): void => {
    setExistingImages((previous) =>
      previous.filter((currentImage) => currentImage !== image),
    );
  };

  const removeNewImage = (index: number): void => {
    setNewImages((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!id) {
      setError("Vehicle ID is missing.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();

      data.append("name", formData.name.trim());

      data.append("brand", formData.brand.trim());

      data.append("model", formData.model.trim());

      data.append("type", formData.type);

      data.append("description", formData.description.trim());

      data.append("pricePerDay", formData.pricePerDay);

      data.append("location", formData.location.trim());

      data.append("registrationNumber", formData.registrationNumber.trim());

      data.append("seatingCapacity", formData.seatingCapacity);

      data.append("fuelType", formData.fuelType);

      data.append("transmission", formData.transmission);

      data.append("year", formData.year);

      data.append("available", String(formData.available));

      /*
       * Existing images that were not removed.
       */
      existingImages.forEach((image) => {
        data.append("existingImages", image);
      });

      /*
       * New images.
       */
      newImages.forEach((file) => {
        data.append("images", file);
      });

      const response = await axiosInstance.put<unknown>(
        `/vehicles/${id}`,
        data,
      );

      const responseData = response.data as ApiResponse;

      setSuccess(responseData.message || "Vehicle updated successfully.");

      window.setTimeout(() => {
        navigate("/owner/vehicles");
      }, 1000);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, "Failed to update vehicle."));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (): void => {
    navigate("/owner/vehicles");
  };

  /*
   * No vehicle ID.
   *
   * This is handled during rendering instead
   * of calling setState from useEffect.
   */
  if (!id) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-700">
            Vehicle ID is missing
          </h2>

          <p className="mt-2 text-sm text-red-600">
            The vehicle could not be identified.
          </p>

          <button
            type="button"
            onClick={() => navigate("/owner/vehicles")}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Back to My Vehicles
          </button>
        </div>
      </div>
    );
  }

  /*
   * Loading screen.
   */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 size={24} className="animate-spin" />

          <span>Loading vehicle details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back to My Vehicles
          </button>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Edit Vehicle
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update your vehicle information, pricing, availability and images.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Vehicle Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Example: Toyota Innova"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Brand */}
              <div>
                <label
                  htmlFor="brand"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Brand
                </label>

                <input
                  id="brand"
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  placeholder="Example: Toyota"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Model */}
              <div>
                <label
                  htmlFor="model"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Model
                </label>

                <input
                  id="model"
                  name="model"
                  type="text"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  placeholder="Example: Innova Crysta"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Vehicle Type
                </label>

                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select vehicle type</option>

                  <option value="car">Car</option>

                  <option value="bike">Bike</option>

                  <option value="suv">SUV</option>

                  <option value="van">Van</option>

                  <option value="truck">Truck</option>

                  <option value="bus">Bus</option>

                  <option value="other">Other</option>
                </select>
              </div>

              {/* Registration */}
              <div>
                <label
                  htmlFor="registrationNumber"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Registration Number
                </label>

                <input
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                  placeholder="TN 01 AB 1234"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Year */}
              <div>
                <label
                  htmlFor="year"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Manufacturing Year
                </label>

                <input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="2024"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
                placeholder="Describe your vehicle..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </section>

          {/* Rental Information */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Rental Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Price */}
              <div>
                <label
                  htmlFor="pricePerDay"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Price Per Day
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    ₹
                  </span>

                  <input
                    id="pricePerDay"
                    name="pricePerDay"
                    type="number"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="1000"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Example: Chennai"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Seating */}
              <div>
                <label
                  htmlFor="seatingCapacity"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Seating Capacity
                </label>

                <input
                  id="seatingCapacity"
                  name="seatingCapacity"
                  type="number"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="5"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Fuel */}
              <div>
                <label
                  htmlFor="fuelType"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Fuel Type
                </label>

                <select
                  id="fuelType"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select fuel type</option>

                  <option value="petrol">Petrol</option>

                  <option value="diesel">Diesel</option>

                  <option value="electric">Electric</option>

                  <option value="hybrid">Hybrid</option>

                  <option value="cng">CNG</option>
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label
                  htmlFor="transmission"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Transmission
                </label>

                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select transmission</option>

                  <option value="manual">Manual</option>

                  <option value="automatic">Automatic</option>

                  <option value="semi-automatic">Semi-Automatic</option>
                </select>
              </div>
            </div>
          </section>

          {/* Availability */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Availability
            </h2>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={handleAvailableChange}
                className="h-5 w-5 rounded border-gray-300"
              />

              <div>
                <p className="font-medium text-gray-800">
                  Vehicle is available for rent
                </p>

                <p className="text-sm text-gray-500">
                  Turn this off if the vehicle is currently unavailable.
                </p>
              </div>
            </label>
          </section>

          {/* Existing Images */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Existing Images
            </h2>

            <p className="mb-5 text-sm text-gray-500">
              Remove any images that you no longer want to display.
            </p>

            {existingImages.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                No existing images.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {existingImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                  >
                    <img
                      src={image}
                      alt={`Vehicle ${index + 1}`}
                      className="h-36 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => removeExistingImage(image)}
                      className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow transition hover:bg-red-700"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* New Images */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Add New Images
            </h2>

            <p className="mb-5 text-sm text-gray-500">
              Select one or more new images for your vehicle.
            </p>

            <label
              htmlFor="images"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50"
            >
              <ImagePlus size={36} className="mb-3 text-gray-400" />

              <span className="font-medium text-gray-700">
                Click to upload images
              </span>

              <span className="mt-1 text-xs text-gray-500">
                PNG, JPG or JPEG
              </span>

              <input
                id="images"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                onChange={handleNewImages}
                className="hidden"
              />
            </label>

            {newImages.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-3 text-sm font-medium text-gray-700">
                  New Images
                </h3>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {newImages.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}-${index}`}
                      className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-36 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow transition hover:bg-red-700"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X size={16} />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-2 py-1 text-xs text-white">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={18} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
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
