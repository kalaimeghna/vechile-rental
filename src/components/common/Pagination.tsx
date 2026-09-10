import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  /**
   * Optional total number of records.
   * Example: 125
   */
  totalItems?: number;

  /**
   * Optional number of records shown per page.
   * Default: 10
   */
  itemsPerPage?: number;

  /**
   * Show first/last page buttons.
   * Default: true
   */
  showFirstLast?: boolean;

  /**
   * Maximum number of page buttons to display.
   * Default: 5
   */
  maxVisiblePages?: number;

  /**
   * Optional custom className.
   */
  className?: string;

  /**
   * Hide pagination when there is only one page.
   * Default: true
   */
  hideOnSinglePage?: boolean;
}

// =========================================================
// COMPONENT
// =========================================================

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  showFirstLast = true,
  maxVisiblePages = 5,
  className = "",
  hideOnSinglePage = true,
}) => {
  // =======================================================
  // NORMALIZE VALUES
  // =======================================================

  const safeTotalPages = Math.max(1, Math.ceil(Number(totalPages) || 1));

  const safeCurrentPage = Math.min(
    Math.max(Number(currentPage) || 1, 1),
    safeTotalPages,
  );

  const safeItemsPerPage = Math.max(Number(itemsPerPage) || 10, 1);

  // =======================================================
  // HIDE IF ONLY ONE PAGE
  // =======================================================

  if (hideOnSinglePage && safeTotalPages <= 1) {
    return null;
  }

  // =======================================================
  // PAGE CHANGE
  // =======================================================

  const changePage = (page: number) => {
    if (page < 1 || page > safeTotalPages || page === safeCurrentPage) {
      return;
    }

    onPageChange(page);

    // Scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =======================================================
  // GENERATE PAGE NUMBERS
  // =======================================================

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    const maxPages = Math.max(3, maxVisiblePages);

    // -----------------------------------------------
    // Small number of pages
    // -----------------------------------------------

    if (safeTotalPages <= maxPages) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // -----------------------------------------------
    // Calculate visible range
    // -----------------------------------------------

    const sidePages = Math.floor((maxPages - 3) / 2);

    let startPage = safeCurrentPage - sidePages;

    let endPage = safeCurrentPage + sidePages;

    // -----------------------------------------------
    // Near beginning
    // -----------------------------------------------

    if (safeCurrentPage <= 3) {
      startPage = 1;
      endPage = maxPages - 2;
    }

    // -----------------------------------------------
    // Near end
    // -----------------------------------------------

    if (safeCurrentPage >= safeTotalPages - 2) {
      startPage = safeTotalPages - maxPages + 3;

      endPage = safeTotalPages;
    }

    // -----------------------------------------------
    // First page
    // -----------------------------------------------

    pages.push(1);

    // -----------------------------------------------
    // Left ellipsis
    // -----------------------------------------------

    if (startPage > 2) {
      pages.push("left-ellipsis");
    }

    // -----------------------------------------------
    // Middle pages
    // -----------------------------------------------

    for (let page = startPage; page <= endPage; page++) {
      if (page > 1 && page < safeTotalPages) {
        pages.push(page);
      }
    }

    // -----------------------------------------------
    // Right ellipsis
    // -----------------------------------------------

    if (endPage < safeTotalPages - 1) {
      pages.push("right-ellipsis");
    }

    // -----------------------------------------------
    // Last page
    // -----------------------------------------------

    pages.push(safeTotalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // =======================================================
  // ITEM RANGE
  // =======================================================

  const startItem =
    totalItems && totalItems > 0
      ? (safeCurrentPage - 1) * safeItemsPerPage + 1
      : 0;

  const endItem =
    totalItems && totalItems > 0
      ? Math.min(safeCurrentPage * safeItemsPerPage, totalItems)
      : 0;

  // =======================================================
  // BUTTON BASE CLASS
  // =======================================================

  const baseButtonClass = `
    flex
    items-center
    justify-center
    min-w-9
    h-9
    px-2
    rounded-lg
    border
    text-sm
    font-medium
    transition
  `;

  // =======================================================
  // UI
  // =======================================================

  return (
    <div
      className={`
        flex
        flex-col
        sm:flex-row
        items-center
        justify-between
        gap-4
        mt-6
        ${className}
      `}
    >
      {/* ===================================================
          RESULTS INFO
      ==================================================== */}

      {totalItems !== undefined ? (
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">{startItem}</span> to{" "}
          <span className="font-semibold text-gray-800">{endItem}</span> of{" "}
          <span className="font-semibold text-gray-800">{totalItems}</span>{" "}
          results
        </p>
      ) : (
        <p className="text-sm text-gray-500">
          Page{" "}
          <span className="font-semibold text-gray-800">{safeCurrentPage}</span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">{safeTotalPages}</span>
        </p>
      )}

      {/* ===================================================
          PAGINATION
      ==================================================== */}

      <div className="flex items-center gap-1">
        {/* -----------------------------------------------
            FIRST PAGE
        ------------------------------------------------ */}

        {showFirstLast && (
          <button
            type="button"
            onClick={() => changePage(1)}
            disabled={safeCurrentPage === 1}
            aria-label="First page"
            title="First page"
            className={`
              ${baseButtonClass}
              hidden
              sm:flex
              ${
                safeCurrentPage === 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* -----------------------------------------------
            PREVIOUS
        ------------------------------------------------ */}

        <button
          type="button"
          onClick={() => changePage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          aria-label="Previous page"
          title="Previous page"
          className={`
            ${baseButtonClass}
            ${
              safeCurrentPage === 1
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />

          <span className="hidden md:inline ml-1">Previous</span>
        </button>

        {/* -----------------------------------------------
            PAGE NUMBERS
        ------------------------------------------------ */}

        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            // -----------------------------------------
            // Ellipsis
            // -----------------------------------------

            if (typeof page === "string") {
              return (
                <span
                  key={`${page}-${index}`}
                  className="
                      flex
                      items-center
                      justify-center
                      w-9
                      h-9
                      text-gray-400
                      text-sm
                    "
                >
                  ...
                </span>
              );
            }

            // -----------------------------------------
            // Page button
            // -----------------------------------------

            const isActive = page === safeCurrentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => changePage(page)}
                aria-label={`Page ${page}`}
                aria-current={isActive ? "page" : undefined}
                className={`
                    ${baseButtonClass}
                    ${
                      isActive
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "border-gray-300 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                    }
                  `}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* -----------------------------------------------
            NEXT
        ------------------------------------------------ */}

        <button
          type="button"
          onClick={() => changePage(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          aria-label="Next page"
          title="Next page"
          className={`
            ${baseButtonClass}
            ${
              safeCurrentPage === safeTotalPages
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }
          `}
        >
          <span className="hidden md:inline mr-1">Next</span>

          <ChevronRight className="w-4 h-4" />
        </button>

        {/* -----------------------------------------------
            LAST PAGE
        ------------------------------------------------ */}

        {showFirstLast && (
          <button
            type="button"
            onClick={() => changePage(safeTotalPages)}
            disabled={safeCurrentPage === safeTotalPages}
            aria-label="Last page"
            title="Last page"
            className={`
              ${baseButtonClass}
              hidden
              sm:flex
              ${
                safeCurrentPage === safeTotalPages
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
