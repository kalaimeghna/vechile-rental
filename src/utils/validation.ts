// ============================================================
// VALIDATION UTILITIES
// Vehicle Rental Platform
// ============================================================

import { calculateRentalDays } from "./formatDate";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/*
|--------------------------------------------------------------------------
| Email
|--------------------------------------------------------------------------
*/

export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Password
|--------------------------------------------------------------------------
*/

export const validatePassword = (password: string): string => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 6) {
    return "Password must contain at least 6 characters";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Strong Password
|--------------------------------------------------------------------------
*/

export const validateStrongPassword = (password: string): string => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must contain at least 8 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Name
|--------------------------------------------------------------------------
*/

export const validateName = (name: string): string => {
  const value = name.trim();

  if (!value) {
    return "Name is required";
  }

  if (value.length < 2) {
    return "Name must contain at least 2 characters";
  }

  if (value.length > 50) {
    return "Name must not exceed 50 characters";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Phone
|--------------------------------------------------------------------------
*/

export const validatePhone = (phone: string): string => {
  const value = phone.trim();

  if (!value) {
    return "Phone number is required";
  }

  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(value)) {
    return "Please enter a valid 10-digit Indian phone number";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Required Field
|--------------------------------------------------------------------------
*/

export const validateRequired = (value: string, fieldName: string): string => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Vehicle Name
|--------------------------------------------------------------------------
*/

export const validateVehicleName = (name: string): string => {
  const value = name.trim();

  if (!value) {
    return "Vehicle name is required";
  }

  if (value.length < 2) {
    return "Vehicle name must contain at least 2 characters";
  }

  if (value.length > 100) {
    return "Vehicle name must not exceed 100 characters";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Vehicle Price
|--------------------------------------------------------------------------
*/

export const validateVehiclePrice = (price: number | string): string => {
  const numericPrice = Number(price);

  if (price === "" || price === null || price === undefined) {
    return "Price is required";
  }

  if (Number.isNaN(numericPrice)) {
    return "Price must be a valid number";
  }

  if (numericPrice <= 0) {
    return "Price must be greater than ₹0";
  }

  if (numericPrice > 1000000) {
    return "Price is too high";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Vehicle Seats
|--------------------------------------------------------------------------
*/

export const validateSeats = (seats: number | string): string => {
  const numericSeats = Number(seats);

  if (seats === "" || seats === null || seats === undefined) {
    return "Number of seats is required";
  }

  if (Number.isNaN(numericSeats)) {
    return "Seats must be a valid number";
  }

  if (numericSeats < 1) {
    return "Vehicle must have at least 1 seat";
  }

  if (numericSeats > 50) {
    return "Invalid number of seats";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Date
|--------------------------------------------------------------------------
*/

export const validateDate = (date: string, fieldName = "Date"): string => {
  if (!date) {
    return `${fieldName} is required`;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return `${fieldName} is invalid`;
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Booking Start Date
|--------------------------------------------------------------------------
*/

export const validateStartDate = (startDate: string): string => {
  const basicError = validateDate(startDate, "Pick-up date");

  if (basicError) {
    return basicError;
  }

  const selectedDate = new Date(startDate);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return "Pick-up date cannot be in the past";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Booking End Date
|--------------------------------------------------------------------------
*/

export const validateEndDate = (startDate: string, endDate: string): string => {
  const basicError = validateDate(endDate, "Return date");

  if (basicError) {
    return basicError;
  }

  if (!startDate) {
    return "Please select pick-up date first";
  }

  const start = new Date(startDate);

  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (end <= start) {
    return "Return date must be after pick-up date";
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Booking Validation
|--------------------------------------------------------------------------
*/

export interface BookingFormData {
  startDate: string;
  endDate: string;
}

export const validateBooking = (data: BookingFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  const startError = validateStartDate(data.startDate);

  if (startError) {
    errors.startDate = startError;
  }

  const endError = validateEndDate(data.startDate, data.endDate);

  if (endError) {
    errors.endDate = endError;
  }

  if (data.startDate && data.endDate) {
    const days = calculateRentalDays(data.startDate, data.endDate);

    if (days <= 0) {
      errors.dateRange = "Please select a valid rental period";
    }

    if (days > 365) {
      errors.dateRange = "Rental period cannot exceed 365 days";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/*
|--------------------------------------------------------------------------
| Login Validation
|--------------------------------------------------------------------------
*/

export interface LoginFormData {
  email: string;
  password: string;
}

export const validateLogin = (data: LoginFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(data.email);

  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(data.password);

  if (passwordError) {
    errors.password = passwordError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/*
|--------------------------------------------------------------------------
| Register Validation
|--------------------------------------------------------------------------
*/

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const validateRegister = (data: RegisterFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  const nameError = validateName(data.name);

  if (nameError) {
    errors.name = nameError;
  }

  const emailError = validateEmail(data.email);

  if (emailError) {
    errors.email = emailError;
  }

  const phoneError = validatePhone(data.phone);

  if (phoneError) {
    errors.phone = phoneError;
  }

  const passwordError = validateStrongPassword(data.password);

  if (passwordError) {
    errors.password = passwordError;
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
