import React, { useState } from "react";
import type { FC, ChangeEvent, FormEvent } from "react";
import { CalendarDays, MapPin, User, Phone, Mail, Car } from "lucide-react";

import Input from "../components/common/Input";
import Button from "../components/common/Button";

// =========================================================
// TYPES
// =========================================================

export interface BookingFormVehicle {
  _id: string;
  name?: string;
  brand?: string;
  model?: string;
  pricePerDay?: number;
  price?: number;
}

export interface BookingFormData {
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
}

interface BookingFormProps {
  vehicle: BookingFormVehicle;

  initialValues?: Partial<BookingFormData>;

  onSubmit: (data: BookingFormData) => void | Promise<void>;

  loading?: boolean;

  submitText?: string;

  minDate?: string;

  className?: string;
}

// =========================================================
// HELPERS
// =========================================================

const getToday = (): string => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getVehicleName = (vehicle: BookingFormVehicle): string => {
  if (vehicle.name) {
    return vehicle.name;
  }

  return [vehicle.brand, vehicle.model].filter(Boolean).join(" ") || "Vehicle";
};

// =========================================================
// COMPONENT
// =========================================================

const BookingForm: FC<BookingFormProps> = ({
  vehicle,
  initialValues,
  onSubmit,
  loading = false,
  submitText = "Continue to Booking",
  minDate,
  className = "",
}) => {
  // =======================================================
  // FORM STATE & PROP SYNC (RENDER-TIME ADJUSTMENT PATTERN)
  // =======================================================

  const [formData, setFormData] = useState<BookingFormData>({
    pickupDate: initialValues?.pickupDate || "",
    returnDate: initialValues?.returnDate || "",
    pickupLocation: initialValues?.pickupLocation || "",
    returnLocation: initialValues?.returnLocation || "",
    customerName: initialValues?.customerName || "",
    customerEmail: initialValues?.customerEmail || "",
    customerPhone: initialValues?.customerPhone || "",
    notes: initialValues?.notes || "",
  });

  // Track initialValues changes during render to avoid useEffect cascading renders
  const [prevInitialValues, setPrevInitialValues] = useState(initialValues);

  if (initialValues !== prevInitialValues) {
    setPrevInitialValues(initialValues);
    setFormData({
      pickupDate: initialValues?.pickupDate || "",
      returnDate: initialValues?.returnDate || "",
      pickupLocation: initialValues?.pickupLocation || "",
      returnLocation: initialValues?.returnLocation || "",
      customerName: initialValues?.customerName || "",
      customerEmail: initialValues?.customerEmail || "",
      customerPhone: initialValues?.customerPhone || "",
      notes: initialValues?.notes || "",
    });
  }

  // =======================================================
  // ERRORS
  // =======================================================

  const [errors, setErrors] = useState<
    Partial<Record<keyof BookingFormData, string>>
  >({});

  // =======================================================
  // CHANGE HANDLER
  // =======================================================

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name as keyof BookingFormData]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  // =======================================================
  // VALIDATION
  // =======================================================

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.pickupDate) {
      newErrors.pickupDate = "Pickup date is required.";
    }

    if (!formData.returnDate) {
      newErrors.returnDate = "Return date is required.";
    }

    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(`${formData.pickupDate}T00:00:00`);
      const returnDate = new Date(`${formData.returnDate}T00:00:00`);

      if (returnDate < pickup) {
        newErrors.returnDate = "Return date must be after pickup date.";
      }

      if (returnDate.getTime() === pickup.getTime()) {
        newErrors.returnDate = "Pickup and return dates cannot be the same.";
      }
    }

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup location is required.";
    }

    if (!formData.returnLocation.trim()) {
      newErrors.returnLocation = "Return location is required.";
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required.";
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = "Name must contain at least 2 characters.";
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Enter a valid email address.";
    }

    const cleanPhone = formData.customerPhone.replace(/\D/g, "");

    if (!cleanPhone) {
      newErrors.customerPhone = "Phone number is required.";
    } else if (cleanPhone.length < 10) {
      newErrors.customerPhone = "Enter a valid phone number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const isValid = validate();

    if (!isValid) {
      return;
    }

    await onSubmit(formData);
  };

  const vehicleName = getVehicleName(vehicle);
  const minimumDate = minDate || getToday();

  // =======================================================
  // UI
  // =======================================================

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`
        w-full
        bg-white
        border
        border-gray-200
        rounded-2xl
        shadow-sm
        ${className}
      `}
    >
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
            <Car className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-950">
              Book {vehicleName}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Enter your rental details
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-7">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Rental Dates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Pickup Date"
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              min={minimumDate}
              onChange={handleChange}
              error={errors.pickupDate}
              required
            />

            <Input
              label="Return Date"
              type="date"
              name="returnDate"
              value={formData.returnDate}
              min={formData.pickupDate || minimumDate}
              onChange={handleChange}
              error={errors.returnDate}
              required
            />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              Pickup & Return Location
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Pickup Location"
              name="pickupLocation"
              value={formData.pickupLocation}
              placeholder="Enter pickup location"
              leftIcon={<MapPin className="w-5 h-5" />}
              onChange={handleChange}
              error={errors.pickupLocation}
              required
            />

            <Input
              label="Return Location"
              name="returnLocation"
              value={formData.returnLocation}
              placeholder="Enter return location"
              leftIcon={<MapPin className="w-5 h-5" />}
              onChange={handleChange}
              error={errors.returnLocation}
              required
            />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              Customer Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="customerName"
              value={formData.customerName}
              placeholder="Enter your full name"
              leftIcon={<User className="w-5 h-5" />}
              onChange={handleChange}
              error={errors.customerName}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              placeholder="Enter your email"
              leftIcon={<Mail className="w-5 h-5" />}
              onChange={handleChange}
              error={errors.customerEmail}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              placeholder="Enter your phone number"
              leftIcon={<Phone className="w-5 h-5" />}
              onChange={handleChange}
              error={errors.customerPhone}
              required
            />
          </div>
        </section>

        <section>
          <label
            htmlFor="booking-notes"
            className="block mb-1.5 text-sm font-medium text-gray-700"
          >
            Additional Notes
          </label>
          <textarea
            id="booking-notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Any special requests or additional information..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </section>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          loadingText="Processing..."
          leftIcon={!loading ? <CalendarDays className="w-5 h-5" /> : undefined}
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
