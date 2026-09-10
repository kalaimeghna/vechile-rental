// ============================================================
// NOTIFICATION TYPES
// ============================================================

export type NotificationType =
  | "booking"
  | "booking_request"
  | "booking_confirmed"
  | "booking_cancelled"
  | "booking_completed"
  | "payment"
  | "payment_success"
  | "payment_failed"
  | "review"
  | "vehicle"
  | "system"
  | "message"
  | "general";

// ============================================================
// NOTIFICATION PRIORITY
// ============================================================

export type NotificationPriority = "low" | "medium" | "high";

// ============================================================
// NOTIFICATION
// ============================================================

export interface Notification {
  _id: string;

  user:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
      }
    | null;

  title: string;

  message: string;

  type: NotificationType;

  priority?: NotificationPriority;

  isRead: boolean;

  readAt?: string | null;

  booking?:
    | string
    | {
        _id: string;
      }
    | null;

  vehicle?:
    | string
    | {
        _id: string;
        name?: string;
        brand?: string;
        model?: string;
      }
    | null;

  payment?:
    | string
    | {
        _id: string;
      }
    | null;

  review?:
    | string
    | {
        _id: string;
      }
    | null;

  link?: string;

  actionUrl?: string;

  createdAt?: string;

  updatedAt?: string;
}

// ============================================================
// CREATE NOTIFICATION
// ============================================================

export interface CreateNotificationData {
  userId: string;

  title: string;

  message: string;

  type?: NotificationType;

  priority?: NotificationPriority;

  bookingId?: string;

  vehicleId?: string;

  paymentId?: string;

  reviewId?: string;

  link?: string;
}

// ============================================================
// UPDATE NOTIFICATION
// ============================================================

export interface UpdateNotificationData {
  isRead?: boolean;
}

// ============================================================
// NOTIFICATION RESPONSE
// ============================================================

export interface NotificationResponse {
  success?: boolean;

  message?: string;

  notification?: Notification;

  data?: Notification;
}

// ============================================================
// NOTIFICATIONS RESPONSE
// ============================================================

export interface NotificationsResponse {
  success?: boolean;

  message?: string;

  notifications?: Notification[];

  data?: Notification[];

  total?: number;

  unreadCount?: number;

  page?: number;

  limit?: number;

  totalPages?: number;

  pages?: number;
}

// ============================================================
// NOTIFICATION FILTERS
// ============================================================

export interface NotificationFilters {
  type?: NotificationType;

  priority?: NotificationPriority;

  isRead?: boolean;

  page?: number;

  limit?: number;

  search?: string;
}

// ============================================================
// NOTIFICATION PAGINATION
// ============================================================

export interface NotificationPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  unreadCount?: number;
}

// ============================================================
// NOTIFICATION PROPS
// ============================================================

export interface NotificationCardProps {
  notification: Notification;

  onRead?: (notification: Notification) => void;

  onDelete?: (notification: Notification) => void;

  onClick?: (notification: Notification) => void;
}

export interface NotificationListProps {
  notifications: Notification[];

  loading?: boolean;

  onRead?: (notification: Notification) => void;

  onDelete?: (notification: Notification) => void;
}

// ============================================================
// NOTIFICATION TYPE LABEL
// ============================================================

export const getNotificationTypeLabel = (type?: NotificationType): string => {
  switch (type) {
    case "booking":
      return "Booking";

    case "booking_request":
      return "Booking Request";

    case "booking_confirmed":
      return "Booking Confirmed";

    case "booking_cancelled":
      return "Booking Cancelled";

    case "booking_completed":
      return "Booking Completed";

    case "payment":
      return "Payment";

    case "payment_success":
      return "Payment Successful";

    case "payment_failed":
      return "Payment Failed";

    case "review":
      return "Review";

    case "vehicle":
      return "Vehicle";

    case "message":
      return "Message";

    case "system":
      return "System";

    case "general":
      return "General";

    default:
      return "Notification";
  }
};

// ============================================================
// NOTIFICATION TYPE COLOR
// ============================================================

export const getNotificationTypeColor = (type?: NotificationType): string => {
  switch (type) {
    case "booking":
    case "booking_request":
      return "bg-blue-100 text-blue-700";

    case "booking_confirmed":
      return "bg-green-100 text-green-700";

    case "booking_cancelled":
      return "bg-red-100 text-red-700";

    case "booking_completed":
      return "bg-emerald-100 text-emerald-700";

    case "payment":
    case "payment_success":
      return "bg-purple-100 text-purple-700";

    case "payment_failed":
      return "bg-red-100 text-red-700";

    case "review":
      return "bg-yellow-100 text-yellow-700";

    case "vehicle":
      return "bg-indigo-100 text-indigo-700";

    case "message":
      return "bg-cyan-100 text-cyan-700";

    case "system":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ============================================================
// PRIORITY COLOR
// ============================================================

export const getNotificationPriorityColor = (
  priority?: NotificationPriority,
): string => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700";

    case "medium":
      return "bg-yellow-100 text-yellow-700";

    case "low":
      return "bg-gray-100 text-gray-600";

    default:
      return "bg-gray-100 text-gray-600";
  }
};

// ============================================================
// PRIORITY LABEL
// ============================================================

export const getNotificationPriorityLabel = (
  priority?: NotificationPriority,
): string => {
  switch (priority) {
    case "high":
      return "High";

    case "medium":
      return "Medium";

    case "low":
      return "Low";

    default:
      return "Normal";
  }
};

// ============================================================
// FORMAT NOTIFICATION DATE
// ============================================================

export const formatNotificationDate = (date?: string): string => {
  if (!date) {
    return "";
  }

  const notificationDate = new Date(date);

  if (Number.isNaN(notificationDate.getTime())) {
    return "";
  }

  return notificationDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ============================================================
// FORMAT NOTIFICATION TIME
// ============================================================

export const formatNotificationTime = (date?: string): string => {
  if (!date) {
    return "";
  }

  const notificationDate = new Date(date);

  if (Number.isNaN(notificationDate.getTime())) {
    return "";
  }

  return notificationDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============================================================
// RELATIVE TIME
// ============================================================

export const getNotificationRelativeTime = (date?: string): string => {
  if (!date) {
    return "";
  }

  const notificationDate = new Date(date);

  if (Number.isNaN(notificationDate.getTime())) {
    return "";
  }

  const now = new Date();

  const difference = now.getTime() - notificationDate.getTime();

  const seconds = Math.floor(difference / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  }

  return formatNotificationDate(date);
};

// ============================================================
// CHECK UNREAD
// ============================================================

export const isNotificationUnread = (notification: Notification): boolean => {
  return !notification.isRead;
};

// ============================================================
// COUNT UNREAD
// ============================================================

export const countUnreadNotifications = (
  notifications: Notification[],
): number => {
  return notifications.filter((notification) => !notification.isRead).length;
};

// ============================================================
// SORT NOTIFICATIONS
// ============================================================

export const sortNotificationsByDate = (
  notifications: Notification[],
): Notification[] => {
  return [...notifications].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;

    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    return dateB - dateA;
  });
};

// ============================================================
// FILTER UNREAD
// ============================================================

export const getUnreadNotifications = (
  notifications: Notification[],
): Notification[] => {
  return notifications.filter((notification) => !notification.isRead);
};

// ============================================================
// FILTER BY TYPE
// ============================================================

export const getNotificationsByType = (
  notifications: Notification[],
  type: NotificationType,
): Notification[] => {
  return notifications.filter((notification) => notification.type === type);
};
