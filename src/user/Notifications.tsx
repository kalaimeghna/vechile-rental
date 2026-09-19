import React, { useMemo, useState } from "react";
import {
  Check,
  CheckCheck,
  Trash2,
  CalendarCheck,
  Car,
  CreditCard,
  AlertCircle,
  MessageSquare,
  Settings,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

export type NotificationType =
  | "booking"
  | "payment"
  | "vehicle"
  | "message"
  | "alert"
  | "system";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

/* ============================================================
   SAMPLE DATA
   Replace this with API data later.
============================================================ */

const defaultNotifications: Notification[] = [
  {
    _id: "notification-1",
    title: "Booking Confirmed",
    message: "Your booking for Toyota Fortuner has been confirmed.",
    type: "booking",
    isRead: false,
    createdAt: "2026-08-18T12:30:00",
    link: "/my-bookings",
  },
  {
    _id: "notification-2",
    title: "Payment Successful",
    message: "Your payment of ₹7,000 has been successfully processed.",
    type: "payment",
    isRead: false,
    createdAt: "2026-08-18T10:15:00",
    link: "/my-bookings",
  },
  {
    _id: "notification-3",
    title: "Vehicle Available",
    message: "Hyundai Creta is now available for your selected dates.",
    type: "vehicle",
    isRead: true,
    createdAt: "2026-08-17T16:20:00",
    link: "/vehicles",
  },
  {
    _id: "notification-4",
    title: "New Message",
    message: "The vehicle owner sent you a new message.",
    type: "message",
    isRead: false,
    createdAt: "2026-08-17T14:10:00",
    link: "/messages",
  },
  {
    _id: "notification-5",
    title: "Booking Reminder",
    message: "Your vehicle pickup is scheduled for tomorrow.",
    type: "alert",
    isRead: true,
    createdAt: "2026-08-16T09:30:00",
    link: "/my-bookings",
  },
  {
    _id: "notification-6",
    title: "Welcome to DriveRent",
    message: "Your account has been successfully created.",
    type: "system",
    isRead: true,
    createdAt: "2026-08-15T08:00:00",
  },
];

/* ============================================================
   PROPS
============================================================ */

interface NotificationsProps {
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => Promise<void> | void;
  onDelete?: (notificationId: string) => Promise<void> | void;
  onMarkAllAsRead?: () => Promise<void> | void;
  onClearAll?: () => Promise<void> | void;
}

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

const formatNotificationTime = (dateString: string): string => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const now = new Date();
  const difference = now.getTime() - date.getTime();
  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ============================================================
   ICON
============================================================ */

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case "booking":
      return <CalendarCheck size={20} />;
    case "payment":
      return <CreditCard size={20} />;
    case "vehicle":
      return <Car size={20} />;
    case "message":
      return <MessageSquare size={20} />;
    case "alert":
      return <AlertCircle size={20} />;
    case "system":
    default:
      return <Settings size={20} />;
  }
};

/* ============================================================
   ICON BACKGROUND
============================================================ */

const getIconStyle = (type: NotificationType): string => {
  switch (type) {
    case "booking":
      return "bg-blue-50 text-blue-600";
    case "payment":
      return "bg-green-50 text-green-600";
    case "vehicle":
      return "bg-purple-50 text-purple-600";
    case "message":
      return "bg-orange-50 text-orange-600";
    case "alert":
      return "bg-red-50 text-red-600";
    case "system":
    default:
      return "bg-slate-100 text-slate-600";
  }
};

/* ============================================================
   COMPONENT
============================================================ */

export default function Notifications({
  notifications = defaultNotifications,
  onNotificationClick,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  onClearAll,
}: NotificationsProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);

  /* ==========================================================
     UNREAD COUNT
  ========================================================== */

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.isRead).length;
  }, [notifications]);

  /* ==========================================================
     FILTERED NOTIFICATIONS
  ========================================================== */

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread") {
      return notifications.filter((notification) => !notification.isRead);
    }
    return notifications;
  }, [notifications, activeFilter]);

  /* ==========================================================
     MARK SINGLE AS READ
  ========================================================== */

  const handleMarkAsRead = async (notificationId: string) => {
    const notification = notifications.find(
      (item) => item._id === notificationId,
    );

    if (!notification || notification.isRead) {
      return;
    }

    try {
      setMarkingId(notificationId);
      await onMarkAsRead?.(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setMarkingId(null);
    }
  };

  /* ==========================================================
     CLICK NOTIFICATION
  ========================================================== */

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }
    onNotificationClick?.(notification);
  };

  /* ==========================================================
     MARK ALL AS READ
  ========================================================== */

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      setIsMarkingAll(true);
      await onMarkAllAsRead?.();
    } catch (error) {
      console.error("Failed to mark all notifications:", error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDelete = async (notificationId: string) => {
    try {
      setDeletingId(notificationId);
      await onDelete?.(notificationId);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    } finally {
      setDeletingId(null);
    }
  };

  /* ==========================================================
     CLEAR ALL
  ========================================================== */

  const handleClearAll = async () => {
    if (!notifications.length) {
      return;
    }

    try {
      setIsClearingAll(true);
      await onClearAll?.();
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    } finally {
      setIsClearingAll(false);
    }
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Settings size={23} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  Notifications
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread ${unreadCount === 1 ? "notification" : "notifications"}.`
                    : "You're all caught up."}
                </p>
              </div>
            </div>

            {notifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    disabled={isMarkingAll}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    <CheckCheck size={15} />
                    {isMarkingAll ? "Marking..." : "Mark all read"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={isClearingAll}
                  className="flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  {isClearingAll ? "Clearing..." : "Clear all"}
                </button>
              </div>
            )}
          </div>

          {/* FILTERS */}
          <div className="mt-6 flex gap-2 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All{" "}
              <span className="ml-2 opacity-70">{notifications.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("unread")}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                activeFilter === "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Unread <span className="ml-2 opacity-70">{unreadCount}</span>
            </button>
          </div>
        </div>

        {/* NOTIFICATION LIST */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {filteredNotifications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                {activeFilter === "unread" ? (
                  <CheckCheck size={28} />
                ) : (
                  <Settings size={28} />
                )}
              </div>

              <h2 className="mt-5 text-lg font-black text-slate-800">
                {activeFilter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                {activeFilter === "unread"
                  ? "You have read all your notifications."
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map((notification) => {
                const isDeleting = deletingId === notification._id;
                const isMarking = markingId === notification._id;

                return (
                  <div
                    key={notification._id}
                    className={`group relative flex gap-4 p-5 transition sm:p-6 ${
                      notification.isRead
                        ? "bg-white hover:bg-slate-50"
                        : "bg-blue-50/50 hover:bg-blue-50"
                    }`}
                  >
                    {!notification.isRead && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-blue-600" />
                    )}

                    <button
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getIconStyle(
                        notification.type,
                      )}`}
                    >
                      <NotificationIcon type={notification.type} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <h3
                          className={`truncate text-sm ${
                            notification.isRead
                              ? "font-bold text-slate-700"
                              : "font-black text-slate-900"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        <span className="shrink-0 text-xs text-slate-400">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {notification.message}
                      </p>

                      {notification.link && (
                        <span className="mt-2 inline-block text-xs font-bold text-blue-600">
                          View details →
                        </span>
                      )}
                    </button>

                    <div className="flex shrink-0 items-start gap-1">
                      {!notification.isRead && (
                        <button
                          type="button"
                          title="Mark as read"
                          onClick={() => handleMarkAsRead(notification._id)}
                          disabled={isMarking}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-green-50 hover:text-green-600 disabled:opacity-50"
                        >
                          {isMarking ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-green-600" />
                          ) : (
                            <Check size={17} />
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        title="Delete notification"
                        onClick={() => handleDelete(notification._id)}
                        disabled={isDeleting}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
