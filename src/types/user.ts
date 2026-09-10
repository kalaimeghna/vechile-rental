// ============================================================
// USER TYPES
// ============================================================

export type UserRole = "user" | "owner" | "admin";

export type UserStatus = "active" | "inactive" | "blocked" | "suspended";

// ============================================================
// USER
// ============================================================

export interface User {
  _id: string;

  name: string;

  email: string;

  phone?: string;

  role: UserRole;

  status?: UserStatus;

  profilePicture?: string;

  avatar?: string;

  address?: string;

  city?: string;

  state?: string;

  country?: string;

  pincode?: string;

  dateOfBirth?: string;

  gender?: string;

  isVerified?: boolean;

  isEmailVerified?: boolean;

  isPhoneVerified?: boolean;

  createdAt?: string;

  updatedAt?: string;
}

// ============================================================
// OWNER
// ============================================================

export interface Owner extends User {
  role: "owner";

  businessName?: string;

  businessDescription?: string;

  ownerRating?: number;

  totalVehicles?: number;

  totalBookings?: number;

  totalEarnings?: number;
}

// ============================================================
// ADMIN
// ============================================================

export interface Admin extends User {
  role: "admin";

  permissions?: string[];

  lastLogin?: string;
}

// ============================================================
// REGISTER USER
// ============================================================

export interface RegisterUserData {
  name: string;

  email: string;

  password: string;

  phone?: string;

  role?: UserRole;
}

// ============================================================
// LOGIN
// ============================================================

export interface LoginUserData {
  email: string;

  password: string;
}

// ============================================================
// UPDATE USER
// ============================================================

export interface UpdateUserData {
  name?: string;

  email?: string;

  phone?: string;

  profilePicture?: string;

  address?: string;

  city?: string;

  state?: string;

  country?: string;

  pincode?: string;

  dateOfBirth?: string;

  gender?: string;
}

// ============================================================
// UPDATE USER ROLE
// ============================================================

export interface UpdateUserRoleData {
  role: UserRole;
}

// ============================================================
// UPDATE USER STATUS
// ============================================================

export interface UpdateUserStatusData {
  status: UserStatus;
}

// ============================================================
// CHANGE PASSWORD
// ============================================================

export interface ChangePasswordData {
  currentPassword: string;

  newPassword: string;

  confirmPassword: string;
}

// ============================================================
// FORGOT PASSWORD
// ============================================================

export interface ForgotPasswordData {
  email: string;
}

// ============================================================
// RESET PASSWORD
// ============================================================

export interface ResetPasswordData {
  token: string;

  password: string;

  confirmPassword: string;
}

// ============================================================
// AUTH RESPONSE
// ============================================================

export interface AuthResponse {
  success?: boolean;

  message?: string;

  token?: string;

  user?: User;
}

// ============================================================
// USER RESPONSE
// ============================================================

export interface UserResponse {
  success?: boolean;

  message?: string;

  user?: User;

  data?: User;
}

// ============================================================
// USERS RESPONSE
// ============================================================

export interface UsersResponse {
  success?: boolean;

  message?: string;

  users?: User[];

  data?: User[];

  total?: number;

  page?: number;

  limit?: number;

  pages?: number;

  totalPages?: number;
}

// ============================================================
// USER FILTERS
// ============================================================

export interface UserFilters {
  search?: string;

  role?: UserRole;

  status?: UserStatus;

  isVerified?: boolean;

  page?: number;

  limit?: number;

  sort?: "newest" | "oldest" | "name";
}

// ============================================================
// USER PAGINATION
// ============================================================

export interface UserPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

// ============================================================
// USER STATISTICS
// ============================================================

export interface UserStatistics {
  totalUsers: number;

  totalOwners: number;

  totalAdmins: number;

  activeUsers: number;

  inactiveUsers: number;

  blockedUsers: number;

  verifiedUsers: number;

  unverifiedUsers: number;
}

// ============================================================
// USER CARD PROPS
// ============================================================

export interface UserCardProps {
  user: User;

  showActions?: boolean;

  onEdit?: (user: User) => void;

  onDelete?: (user: User) => void;

  onBlock?: (user: User) => void;

  onUnblock?: (user: User) => void;
}

// ============================================================
// USER TABLE PROPS
// ============================================================

export interface UserTableProps {
  users: User[];

  loading?: boolean;

  onEdit?: (user: User) => void;

  onDelete?: (user: User) => void;

  onStatusChange?: (user: User, status: UserStatus) => void;
}

// ============================================================
// PROFILE
// ============================================================

export interface UserProfile {
  _id: string;

  name: string;

  email: string;

  phone?: string;

  role: UserRole;

  profilePicture?: string;

  address?: string;

  city?: string;

  state?: string;

  country?: string;

  pincode?: string;

  dateOfBirth?: string;

  gender?: string;

  isVerified?: boolean;

  createdAt?: string;

  updatedAt?: string;
}

// ============================================================
// ROLE HELPERS
// ============================================================

export const USER_ROLES: UserRole[] = ["user", "owner", "admin"];

// ============================================================
// STATUS HELPERS
// ============================================================

export const USER_STATUSES: UserStatus[] = [
  "active",
  "inactive",
  "blocked",
  "suspended",
];

// ============================================================
// ROLE LABEL
// ============================================================

export const getUserRoleLabel = (role?: UserRole): string => {
  switch (role) {
    case "user":
      return "User";

    case "owner":
      return "Vehicle Renter";

    case "admin":
      return "Administrator";

    default:
      return "Unknown";
  }
};

// ============================================================
// STATUS LABEL
// ============================================================

export const getUserStatusLabel = (status?: UserStatus): string => {
  switch (status) {
    case "active":
      return "Active";

    case "inactive":
      return "Inactive";

    case "blocked":
      return "Blocked";

    case "suspended":
      return "Suspended";

    default:
      return "Unknown";
  }
};

// ============================================================
// ROLE COLOR
// ============================================================

export const getUserRoleColor = (role?: UserRole): string => {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-700";

    case "owner":
      return "bg-blue-100 text-blue-700";

    case "user":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ============================================================
// STATUS COLOR
// ============================================================

export const getUserStatusColor = (status?: UserStatus): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";

    case "inactive":
      return "bg-gray-100 text-gray-700";

    case "blocked":
      return "bg-red-100 text-red-700";

    case "suspended":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ============================================================
// GET USER NAME
// ============================================================

export const getUserName = (user?: User | string | null): string => {
  if (!user) {
    return "Unknown User";
  }

  if (typeof user === "string") {
    return user;
  }

  return user.name || "Unknown User";
};

// ============================================================
// GET USER EMAIL
// ============================================================

export const getUserEmail = (user?: User | string | null): string => {
  if (!user) {
    return "";
  }

  if (typeof user === "string") {
    return "";
  }

  return user.email || "";
};

// ============================================================
// GET PROFILE IMAGE
// ============================================================

export const getUserProfileImage = (
  user?: User | string | null,
): string | null => {
  if (!user || typeof user === "string") {
    return null;
  }

  return user.profilePicture || user.avatar || null;
};

// ============================================================
// GET INITIALS
// ============================================================

export const getUserInitials = (user?: User | string | null): string => {
  if (!user) {
    return "U";
  }

  if (typeof user === "string") {
    return user
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }

  if (!user.name) {
    return "U";
  }

  return user.name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

// ============================================================
// CHECK ROLE
// ============================================================

export const hasRole = (
  user: User | null | undefined,
  role: UserRole,
): boolean => {
  return user?.role === role;
};

// ============================================================
// CHECK ADMIN
// ============================================================

export const isAdminUser = (user: User | null | undefined): boolean => {
  return user?.role === "admin";
};

// ============================================================
// CHECK OWNER
// ============================================================

export const isOwnerUser = (user: User | null | undefined): boolean => {
  return user?.role === "owner";
};

// ============================================================
// CHECK NORMAL USER
// ============================================================

export const isNormalUser = (user: User | null | undefined): boolean => {
  return user?.role === "user";
};

// ============================================================
// CHECK ACTIVE
// ============================================================

export const isActiveUser = (user: User | null | undefined): boolean => {
  return user?.status === "active";
};

// ============================================================
// CHECK BLOCKED
// ============================================================

export const isBlockedUser = (user: User | null | undefined): boolean => {
  return user?.status === "blocked";
};

// ============================================================
// CHECK VERIFIED
// ============================================================

export const isVerifiedUser = (user: User | null | undefined): boolean => {
  return Boolean(user?.isVerified || user?.isEmailVerified);
};

// ============================================================
// FORMAT USER JOIN DATE
// ============================================================

export const formatUserDate = (date?: string): string => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
