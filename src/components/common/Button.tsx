import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

// =========================================================
// TYPES
// =========================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  /**
   * Button appearance
   */
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "outline"
    | "ghost"
    | "link";

  /**
   * Button size
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * Show loading spinner
   */
  loading?: boolean;

  /**
   * Text shown while loading
   */
  loadingText?: string;

  /**
   * Icon displayed before children
   */
  leftIcon?: ReactNode;

  /**
   * Icon displayed after children
   */
  rightIcon?: ReactNode;

  /**
   * Make button full width
   */
  fullWidth?: boolean;

  /**
   * Round button
   */
  rounded?: "sm" | "md" | "lg" | "full";

  /**
   * Icon-only button
   */
  iconOnly?: boolean;
}

// =========================================================
// COMPONENT
// =========================================================

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = "lg",
      iconOnly = false,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref,
  ) => {
    // =======================================================
    // VARIANTS
    // =======================================================

    const variantClasses = {
      primary: `
        bg-blue-600
        text-white
        border-blue-600
        hover:bg-blue-700
        hover:border-blue-700
        active:bg-blue-800
        focus:ring-blue-500
      `,

      secondary: `
        bg-gray-900
        text-white
        border-gray-900
        hover:bg-gray-800
        hover:border-gray-800
        active:bg-gray-950
        focus:ring-gray-500
      `,

      success: `
        bg-green-600
        text-white
        border-green-600
        hover:bg-green-700
        hover:border-green-700
        active:bg-green-800
        focus:ring-green-500
      `,

      danger: `
        bg-red-600
        text-white
        border-red-600
        hover:bg-red-700
        hover:border-red-700
        active:bg-red-800
        focus:ring-red-500
      `,

      warning: `
        bg-yellow-500
        text-white
        border-yellow-500
        hover:bg-yellow-600
        hover:border-yellow-600
        active:bg-yellow-700
        focus:ring-yellow-500
      `,

      outline: `
        bg-white
        text-blue-600
        border-blue-600
        hover:bg-blue-50
        active:bg-blue-100
        focus:ring-blue-500
      `,

      ghost: `
        bg-transparent
        text-gray-700
        border-transparent
        hover:bg-gray-100
        active:bg-gray-200
        focus:ring-gray-400
      `,

      link: `
        bg-transparent
        text-blue-600
        border-transparent
        hover:text-blue-700
        hover:underline
        active:text-blue-800
        focus:ring-blue-500
        px-0
      `,
    };

    // =======================================================
    // SIZE
    // =======================================================

    const sizeClasses = {
      xs: `
        min-h-7
        px-2.5
        text-xs
        gap-1.5
      `,

      sm: `
        min-h-9
        px-3.5
        text-sm
        gap-2
      `,

      md: `
        min-h-10
        px-4
        text-sm
        gap-2
      `,

      lg: `
        min-h-11
        px-5
        text-base
        gap-2
      `,

      xl: `
        min-h-12
        px-6
        text-base
        gap-2.5
      `,
    };

    // =======================================================
    // ROUNDED
    // =======================================================

    const roundedClasses = {
      sm: "rounded-md",
      md: "rounded-lg",
      lg: "rounded-xl",
      full: "rounded-full",
    };

    // =======================================================
    // WIDTH
    // =======================================================

    const widthClass = fullWidth ? "w-full" : "inline-flex";

    // =======================================================
    // DISABLED
    // =======================================================

    const disabledClasses =
      disabled || loading
        ? `
          opacity-60
          cursor-not-allowed
          pointer-events-none
        `
        : "";

    // =======================================================
    // ICON ONLY
    // =======================================================

    const iconOnlyClasses = iconOnly
      ? `
          !p-0
          aspect-square
          justify-center
        `
      : "";

    // =======================================================
    // FINAL CLASS
    // =======================================================

    const buttonClassName = `
      ${widthClass}
      items-center
      justify-center
      font-medium
      border
      whitespace-nowrap
      transition-all
      duration-200
      focus:outline-none
      focus:ring-2
      focus:ring-offset-2
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${roundedClasses[rounded]}
      ${disabledClasses}
      ${iconOnlyClasses}
      ${className}
    `;

    // =======================================================
    // UI
    // =======================================================

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={buttonClassName}
        aria-busy={loading ? true : undefined}
        {...props}
      >
        {/* =================================================
            LOADING
        ================================================== */}

        {loading ? (
          <>
            <Loader2
              className="
                w-4
                h-4
                animate-spin
                shrink-0
              "
            />

            {!iconOnly && <span>{loadingText || "Loading..."}</span>}
          </>
        ) : (
          <>
            {/* LEFT ICON */}

            {leftIcon && <span className="shrink-0">{leftIcon}</span>}

            {/* CONTENT */}

            {!iconOnly && <span>{children}</span>}

            {/* RIGHT ICON */}

            {rightIcon && <span className="shrink-0">{rightIcon}</span>}

            {/* Icon-only content */}

            {iconOnly && (
              <span className="flex items-center justify-center">
                {children}
              </span>
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
