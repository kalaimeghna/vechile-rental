import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

// =========================================================
// TYPES
// =========================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;

  title?: string;
  subtitle?: string;

  children: React.ReactNode;

  /**
   * Modal width
   */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  /**
   * Show close button
   */
  showCloseButton?: boolean;

  /**
   * Close when clicking outside modal
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close when pressing Escape
   */
  closeOnEscape?: boolean;

  /**
   * Optional footer
   */
  footer?: React.ReactNode;

  /**
   * Additional className for modal body
   */
  className?: string;

  /**
   * Disable body scroll while modal is open
   */
  lockScroll?: boolean;
}

// =========================================================
// COMPONENT
// =========================================================

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className = "",
  lockScroll = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // =======================================================
  // ESCAPE + BODY SCROLL
  // =======================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    if (lockScroll) {
      const previousOverflow = document.body.style.overflow;

      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);

        document.body.style.overflow = previousOverflow;
      };
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEscape, lockScroll]);

  // =======================================================
  // FOCUS MODAL
  // =======================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => {
      modalRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  // =======================================================
  // OVERLAY CLICK
  // =======================================================

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) {
      return;
    }

    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // =======================================================
  // SIZE
  // =======================================================

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-6xl",
  };

  // =======================================================
  // DON'T RENDER
  // =======================================================

  if (!isOpen) {
    return null;
  }

  // =======================================================
  // UI
  // =======================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        p-4
        sm:p-6
        bg-black/50
        backdrop-blur-[2px]
      "
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={subtitle ? "modal-subtitle" : undefined}
        onMouseDown={(event) => event.stopPropagation()}
        className={`
          relative
          w-full
          ${sizeClasses[size]}
          max-h-[90vh]
          bg-white
          rounded-2xl
          shadow-2xl
          flex
          flex-col
          overflow-hidden
          outline-none
          animate-[modalIn_0.2s_ease-out]
          ${className}
        `}
      >
        {/* =================================================
            HEADER
        ================================================== */}

        {(title || subtitle || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-200 bg-white">
            <div className="min-w-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg sm:text-xl font-bold text-gray-900"
                >
                  {title}
                </h2>
              )}

              {subtitle && (
                <p id="modal-subtitle" className="mt-1 text-sm text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="
                  shrink-0
                  p-2
                  rounded-lg
                  text-gray-400
                  hover:text-gray-700
                  hover:bg-gray-100
                  transition
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* =================================================
            BODY
        ================================================== */}

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {children}
        </div>

        {/* =================================================
            FOOTER
        ================================================== */}

        {footer && (
          <div className="px-5 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>

      {/* ===================================================
          ANIMATION
      ==================================================== */}

      <style>
        {`
          @keyframes modalIn {
            from {
              opacity: 0;
              transform: scale(0.96) translateY(8px);
            }

            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Modal;
