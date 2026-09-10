import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  ImagePlus,
  MapPin,
  IndianRupee,
  Fuel,
  Settings2,
  Users,
  FileText,
  X,
} from "lucide-react";

import axiosInstance from "../../api/axios";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

// =========================================================
// TYPES
// =========================================================

interface VehicleFormData {
  name: string;
  brand: string;
  model: string;
  type: string;
  year: string;
  pricePerDay: string;
  location: string;
  fuelType: string;
  transmission: string;
  seats: string;
  description: string;
}

interface FormErrors {
  name?: string;
  brand?: string;
  model?: string;
  type?: string;
  year?: string;
  pricePerDay?: string;
  location?: string;
  fuelType?: string;
  transmission?: string;
  seats?: string;
  description?: string;
  images?: string;
}

// =========================================================
// DEFAULT FORM
// =========================================================

const initialForm: VehicleFormData = {
  name: "",
  brand: "",
  model: "",
  type: "",
  year: "",
  pricePerDay: "",
  location: "",
  fuelType: "",
  transmission: "",
  seats: "",
  description: "",
};

// =========================================================
// VEHICLE TYPES
// =========================================================

const vehicleTypes = [
  "Car",
  "SUV",
  "Sedan",
  "Hatchback",
  "MUV",
  "Luxury",
  "Electric",
  "Van",
  "Bike",
];

// =========================================================
// FUEL TYPES
// =========================================================

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];

// =========================================================
// COMPONENT
// =========================================================

const AddVehicle: React.FC = () => {
  const navigate = useNavigate();

  // =======================================================
  // STATE
  // =======================================================

  const [formData, setFormData] = useState<VehicleFormData>(initialForm);

  const [images, setImages] = useState<File[]>([]);

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [errors, setErrors] = useState<FormErrors>({});

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [apiError, setApiError] = useState("");

  // =======================================================
  // INPUT CHANGE
  // =======================================================

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    setApiError("");
  };

  // =======================================================
  // IMAGE CHANGE
  // =======================================================

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      const isImage = file.type.startsWith("image/");

      const isSizeValid = file.size <= 5 * 1024 * 1024;

      return isImage && isSizeValid;
    });

    if (validFiles.length !== selectedFiles.length) {
      setErrors((previous) => ({
        ...previous,
        images: "Only images up to 5MB each are allowed.",
      }));
    }

    const remainingSlots = Math.max(0, 5 - images.length);

    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length === 0) {
      return;
    }

    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));

    setImages((previous) => [...previous, ...filesToAdd]);

    setPreviewImages((previous) => [...previous, ...newPreviews]);

    setErrors((previous) => ({
      ...previous,
      images: undefined,
    }));

    event.target.value = "";
  };

  // =======================================================
  // REMOVE IMAGE
  // =======================================================

  const removeImage = (index: number) => {
    const preview = previewImages[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImages((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );

    setPreviewImages((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  // =======================================================
  // VALIDATION
  // =======================================================

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // -----------------------------------------------------
    // NAME
    // -----------------------------------------------------

    if (!formData.name.trim()) {
      newErrors.name = "Vehicle name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Vehicle name must contain at least 2 characters.";
    }

    // -----------------------------------------------------
    // BRAND
    // -----------------------------------------------------

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required.";
    }

    // -----------------------------------------------------
    // MODEL
    // -----------------------------------------------------

    if (!formData.model.trim()) {
      newErrors.model = "Model is required.";
    }

    // -----------------------------------------------------
    // TYPE
    // -----------------------------------------------------

    if (!formData.type) {
      newErrors.type = "Vehicle type is required.";
    }

    // -----------------------------------------------------
    // YEAR
    // -----------------------------------------------------

    const currentYear = new Date().getFullYear();

    const vehicleYear = Number(formData.year);

    if (!formData.year) {
      newErrors.year = "Manufacturing year is required.";
    } else if (vehicleYear < 1990 || vehicleYear > currentYear) {
      newErrors.year = `Enter a year between 1990 and ${currentYear}.`;
    }

    // -----------------------------------------------------
    // PRICE
    // -----------------------------------------------------

    const price = Number(formData.pricePerDay);

    if (!formData.pricePerDay) {
      newErrors.pricePerDay = "Price per day is required.";
    } else if (Number.isNaN(price) || price <= 0) {
      newErrors.pricePerDay = "Enter a valid price.";
    }

    // -----------------------------------------------------
    // LOCATION
    // -----------------------------------------------------

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    // -----------------------------------------------------
    // FUEL
    // -----------------------------------------------------

    if (!formData.fuelType) {
      newErrors.fuelType = "Fuel type is required.";
    }

    // -----------------------------------------------------
    // TRANSMISSION
    // -----------------------------------------------------

    if (!formData.transmission) {
      newErrors.transmission = "Transmission is required.";
    }

    // -----------------------------------------------------
    // SEATS
    // -----------------------------------------------------

    const seats = Number(formData.seats);

    if (!formData.seats) {
      newErrors.seats = "Number of seats is required.";
    } else if (seats < 1 || seats > 50) {
      newErrors.seats = "Enter a valid number of seats.";
    }

    // -----------------------------------------------------
    // DESCRIPTION
    // -----------------------------------------------------

    if (!formData.description.trim()) {
      newErrors.description = "Vehicle description is required.";
    } else if (formData.description.trim().length < 20) {
      newErrors.description =
        "Description must contain at least 20 characters.";
    }

    // -----------------------------------------------------
    // IMAGES
    // -----------------------------------------------------

    if (images.length === 0) {
      newErrors.images = "Please upload at least one vehicle image.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setApiError("");

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      /*
       * FormData is used because vehicle
       * images are being uploaded.
       */

      const data = new FormData();

      data.append("name", formData.name.trim());

      data.append("brand", formData.brand.trim());

      data.append("model", formData.model.trim());

      data.append("type", formData.type);

      data.append("year", formData.year);

      data.append("pricePerDay", formData.pricePerDay);

      data.append("location", formData.location.trim());

      data.append("fuelType", formData.fuelType);

      data.append("transmission", formData.transmission);

      data.append("seats", formData.seats);

      data.append("description", formData.description.trim());

      // ---------------------------------------------------
      // IMAGES
      // ---------------------------------------------------

      images.forEach((image) => {
        data.append("images", image);
      });

      /*
       * Expected backend:
       *
       * POST /api/vehicles
       *
       * If your backend uses /vehicles/add,
       * change only the URL below.
       */

      await axiosInstance.post("/vehicles", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/owner/vehicles");
      }, 1500);
    } catch (error: any) {
      console.error("Add vehicle error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to add vehicle. Please try again.";

      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // CANCEL
  // =======================================================

  const handleCancel = () => {
    navigate("/owner/vehicles");
  };

  // =======================================================
  // SUCCESS SCREEN
  // =======================================================

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Vehicle Added Successfully
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your vehicle has been added to your listings.
          </p>

          <p className="mt-4 text-xs text-gray-400">
            Redirecting to My Vehicles...
          </p>
        </div>
      </div>
    );
  }

  // =======================================================
  // MAIN UI
  // =======================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===================================================
          PAGE HEADER
      ==================================================== */}

      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <button
            type="button"
            onClick={handleCancel}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-gray-500
              hover:text-gray-900
              transition
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Vehicles
          </button>

          <div className="mt-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Vehicle</h1>

              <p className="text-sm text-gray-500 mt-1">
                Add a new vehicle to your rental listings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          CONTENT
      ==================================================== */}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API ERROR */}

        {apiError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <X className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />

            <div>
              <p className="text-sm font-medium text-red-800">
                Unable to add vehicle
              </p>

              <p className="text-sm text-red-700 mt-1">{apiError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* =================================================
              BASIC INFORMATION
          ================================================== */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Car className="w-4 h-4 text-blue-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Basic Information
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Enter the vehicle's basic details.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Vehicle Name"
                name="name"
                value={formData.name}
                placeholder="e.g. Toyota Innova Crysta"
                onChange={handleChange}
                error={errors.name}
                required
              />

              <Input
                label="Brand"
                name="brand"
                value={formData.brand}
                placeholder="e.g. Toyota"
                onChange={handleChange}
                error={errors.brand}
                required
              />

              <Input
                label="Model"
                name="model"
                value={formData.model}
                placeholder="e.g. Innova Crysta"
                onChange={handleChange}
                error={errors.model}
                required
              />

              {/* Vehicle Type */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Vehicle Type
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`
                    w-full
                    h-10
                    rounded-lg
                    border
                    bg-white
                    px-3
                    text-sm
                    text-gray-900
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                    ${errors.type ? "border-red-400" : "border-gray-300"}
                  `}
                >
                  <option value="">Select vehicle type</option>

                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {errors.type && (
                  <p className="mt-1 text-xs text-red-600">{errors.type}</p>
                )}
              </div>

              <Input
                label="Manufacturing Year"
                name="year"
                type="number"
                value={formData.year}
                placeholder="e.g. 2024"
                min="1990"
                max={String(new Date().getFullYear())}
                onChange={handleChange}
                error={errors.year}
                required
              />

              <Input
                label="Price Per Day"
                name="pricePerDay"
                type="number"
                value={formData.pricePerDay}
                placeholder="e.g. 2500"
                min="1"
                leftIcon={<IndianRupee className="w-4 h-4" />}
                onChange={handleChange}
                error={errors.pricePerDay}
                required
              />
            </div>
          </section>

          {/* =================================================
              VEHICLE SPECIFICATIONS
          ================================================== */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Settings2 className="w-4 h-4 text-purple-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Vehicle Specifications
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Add technical details.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Fuel */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Fuel Type
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <div className="relative">
                  <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className={`
                      w-full
                      h-10
                      rounded-lg
                      border
                      bg-white
                      pl-10
                      pr-3
                      text-sm
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                      ${errors.fuelType ? "border-red-400" : "border-gray-300"}
                    `}
                  >
                    <option value="">Select fuel type</option>

                    {fuelTypes.map((fuel) => (
                      <option key={fuel} value={fuel}>
                        {fuel}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.fuelType && (
                  <p className="mt-1 text-xs text-red-600">{errors.fuelType}</p>
                )}
              </div>

              {/* Transmission */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Transmission
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className={`
                    w-full
                    h-10
                    rounded-lg
                    border
                    bg-white
                    px-3
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                    ${
                      errors.transmission ? "border-red-400" : "border-gray-300"
                    }
                  `}
                >
                  <option value="">Select transmission</option>

                  <option value="Manual">Manual</option>

                  <option value="Automatic">Automatic</option>

                  <option value="AMT">AMT</option>

                  <option value="CVT">CVT</option>
                </select>

                {errors.transmission && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.transmission}
                  </p>
                )}
              </div>

              {/* Seats */}

              <Input
                label="Number of Seats"
                name="seats"
                type="number"
                value={formData.seats}
                placeholder="e.g. 5"
                min="1"
                max="50"
                leftIcon={<Users className="w-4 h-4" />}
                onChange={handleChange}
                error={errors.seats}
                required
              />

              {/* Location */}

              <Input
                label="Vehicle Location"
                name="location"
                value={formData.location}
                placeholder="e.g. Chennai"
                leftIcon={<MapPin className="w-4 h-4" />}
                onChange={handleChange}
                error={errors.location}
                required
              />
            </div>
          </section>

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">Description</h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Tell renters about your vehicle.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                maxLength={1000}
                placeholder="Describe the vehicle, features, condition, comfort, and any other important information..."
                className={`
                  w-full
                  rounded-xl
                  border
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-gray-900
                  placeholder:text-gray-400
                  outline-none
                  resize-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                  ${errors.description ? "border-red-400" : "border-gray-300"}
                `}
              />

              <div className="flex items-center justify-between mt-1">
                {errors.description ? (
                  <p className="text-xs text-red-600">{errors.description}</p>
                ) : (
                  <p className="text-xs text-gray-400">Minimum 20 characters</p>
                )}

                <p className="text-xs text-gray-400">
                  {formData.description.length}
                  /1000
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              IMAGES
          ================================================== */}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                  <ImagePlus className="w-4 h-4 text-orange-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Vehicle Images
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Upload up to 5 images. Maximum 5MB each.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Upload */}

              {images.length < 5 && (
                <label
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    min-h-40
                    rounded-xl
                    border-2
                    border-dashed
                    border-gray-300
                    bg-gray-50
                    cursor-pointer
                    hover:bg-gray-100
                    hover:border-blue-400
                    transition
                  "
                >
                  <ImagePlus className="w-9 h-9 text-gray-400" />

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    Click to upload vehicle images
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG, JPEG up to 5MB
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* Image error */}

              {errors.images && (
                <p className="mt-2 text-xs text-red-600">{errors.images}</p>
              )}

              {/* Preview */}

              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-5">
                  {previewImages.map((preview, index) => (
                    <div
                      key={`${preview}-${index}`}
                      className="
                          relative
                          aspect-square
                          rounded-xl
                          overflow-hidden
                          border
                          border-gray-200
                          bg-gray-100
                        "
                    >
                      <img
                        src={preview}
                        alt={`Vehicle ${index + 1}`}
                        className="
                            w-full
                            h-full
                            object-cover
                          "
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="
                            absolute
                            top-2
                            right-2
                            w-7
                            h-7
                            rounded-full
                            bg-black/60
                            text-white
                            flex
                            items-center
                            justify-center
                            hover:bg-red-600
                            transition
                          "
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {index === 0 && (
                        <span
                          className="
                              absolute
                              bottom-2
                              left-2
                              px-2
                              py-1
                              rounded-md
                              bg-black/60
                              text-white
                              text-[10px]
                              font-medium
                            "
                        >
                          Main Image
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              ACTIONS
          ================================================== */}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={loading}
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                loadingText="Adding Vehicle..."
                leftIcon={!loading ? <Car className="w-5 h-5" /> : undefined}
              >
                Add Vehicle
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddVehicle;
