import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axios";
import {
  Search,
  Users as UsersIcon,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

// =======================================================
// TYPES
// =======================================================

type UserRole = "jobseeker" | "employer" | "admin" | string;

interface UserData {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  status?: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UsersResponse {
  users?: UserData[];
  data?: UserData[];
}

// =======================================================
// ERROR HELPER
// =======================================================

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data;

    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData
    ) {
      const message: unknown = (
        responseData as {
          message?: unknown;
        }
      ).message;

      if (typeof message === "string") {
        return message;
      }
    }

    if (typeof responseData === "string") {
      return responseData;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

// =======================================================
// COMPONENT
// =======================================================

const Users: React.FC = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [users, setUsers] = useState<UserData[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");

  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const [error, setError] = useState<string>("");

  const itemsPerPage = 10;

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async (showRefresh = false): Promise<void> => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axiosInstance.get<UserData[] | UsersResponse>(
        "/users",
      );

      const responseData = response.data;

      let userList: UserData[] = [];

      if (Array.isArray(responseData)) {
        userList = responseData;
      } else if (Array.isArray(responseData.users)) {
        userList = responseData.users;
      } else if (Array.isArray(responseData.data)) {
        userList = responseData.data;
      }

      setUsers(userList);
    } catch (error: unknown) {
      console.error("Failed to fetch users:", error);

      setError(
        getErrorMessage(error, "Failed to load users. Please try again."),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get<UserData[] | UsersResponse>(
          "/users",
        );

        if (cancelled) {
          return;
        }

        const responseData = response.data;

        let userList: UserData[] = [];

        if (Array.isArray(responseData)) {
          userList = responseData;
        } else if (Array.isArray(responseData.users)) {
          userList = responseData.users;
        } else if (Array.isArray(responseData.data)) {
          userList = responseData.data;
        }

        setUsers(userList);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        console.error("Failed to fetch users:", error);

        setError(
          getErrorMessage(error, "Failed to load users. Please try again."),
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // USER STATUS
  // =====================================================

  const getUserStatus = (user: UserData): "active" | "inactive" => {
    if (user.isActive === false || user.status?.toLowerCase() === "inactive") {
      return "inactive";
    }

    return "active";
  };

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const searchableText = [user.name, user.email, user.phone, user.role]
        .filter((value): value is string => typeof value === "string")
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchValue === "" || searchableText.includes(searchValue);

      const matchesRole =
        roleFilter === "all" ||
        user.role?.toLowerCase() === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" || getUserStatus(user) === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  // =====================================================
  // ROLE FILTER
  // =====================================================

  const handleRoleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setRoleFilter(event.target.value);
    setCurrentPage(1);
  };

  // =====================================================
  // STATUS FILTER
  // =====================================================

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const handleClearFilters = (): void => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (userId: string): Promise<void> => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(userId);

      await axiosInstance.delete(`/users/${userId}`);

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user._id !== userId),
      );

      if (paginatedUsers.length === 1 && safeCurrentPage > 1) {
        setCurrentPage((page) => Math.max(1, page - 1));
      }
    } catch (error: unknown) {
      console.error("Failed to delete user:", error);

      alert(getErrorMessage(error, "Failed to delete user. Please try again."));
    } finally {
      setDeleteLoading(null);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date?: string): string => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // ROLE BADGE
  // =====================================================

  const renderRoleBadge = (role?: string): React.ReactNode => {
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole === "admin") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
          <Shield size={13} />
          Admin
        </span>
      );
    }

    if (normalizedRole === "employer") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          <UsersIcon size={13} />
          Employer
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        <User size={13} />
        Jobseeker
      </span>
    );
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const renderStatusBadge = (user: UserData): React.ReactNode => {
    const status = getUserStatus(user);

    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <CheckCircle size={13} />
          Active
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        <XCircle size={13} />
        Inactive
      </span>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage registered users and their accounts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchUsers(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={() => void fetchUsers()}
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* TOTAL */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {users.length}
                </p>
              </div>

              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <UsersIcon size={22} />
              </div>
            </div>
          </div>

          {/* ACTIVE */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {
                    users.filter((user) => getUserStatus(user) === "active")
                      .length
                  }
                </p>
              </div>

              <div className="rounded-lg bg-green-100 p-3 text-green-600">
                <CheckCircle size={22} />
              </div>
            </div>
          </div>

          {/* EMPLOYERS */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Employers</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {
                    users.filter(
                      (user) => user.role?.toLowerCase() === "employer",
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                <Shield size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* SEARCH */}

            <div className="relative md:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name, email or phone..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* ROLE */}

            <select
              value={roleFilter}
              onChange={handleRoleChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Roles</option>

              <option value="jobseeker">Jobseeker</option>

              <option value="employer">Employer</option>

              <option value="admin">Admin</option>
            </select>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Status</option>

              <option value="active">Active</option>

              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* FILTER INFO */}

          {(search || roleFilter !== "all" || statusFilter !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredUsers.length}
                </span>{" "}
                matching users
              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* =================================================
            USERS
        ================================================= */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {paginatedUsers.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <UsersIcon size={36} className="text-gray-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                No users found
              </h3>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                {search || roleFilter !== "all" || statusFilter !== "all"
                  ? "Try changing your search or filters."
                  : "There are no registered users yet."}
              </p>

              {(search || roleFilter !== "all" || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        User
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Role
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Joined
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="transition hover:bg-gray-50"
                      >
                        {/* USER */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt={user.name || "User"}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <User size={19} />
                              </div>
                            )}

                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name || "Unnamed User"}
                              </p>

                              <p className="text-xs text-gray-500">
                                ID: {user._id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CONTACT */}

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail size={14} />

                              <span>{user.email || "No email"}</span>
                            </div>

                            {user.phone && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Phone size={13} />

                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* ROLE */}

                        <td className="px-6 py-4">
                          {renderRoleBadge(user.role)}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">{renderStatusBadge(user)}</td>

                        {/* DATE */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={14} />

                            {formatDate(user.createdAt)}
                          </div>
                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => void handleDeleteUser(user._id)}
                            disabled={deleteLoading === user._id}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deleteLoading === user._id ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE CARDS
              ================================================= */}

              <div className="divide-y divide-gray-100 md:hidden">
                {paginatedUsers.map((user) => (
                  <div key={user._id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name || "User"}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <User size={20} />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.name || "Unnamed User"}
                          </p>

                          <p className="text-sm text-gray-500">
                            {user.email || "No email"}
                          </p>
                        </div>
                      </div>

                      {renderStatusBadge(user)}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Role</p>

                        <div className="mt-1">{renderRoleBadge(user.role)}</div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Joined</p>

                        <p className="mt-1 text-sm text-gray-600">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>

                      {user.phone && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-400">Phone</p>

                          <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} />

                            {user.phone}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleDeleteUser(user._id)}
                      disabled={deleteLoading === user._id}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleteLoading === user._id ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Delete User
                    </button>
                  </div>
                ))}
              </div>

              {/* =================================================
                  PAGINATION
              ================================================= */}

              <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {filteredUsers.length === 0 ? 0 : startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-700">
                    {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {filteredUsers.length}
                  </span>{" "}
                  users
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={safeCurrentPage === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <span className="px-2 text-sm text-gray-600">
                    Page {safeCurrentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={safeCurrentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
