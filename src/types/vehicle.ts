// ============================================================
// VEHICLE TYPES
// ============================================================

export type VehicleStatus =
  | "available"
  | "unavailable"
  | "booked"
  | "maintenance"
  | "inactive";

export type VehicleApprovalStatus = "pending" | "approved" | "rejected";

export type FuelType =
  | "petrol"
  | "diesel"
  | "electric"
  | "hybrid"
  | "cng"
  | "lpg";

export type TransmissionType = "manual" | "automatic" | "semi-automatic";

export type VehicleType =
  | "car"
  | "bike"
  | "scooter"
  | "van"
  | "suv"
  | "truck"
  | "bus";

// ============================================================
// VEHICLE OWNER
// ============================================================

export interface VehicleOwner {
  _id: string;

  name: string;

  email?: string;

  phone?: string;

  profilePicture?: string;
}

// ============================================================
// VEHICLE IMAGE
// ============================================================

export interface VehicleImage {
  url: string;

  publicId?: string;

  alt?: string;
}

// ============================================================
// VEHICLE
// ============================================================

export interface Vehicle {
  _id: string;

  name: string;

  brand: string;

  model: string;

  year?: number;

  vehicleType?: VehicleType;

  type?: VehicleType;

  registrationNumber?: string;

  registrationNo?: string;

  color?: string;

  fuelType?: FuelType;

  transmission?: TransmissionType;

  seats?: number;

  doors?: number;

  mileage?: number;

  pricePerDay: number;

  price?: number;

  securityDeposit?: number;

  description?: string;

  features?: string[];

  amenities?: string[];

  images?: string[];

  image?: string;

  vehicleImages?: VehicleImage[];

  location?: string;

  city?: string;

  state?: string;

  address?: string;

  status?: VehicleStatus;

  approvalStatus?: VehicleApprovalStatus;

  isAvailable?: boolean;

  isActive?: boolean;

  owner: VehicleOwner | string | null;

  rating?: number;

  averageRating?: number;

  totalReviews?: number;

  totalBookings?: number;

  createdAt?: string;

  updatedAt?: string;
}

// ============================================================
// ADD VEHICLE
// ============================================================

export interface AddVehicleData {
  name: string;

  brand: string;

  model: string;

  year?: number;

  vehicleType?: VehicleType;

  type?: VehicleType;

  registrationNumber?: string;

  color?: string;

  fuelType?: FuelType;

  transmission?: TransmissionType;

  seats?: number;

  doors?: number;

  mileage?: number;

  pricePerDay: number;

  securityDeposit?: number;

  description?: string;

  features?: string[];

  amenities?: string[];

  location?: string;

  city?: string;

  state?: string;

  address?: string;

  images?: File[];
}

// ============================================================
// UPDATE VEHICLE
// ============================================================

export interface UpdateVehicleData {
  name?: string;

  brand?: string;

  model?: string;

  year?: number;

  vehicleType?: VehicleType;

  type?: VehicleType;

  registrationNumber?: string;

  color?: string;

  fuelType?: FuelType;

  transmission?: TransmissionType;

  seats?: number;

  doors?: number;

  mileage?: number;

  pricePerDay?: number;

  securityDeposit?: number;

  description?: string;

  features?: string[];

  amenities?: string[];

  location?: string;

  city?: string;

  state?: string;

  address?: string;

  status?: VehicleStatus;

  isAvailable?: boolean;

  isActive?: boolean;

  images?: File[];
}

// ============================================================
// VEHICLE RESPONSE
// ============================================================

export interface VehicleResponse {
  success?: boolean;

  message?: string;

  vehicle?: Vehicle;

  data?: Vehicle;
}

// ============================================================
// VEHICLES RESPONSE
// ============================================================

export interface VehiclesResponse {
  success?: boolean;

  message?: string;

  vehicles?: Vehicle[];

  data?: Vehicle[];

  total?: number;

  page?: number;

  limit?: number;

  pages?: number;

  totalPages?: number;
}

// ============================================================
// VEHICLE FILTERS
// ============================================================

export interface VehicleFilters {
  search?: string;

  brand?: string;

  model?: string;

  vehicleType?: VehicleType;

  type?: VehicleType;

  fuelType?: FuelType;

  transmission?: TransmissionType;

  minPrice?: number;

  maxPrice?: number;

  minRating?: number;

  maxRating?: number;

  city?: string;

  state?: string;

  location?: string;

  status?: VehicleStatus;

  approvalStatus?: VehicleApprovalStatus;

  isAvailable?: boolean;

  ownerId?: string;

  page?: number;

  limit?: number;

  sort?: "newest" | "oldest" | "price-low" | "price-high" | "rating-high";

  sortBy?: string;
}

// ============================================================
// VEHICLE PAGINATION
// ============================================================

export interface VehiclePagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

// ============================================================
// VEHICLE SEARCH
// ============================================================

export interface VehicleSearchParams {
  search?: string;

  location?: string;

  startDate?: string;

  endDate?: string;

  vehicleType?: VehicleType;

  minPrice?: number;

  maxPrice?: number;
}

// ============================================================
// VEHICLE AVAILABILITY
// ============================================================

export interface VehicleAvailability {
  vehicleId: string;

  startDate: string;

  endDate: string;
}

export interface VehicleAvailabilityResponse {
  success?: boolean;

  available: boolean;

  message?: string;

  conflictingBookings?: string[];
}

// ============================================================
// VEHICLE CARD PROPS
// ============================================================

export interface VehicleCardProps {
  vehicle: Vehicle;

  onView?: (vehicle: Vehicle) => void;

  onEdit?: (vehicle: Vehicle) => void;

  onDelete?: (vehicle: Vehicle) => void;

  onBook?: (vehicle: Vehicle) => void;

  showOwner?: boolean;

  showActions?: boolean;
}

// ============================================================
// VEHICLE GALLERY PROPS
// ============================================================

export interface VehicleGalleryProps {
  vehicle: Vehicle;

  images?: string[];

  onImageClick?: (image: string, index: number) => void;
}

// ============================================================
// VEHICLE FILTER PROPS
// ============================================================

export interface VehicleFilterProps {
  filters: VehicleFilters;

  onChange: (filters: VehicleFilters) => void;

  onReset?: () => void;
}

// ============================================================
// VEHICLE SEARCH PROPS
// ============================================================

export interface VehicleSearchProps {
  value: string;

  onChange: (value: string) => void;

  onSearch?: () => void;

  placeholder?: string;
}

// ============================================================
// VEHICLE STATUS LIST
// ============================================================

export const VEHICLE_STATUSES: VehicleStatus[] = [
  "available",
  "unavailable",
  "booked",
  "maintenance",
  "inactive",
];

// ============================================================
// VEHICLE TYPES LIST
// ============================================================

export const VEHICLE_TYPES: VehicleType[] = [
  "car",
  "bike",
  "scooter",
  "van",
  "suv",
  "truck",
  "bus",
];

// ============================================================
// FUEL TYPES
// ============================================================

export const FUEL_TYPES: FuelType[] = [
  "petrol",
  "diesel",
  "electric",
  "hybrid",
  "cng",
  "lpg",
];

// ============================================================
// TRANSMISSION TYPES
// ============================================================

export const TRANSMISSION_TYPES: TransmissionType[] = [
  "manual",
  "automatic",
  "semi-automatic",
];

// ============================================================
// APPROVAL STATUS
// ============================================================

export const VEHICLE_APPROVAL_STATUSES: VehicleApprovalStatus[] = [
  "pending",
  "approved",
  "rejected",
];

// ============================================================
// VEHICLE STATUS LABEL
// ============================================================

export const getVehicleStatusLabel = (status?: VehicleStatus): string => {
  switch (status) {
    case "available":
      return "Available";

    case "unavailable":
      return "Unavailable";

    case "booked":
      return "Booked";

    case "maintenance":
      return "Maintenance";

    case "inactive":
      return "Inactive";

    default:
      return "Unknown";
  }
};

// ============================================================
// VEHICLE STATUS COLOR
// ============================================================

export const getVehicleStatusColor = (status?: VehicleStatus): string => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-700";

    case "booked":
      return "bg-blue-100 text-blue-700";

    case "maintenance":
      return "bg-yellow-100 text-yellow-700";

    case "unavailable":
      return "bg-orange-100 text-orange-700";

    case "inactive":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ============================================================
// APPROVAL STATUS LABEL
// ============================================================

export const getApprovalStatusLabel = (
  status?: VehicleApprovalStatus,
): string => {
  switch (status) {
    case "pending":
      return "Pending";

    case "approved":
      return "Approved";

    case "rejected":
      return "Rejected";

    default:
      return "Unknown";
  }
};

// ============================================================
// APPROVAL STATUS COLOR
// ============================================================

export const getApprovalStatusColor = (
  status?: VehicleApprovalStatus,
): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "approved":
      return "bg-green-100 text-green-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ============================================================
// VEHICLE TYPE LABEL
// ============================================================

export const getVehicleTypeLabel = (type?: VehicleType): string => {
  switch (type) {
    case "car":
      return "Car";

    case "bike":
      return "Bike";

    case "scooter":
      return "Scooter";

    case "van":
      return "Van";

    case "suv":
      return "SUV";

    case "truck":
      return "Truck";

    case "bus":
      return "Bus";

    default:
      return "Vehicle";
  }
};

// ============================================================
// FUEL TYPE LABEL
// ============================================================

export const getFuelTypeLabel = (fuelType?: FuelType): string => {
  switch (fuelType) {
    case "petrol":
      return "Petrol";

    case "diesel":
      return "Diesel";

    case "electric":
      return "Electric";

    case "hybrid":
      return "Hybrid";

    case "cng":
      return "CNG";

    case "lpg":
      return "LPG";

    default:
      return "Not Specified";
  }
};

// ============================================================
// TRANSMISSION LABEL
// ============================================================

export const getTransmissionLabel = (
  transmission?: TransmissionType,
): string => {
  switch (transmission) {
    case "manual":
      return "Manual";

    case "automatic":
      return "Automatic";

    case "semi-automatic":
      return "Semi-Automatic";

    default:
      return "Not Specified";
  }
};

// ============================================================
// GET VEHICLE NAME
// ============================================================

export const getVehicleName = (vehicle?: Vehicle | string | null): string => {
  if (!vehicle) {
    return "Vehicle";
  }

  if (typeof vehicle === "string") {
    return vehicle;
  }

  if (vehicle.name) {
    return vehicle.name;
  }

  return [vehicle.brand, vehicle.model].filter(Boolean).join(" ");
};

// ============================================================
// GET VEHICLE IMAGE
// ============================================================

export const getVehicleImage = (vehicle?: Vehicle | null): string | null => {
  if (!vehicle) {
    return null;
  }

  if (vehicle.images && vehicle.images.length > 0) {
    return vehicle.images[0];
  }

  if (vehicle.image) {
    return vehicle.image;
  }

  if (vehicle.vehicleImages && vehicle.vehicleImages.length > 0) {
    return vehicle.vehicleImages[0].url;
  }

  return null;
};

// ============================================================
// GET VEHICLE OWNER NAME
// ============================================================

export const getVehicleOwnerName = (vehicle?: Vehicle | null): string => {
  if (!vehicle?.owner) {
    return "Unknown Owner";
  }

  if (typeof vehicle.owner === "string") {
    return vehicle.owner;
  }

  return vehicle.owner.name || "Unknown Owner";
};

// ============================================================
// CHECK VEHICLE AVAILABLE
// ============================================================

export const isVehicleAvailable = (vehicle?: Vehicle | null): boolean => {
  if (!vehicle) {
    return false;
  }

  if (vehicle.isAvailable !== undefined) {
    return vehicle.isAvailable;
  }

  return vehicle.status === "available";
};

// ============================================================
// CHECK VEHICLE APPROVED
// ============================================================

export const isVehicleApproved = (vehicle?: Vehicle | null): boolean => {
  if (!vehicle) {
    return false;
  }

  return (
    vehicle.approvalStatus === "approved" ||
    vehicle.approvalStatus === undefined
  );
};

// ============================================================
// FORMAT PRICE
// ============================================================

export const formatVehiclePrice = (price?: number): string => {
  if (price === undefined || price === null || Number.isNaN(price)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// ============================================================
// FORMAT PRICE PER DAY
// ============================================================

export const formatPricePerDay = (vehicle?: Vehicle | null): string => {
  if (!vehicle) {
    return "₹0/day";
  }

  const price = vehicle.pricePerDay ?? vehicle.price ?? 0;

  return `${formatVehiclePrice(price)}/day`;
};

// ============================================================
// CALCULATE RENTAL PRICE
// ============================================================

export const calculateRentalPrice = (
  pricePerDay: number,
  startDate: string,
  endDate: string,
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const difference = end.getTime() - start.getTime();

  const days = Math.max(1, Math.ceil(difference / (1000 * 60 * 60 * 24)));

  return pricePerDay * days;
};

// ============================================================
// CALCULATE VEHICLE RATING
// ============================================================

export const getVehicleRating = (vehicle?: Vehicle | null): number => {
  if (!vehicle) {
    return 0;
  }

  return vehicle.averageRating ?? vehicle.rating ?? 0;
};

// ============================================================
// FORMAT RATING
// ============================================================

export const formatVehicleRating = (vehicle?: Vehicle | null): string => {
  return getVehicleRating(vehicle).toFixed(1);
};

// ============================================================
// VALIDATE VEHICLE PRICE
// ============================================================

export const validateVehiclePrice = (price: number): string | null => {
  if (price === undefined || price === null || Number.isNaN(price)) {
    return "Price is required.";
  }

  if (price <= 0) {
    return "Price must be greater than 0.";
  }

  return null;
};

// ============================================================
// VALIDATE VEHICLE
// ============================================================

export const validateVehicle = (data: AddVehicleData): string | null => {
  if (!data.name.trim()) {
    return "Vehicle name is required.";
  }

  if (!data.brand.trim()) {
    return "Vehicle brand is required.";
  }

  if (!data.model.trim()) {
    return "Vehicle model is required.";
  }

  if (!data.pricePerDay) {
    return "Price per day is required.";
  }

  if (data.pricePerDay <= 0) {
    return "Price per day must be greater than 0.";
  }

  if (
    data.year !== undefined &&
    (data.year < 1900 || data.year > new Date().getFullYear() + 1)
  ) {
    return "Please enter a valid vehicle year.";
  }

  if (data.seats !== undefined && data.seats <= 0) {
    return "Number of seats must be greater than 0.";
  }

  return null;
};

// ============================================================
// SORT VEHICLES
// ============================================================

export const sortVehicles = (
  vehicles: Vehicle[],
  sort:
    | "newest"
    | "oldest"
    | "price-low"
    | "price-high"
    | "rating-high" = "newest",
): Vehicle[] => {
  return [...vehicles].sort((a, b) => {
    switch (sort) {
      case "price-low":
        return (
          (a.pricePerDay ?? a.price ?? 0) - (b.pricePerDay ?? b.price ?? 0)
        );

      case "price-high":
        return (
          (b.pricePerDay ?? b.price ?? 0) - (a.pricePerDay ?? a.price ?? 0)
        );

      case "rating-high":
        return getVehicleRating(b) - getVehicleRating(a);

      case "oldest": {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;

        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return dateA - dateB;
      }

      case "newest":
      default: {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;

        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return dateB - dateA;
      }
    }
  });
};
