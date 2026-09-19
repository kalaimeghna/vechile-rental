import { forwardRef, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

// =========================================================
// TYPES
// =========================================================

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;

  error?: string;

  helperText?: string;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

  containerClassName?: string;

  labelClassName?: string;

  inputClassName?: string;

  requiredMark?: boolean;

  showPasswordToggle?: boolean;
}

// =========================================================
// COMPONENT
// =========================================================

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName = "",
      labelClassName = "",
      inputClassName = "",
      requiredMark = true,
      showPasswordToggle = false,
      type = "text",
      disabled = false,
      id,
      name,
      ...props
    },
    ref,
  ) => {
    // =======================================================
    // PASSWORD VISIBILITY
    // =======================================================

    const [showPassword, setShowPassword] = useState(false);

    const inputType =
      showPasswordToggle && type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    // =======================================================
    // INPUT ID
    // =======================================================

    const inputId =
      id || name || `input-${Math.random().toString(36).substring(2, 9)}`;

    // =======================================================
    // INPUT STYLES
    // =======================================================

    const hasLeftIcon = Boolean(leftIcon);

    const hasRightIcon =
      Boolean(rightIcon) ||
      (showPasswordToggle && type === "password") ||
      Boolean(error);

    const inputStyles = `
      w-full
      rounded-lg
      border
      bg-white
      text-gray-900
      placeholder:text-gray-400
      outline-none
      transition-all
      duration-200
      px-3
      py-2.5
      text-sm

      ${hasLeftIcon ? "pl-10" : ""}

      ${hasRightIcon ? "pr-10" : ""}

      ${
        error
          ? `
            border-red-400
            focus:border-red-500
            focus:ring-2
            focus:ring-red-100
          `
          : `
            border-gray-300
            hover:border-gray-400
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          `
      }

      ${
        disabled
          ? `
            bg-gray-100
            text-gray-400
            cursor-not-allowed
            hover:border-gray-300
          `
          : ""
      }

      ${inputClassName}
    `;

    // =======================================================
    // UI
    // =======================================================

    return (
      <div className={`w-full ${containerClassName}`}>
        {/* =================================================
            LABEL
        ================================================== */}

        {label && (
          <label
            htmlFor={inputId}
            className={`
              block
              mb-1.5
              text-sm
              font-medium
              text-gray-700
              ${labelClassName}
            `}
          >
            {label}

            {requiredMark && props.required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
        )}

        {/* =================================================
            INPUT WRAPPER
        ================================================== */}

        <div className="relative">
          {/* LEFT ICON */}

          {leftIcon && (
            <div
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                flex
                items-center
                justify-center
                text-gray-400
                pointer-events-none
              "
            >
              {leftIcon}
            </div>
          )}

          {/* INPUT */}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={inputType}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={inputStyles}
            {...props}
          />

          {/* RIGHT ICON */}

          {showPasswordToggle && type === "password" ? (
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => setShowPassword((previous) => !previous)}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                hover:text-gray-600
                disabled:cursor-not-allowed
              "
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          ) : error ? (
            <div
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-red-500
                pointer-events-none
              "
            >
              <AlertCircle className="w-5 h-5" />
            </div>
          ) : rightIcon ? (
            <div
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                flex
                items-center
                justify-center
                text-gray-400
              "
            >
              {rightIcon}
            </div>
          ) : null}
        </div>

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <p
            id={`${inputId}-error`}
            className="
              flex
              items-center
              gap-1
              mt-1.5
              text-xs
              text-red-600
            "
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />

            {error}
          </p>
        )}

        {/* =================================================
            HELPER TEXT
        ================================================== */}

        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="
              mt-1.5
              text-xs
              text-gray-500
            "
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
