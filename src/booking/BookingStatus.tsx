import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarClock,
  Car,
  AlertCircle,
  
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

export type BookingStatusType =
  | "pending"
  | "confirmed"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed"
  | "ongoing"
  | "active"
  | "expired"
  | "refunded";

interface BookingStatusProps {
  status?: string;

  /**
   * Show icon
   */
  showIcon?: boolean;

  /**
   * Show status label
   */
  showLabel?: boolean;

  /**
   * Badge size
   */
  size?: "sm" | "md" | "lg";

  /**
   * Badge style
   */
  variant?: "badge" | "pill" | "text";

  /**
   * Optional custom class
   */
  className?: string;
}

// =========================================================
// STATUS CONFIG
// =========================================================

const statusConfig: Record<
  BookingStatusType,
  {
    label: string;
    icon: React.ElementType;
    wrapper: string;
    text: string;
    iconColor: string;
  }
> = {
  pending: {
    label: "Pending",
    icon: Clock3,
    wrapper: "bg-yellow-50 border-yellow-200",
    text: "text-yellow-700",
    iconColor: "text-yellow-600",
  },

  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    wrapper: "bg-green-50 border-green-200",
    text: "text-green-700",
    iconColor: "text-green-600",
  },

  approved: {
    label: "Approved",
    icon: CheckCircle2,
    wrapper: "bg-green-50 border-green-200",
    text: "text-green-700",
    iconColor: "text-green-600",
  },

  rejected: {
    label: "Rejected",
    icon: XCircle,
    wrapper: "bg-red-50 border-red-200",
    text: "text-red-700",
    iconColor: "text-red-600",
  },

  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    wrapper: "bg-gray-100 border-gray-200",
    text: "text-gray-600",
    iconColor: "text-gray-500",
  },

  completed: {
    label: "Completed",
    icon: CheckCircle2,
    wrapper: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    iconColor: "text-blue-600",
  },

  ongoing: {
    label: "Ongoing",
    icon: Car,
    wrapper: "bg-purple-50 border-purple-200",
    text: "text-purple-700",
    iconColor: "text-purple-600",
  },

  active: {
    label: "Active",
    icon: Car,
    wrapper: "bg-purple-50 border-purple-200",
    text: "text-purple-700",
    iconColor: "text-purple-600",
  },

  expired: {
    label: "Expired",
    icon: CalendarClock,
    wrapper: "bg-gray-100 border-gray-200",
    text: "text-gray-600",
    iconColor: "text-gray-500",
  },

  refunded: {
    label: "Refunded",
    icon: CheckCircle2,
    wrapper: "bg-indigo-50 border-indigo-200",
    text: "text-indigo-700",
    iconColor: "text-indigo-600",
  },
};

// =========================================================
// DEFAULT CONFIG
// =========================================================

const defaultConfig = {
  label: "Unknown",
  icon: AlertCircle,
  wrapper: "bg-gray-100 border-gray-200",
  text: "text-gray-600",
  iconColor: "text-gray-500",
};

// =========================================================
// COMPONENT
// =========================================================

const BookingStatus: React.FC<BookingStatusProps> = ({
  status = "pending",
  showIcon = true,
  showLabel = true,
  size = "md",
  variant = "badge",
  className = "",
}) => {
  // =======================================================
  // NORMALIZE STATUS
  // =======================================================

  const normalizedStatus = status
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_") as BookingStatusType;

  const config = statusConfig[normalizedStatus] || defaultConfig;

  const Icon = config.icon;

  // =======================================================
  // SIZE
  // =======================================================

  const sizeClasses = {
    sm: {
      wrapper: "px-2 py-1 text-xs gap-1",
      icon: "w-3.5 h-3.5",
    },

    md: {
      wrapper: "px-2.5 py-1.5 text-sm gap-1.5",
      icon: "w-4 h-4",
    },

    lg: {
      wrapper: "px-3.5 py-2 text-sm gap-2",
      icon: "w-5 h-5",
    },
  };

  // =======================================================
  // TEXT VARIANT
  // =======================================================

  if (variant === "text") {
    return (
      <span
        className={`
          inline-flex
          items-center
          gap-1.5
          font-medium
          ${config.text}
          ${size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"}
          ${className}
        `}
      >
        {showIcon && <Icon className={sizeClasses[size].icon} />}

        {showLabel && <span>{config.label}</span>}
      </span>
    );
  }

  // =======================================================
  // PILL VARIANT
  // =======================================================

  if (variant === "pill") {
    return (
      <span
        className={`
          inline-flex
          items-center
          justify-center
          rounded-full
          border
          font-medium
          ${config.wrapper}
          ${config.text}
          ${sizeClasses[size].wrapper}
          ${className}
        `}
      >
        {showIcon && <Icon className={sizeClasses[size].icon} />}

        {showLabel && <span>{config.label}</span>}
      </span>
    );
  }

  // =======================================================
  // BADGE VARIANT
  // =======================================================

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-lg
        border
        font-medium
        ${config.wrapper}
        ${config.text}
        ${sizeClasses[size].wrapper}
        ${className}
      `}
    >
      {showIcon && <Icon className={sizeClasses[size].icon} />}

      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

export default BookingStatus;
