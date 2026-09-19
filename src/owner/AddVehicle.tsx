import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios"; // Adjust based on your project structure

interface VehicleFormData {
  title: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  description: string;
  category: string;
}

interface FormErrors {
  title?: string;
  brand?: string;
  model?: string;
  year?: string;
  price?: string;
  description?: string;
  images?: string;
}

const AddVehicle: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<VehicleFormData>({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    description: "",
    category: "Car",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Clean up object URLs on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      const validFiles = filesArray.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} exceeds 5MB limit.`);
          return false;
        }
        return true;
      });

      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

      setImageFiles((prev) => [...prev, ...validFiles]);
      setPreviewImages((prev) => [...prev, ...newPreviews]);

      // Safely reset file input value using type casting
      (e.target as HTMLInputElement).value = "";
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewImages[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!formData.year.trim()) newErrors.year = "Year is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (imageFiles.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      await axiosInstance.post("/vehicles", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Vehicle added successfully!");
      setTimeout(() => {
        navigate("/vehicles");
      }, 1500);
    } catch (error: unknown) {
      console.error("Error adding vehicle:", error);

      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to add vehicle. Please try again.";

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Vehicle</h2>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md ${errors.title ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.title && (
              <span className="text-xs text-red-500">{errors.title}</span>
            )}
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md ${errors.brand ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.brand && (
              <span className="text-xs text-red-500">{errors.brand}</span>
            )}
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md ${errors.model ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.model && (
              <span className="text-xs text-red-500">{errors.model}</span>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md ${errors.year ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.year && (
              <span className="text-xs text-red-500">{errors.year}</span>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border rounded-md ${errors.price ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.price && (
              <span className="text-xs text-red-500">{errors.price}</span>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Car">Car</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Bike">Bike</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vehicle Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {errors.images && (
            <span className="text-xs text-red-500">{errors.images}</span>
          )}

          {/* Image Previews */}
          <div className="flex flex-wrap gap-3 mt-3">
            {previewImages.map((src, index) => (
              <div
                key={index}
                className="relative w-24 h-24 border rounded-md overflow-hidden group"
              >
                <img
                  src={src}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? "Submitting..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;
