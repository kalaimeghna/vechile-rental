import axiosInstance from "../api/axios";

// ============================================================
// TYPES
// ============================================================

export type UserRole = "user" | "owner" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================
// LOGIN
// ============================================================

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/auth/login", data);

  // Save token
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  // Save user
  if (response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

// ============================================================
// REGISTER
// ============================================================

export const registerUser = async (
  data: RegisterData,
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/register",
    data,
  );

  // Some backends automatically login after registration.
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  if (response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

// ============================================================
// LOGOUT
// ============================================================

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Remove other possible authentication values
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // Redirect to login
  window.location.href = "/login";
};

// ============================================================
// GET CURRENT USER
// ============================================================

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as User;
  } catch (error) {
    console.error("Failed to parse current user:", error);

    localStorage.removeItem("user");

    return null;
  }
};

// ============================================================
// GET TOKEN
// ============================================================

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// ============================================================
// CHECK AUTHENTICATION
// ============================================================

export const isAuthenticated = (): boolean => {
  const token = getToken();

  return Boolean(token);
};

// ============================================================
// FORGOT PASSWORD
// ============================================================

export const forgotPassword = async (data: ForgotPasswordData) => {
  const response = await axiosInstance.post("/auth/forgot-password", data);

  return response.data;
};

// ============================================================
// RESET PASSWORD
// ============================================================

export const resetPassword = async (data: ResetPasswordData) => {
  const response = await axiosInstance.post("/auth/reset-password", {
    token: data.token,
    password: data.password,
    confirmPassword: data.confirmPassword,
  });

  return response.data;
};

// ============================================================
// CHANGE PASSWORD
// ============================================================

export const changePassword = async (data: ChangePasswordData) => {
  const response = await axiosInstance.put("/auth/change-password", data);

  return response.data;
};

// ============================================================
// GET PROFILE
// ============================================================

export const getProfile = async (): Promise<User> => {
  const response = await axiosInstance.get<{
    success?: boolean;
    user: User;
  }>("/auth/profile");

  const user = response.data.user;

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
};

// ============================================================
// UPDATE PROFILE
// ============================================================

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await axiosInstance.put<{
    success?: boolean;
    message?: string;
    user: User;
  }>("/auth/profile", data);

  const user = response.data.user;

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
};

// ============================================================
// REFRESH USER FROM LOCAL STORAGE
// ============================================================

export const refreshStoredUser = (): User | null => {
  const token = getToken();

  if (!token) {
    localStorage.removeItem("user");
    return null;
  }

  return getCurrentUser();
};

// ============================================================
// CLEAR AUTH DATA
// ============================================================

export const clearAuthData = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// ============================================================
// GET USER ROLE
// ============================================================

export const getUserRole = (): UserRole | null => {
  const user = getCurrentUser();

  return user?.role ?? null;
};

// ============================================================
// ROLE CHECKS
// ============================================================

export const isAdmin = (): boolean => {
  return getUserRole() === "admin";
};

export const isOwner = (): boolean => {
  return getUserRole() === "owner";
};

export const isUser = (): boolean => {
  return getUserRole() === "user";
};

// ============================================================
// ROLE REDIRECT
// ============================================================

export const getDashboardPath = (role?: UserRole): string => {
  const userRole = role ?? getUserRole();

  switch (userRole) {
    case "admin":
      return "/admin/dashboard";

    case "owner":
      return "/owner/dashboard";

    case "user":
      return "/dashboard";

    default:
      return "/";
  }
};
