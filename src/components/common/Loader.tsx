import React from "react";
import { Loader2 } from "lucide-react";

// =========================================================
// TYPES
// =========================================================

interface LoaderProps {
  /**
   * Loader size
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * Optional loading text
   */
  text?: string;

  /**
   * Full-screen loader
   */
  fullScreen?: boolean;

  /**
   * Show text or only spinner
   */
  showText?: boolean;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Spinner color
   */
  color?: "blue" | "gray" | "white" | "red" | "green";

  /**
   * Vertical or horizontal layout
   */
  direction?: "row" | "column";
}

// =========================================================
// COMPONENT
// =========================================================

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  text = "Loading...",
  fullScreen = false,
  showText = true,
  className = "",
  color = "blue",
  direction = "column",
}) => {
  // =======================================================
  // SIZE
  // =======================================================

  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-14 h-14",
  };

  // =======================================================
  // COLOR
  // =======================================================

  const colorClasses = {
    blue: "text-blue-600",
    gray: "text-gray-500",
    white: "text-white",
    red: "text-red-600",
    green: "text-green-600",
  };

  // =======================================================
  // CONTAINER
  // =======================================================

  const containerClasses = fullScreen
    ? `
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-white/80
        backdrop-blur-sm
      `
    : `
        flex
        items-center
        justify-center
        ${direction === "column" ? "flex-col" : "flex-row"}
      `;

  // =======================================================
  // UI
  // =======================================================

  return (
    <div
      className={`
        ${containerClasses}
        ${className}
      `}
    >
      {/* Spinner */}

      <Loader2
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          animate-spin
          shrink-0
        `}
        aria-label="Loading"
      />

      {/* Text */}

      {showText && (
        <span
          className={`
            text-sm
            ${color === "white" ? "text-white" : "text-gray-600"}
            ${direction === "column" ? "mt-3" : "ml-2"}
          `}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;
