// src/pages/owner/OwnerReviews.tsx

import React, { useEffect, useMemo, useState } from "react";
import {
  Star,
  Search,
  RefreshCw,
  Loader2,
  MessageSquare,
  Car,
  User,
  CalendarDays,
  Filter,
  AlertCircle,
  X,
} from "lucide-react";
import axiosInstance from "../../api/axios";

// =========================================================
// TYPES
// =========================================================

interface Reviewer {
  _id?: string;
  name?: string;
  email?: string;
  profilePicture?: string;
}

interface Vehicle {
  _id?: string;
  name?: string;
  brand?: string;
  model?: string;
  images?: string[];
}

interface Review {
  _id: string;

  rating?: number;
  comment?: string;
  review?: string;
  message?: string;

  reviewer?: Reviewer | null;
  user?: Reviewer | null;
  customer?: Reviewer | null;

  vehicle?: Vehicle | null;

  createdAt?: string;
  updatedAt?: string;
}

// =========================================================
// STAR COMPONENT
// =========================================================

interface StarsProps {
  rating: number;
  size?: number;
}

const Stars: React.FC<StarsProps> = ({ rating, size = 18 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const OwnerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [ratingFilter, setRatingFilter] = useState("All");

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // =========================================================
  // FETCH REVIEWS
  // =========================================================

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Expected backend:
       *
       * GET /api/reviews/owner
       */

      const response = await axiosInstance.get("/reviews/owner");

      console.log("Owner reviews:", response.data);

      const data =
        response.data?.reviews || response.data?.data || response.data || [];

      setReviews(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Fetch owner reviews error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load reviews.",
      );

      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getReviewer = (review: Review): Reviewer | null => {
    return review.reviewer || review.user || review.customer || null;
  };

  const getVehicleName = (review: Review): string => {
    const vehicle = review.vehicle;

    if (!vehicle) {
      return "Vehicle";
    }

    if (vehicle.name) {
      return vehicle.name;
    }

    const fullName = `${vehicle.brand || ""} ${vehicle.model || ""}`.trim();

    return fullName || "Vehicle";
  };

  const getVehicleImage = (review: Review): string => {
    if (review.vehicle?.images && review.vehicle.images.length > 0) {
      return review.vehicle.images[0];
    }

    return "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80";
  };

  const getRating = (review: Review): number => {
    const rating = Number(review.rating || 0);

    if (Number.isNaN(rating)) {
      return 0;
    }

    return Math.min(5, Math.max(0, rating));
  };

  const getComment = (review: Review): string => {
    return review.comment || review.review || review.message || "";
  };

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

  // =========================================================
  // STATISTICS
  // =========================================================

  const statistics = useMemo(() => {
    const total = reviews.length;

    if (total === 0) {
      return {
        total: 0,
        average: 0,
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0,
      };
    }

    const five = reviews.filter((review) => getRating(review) === 5).length;

    const four = reviews.filter((review) => getRating(review) === 4).length;

    const three = reviews.filter((review) => getRating(review) === 3).length;

    const two = reviews.filter((review) => getRating(review) === 2).length;

    const one = reviews.filter((review) => getRating(review) === 1).length;

    const totalRating = reviews.reduce(
      (sum, review) => sum + getRating(review),
      0,
    );

    return {
      total,
      average: totalRating / total,
      five,
      four,
      three,
      two,
      one,
    };
  }, [reviews]);

  // =========================================================
  // FILTER REVIEWS
  // =========================================================

  const filteredReviews = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const reviewer = getReviewer(review);

      const vehicleName = getVehicleName(review).toLowerCase();

      const reviewerName = (reviewer?.name || "").toLowerCase();

      const reviewerEmail = (reviewer?.email || "").toLowerCase();

      const comment = getComment(review).toLowerCase();

      const rating = getRating(review);

      const matchesSearch =
        !searchText ||
        vehicleName.includes(searchText) ||
        reviewerName.includes(searchText) ||
        reviewerEmail.includes(searchText) ||
        comment.includes(searchText);

      const matchesRating =
        ratingFilter === "All" || rating === Number(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [reviews, search, ratingFilter]);

  // =========================================================
  // RATING BAR
  // =========================================================

  const ratingPercentage = (count: number): number => {
    if (statistics.total === 0) {
      return 0;
    }

    return (count / statistics.total) * 100;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />

          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Customer Reviews
            </h1>

            <p className="text-gray-500 mt-1">
              See what renters are saying about your vehicles
            </p>
          </div>

          <button
            type="button"
            onClick={fetchReviews}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5" />

            <div className="flex-1">
              <p className="font-medium">Error</p>

              <p className="text-sm mt-1">{error}</p>
            </div>

            <button type="button" onClick={() => setError("")}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ===================================================
            SUMMARY
        ==================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Average Rating */}

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-gray-500">Overall Rating</p>

              <div className="text-5xl font-bold text-gray-900 mt-3">
                {statistics.average.toFixed(1)}
              </div>

              <div className="mt-3">
                <Stars rating={statistics.average} size={24} />
              </div>

              <p className="text-sm text-gray-500 mt-3">
                Based on{" "}
                <span className="font-semibold text-gray-900">
                  {statistics.total}
                </span>{" "}
                reviews
              </p>
            </div>
          </div>

          {/* Rating Distribution */}

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-5">
              Rating Distribution
            </h2>

            <div className="space-y-3">
              {/* 5 */}
              <div className="flex items-center gap-3">
                <span className="w-8 text-sm font-medium">5</span>

                <Star size={16} className="fill-yellow-400 text-yellow-400" />

                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${ratingPercentage(statistics.five)}%`,
                    }}
                  />
                </div>

                <span className="w-8 text-right text-sm text-gray-500">
                  {statistics.five}
                </span>
              </div>

              {/* 4 */}
              <div className="flex items-center gap-3">
                <span className="w-8 text-sm font-medium">4</span>

                <Star size={16} className="fill-yellow-400 text-yellow-400" />

                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${ratingPercentage(statistics.four)}%`,
                    }}
                  />
                </div>

                <span className="w-8 text-right text-sm text-gray-500">
                  {statistics.four}
                </span>
              </div>

              {/* 3 */}
              <div className="flex items-center gap-3">
                <span className="w-8 text-sm font-medium">3</span>

                <Star size={16} className="fill-yellow-400 text-yellow-400" />

                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${ratingPercentage(statistics.three)}%`,
                    }}
                  />
                </div>

                <span className="w-8 text-right text-sm text-gray-500">
                  {statistics.three}
                </span>
              </div>

              {/* 2 */}
              <div className="flex items-center gap-3">
                <span className="w-8 text-sm font-medium">2</span>

                <Star size={16} className="fill-yellow-400 text-yellow-400" />

                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${ratingPercentage(statistics.two)}%`,
                    }}
                  />
                </div>

                <span className="w-8 text-right text-sm text-gray-500">
                  {statistics.two}
                </span>
              </div>

              {/* 1 */}
              <div className="flex items-center gap-3">
                <span className="w-8 text-sm font-medium">1</span>

                <Star size={16} className="fill-yellow-400 text-yellow-400" />

                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${ratingPercentage(statistics.one)}%`,
                    }}
                  />
                </div>

                <span className="w-8 text-right text-sm text-gray-500">
                  {statistics.one}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            SEARCH / FILTER
        ==================================================== */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer, vehicle or review..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Rating */}

            <div className="relative md:w-56">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="All">All Ratings</option>

                <option value="5">5 Stars</option>

                <option value="4">4 Stars</option>

                <option value="3">3 Stars</option>

                <option value="2">2 Stars</option>

                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===================================================
            RESULTS COUNT
        ==================================================== */}

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredReviews.length}
            </span>{" "}
            reviews
          </p>

          {(search || ratingFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRatingFilter("All");
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ===================================================
            REVIEWS
        ==================================================== */}

        {filteredReviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-5">
              No reviews found
            </h2>

            <p className="text-gray-500 mt-2">
              {reviews.length === 0
                ? "Your vehicles haven't received any reviews yet."
                : "Try changing your search or rating filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => {
              const reviewer = getReviewer(review);

              const rating = getRating(review);

              return (
                <div
                  key={review._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row gap-5">
                      {/* Vehicle */}

                      <div className="w-full lg:w-48 shrink-0">
                        <img
                          src={getVehicleImage(review)}
                          alt={getVehicleName(review)}
                          className="w-full h-32 object-cover rounded-lg"
                        />

                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Car className="w-4 h-4 text-blue-500" />

                          <span className="font-medium truncate">
                            {getVehicleName(review)}
                          </span>
                        </div>
                      </div>

                      {/* Review Content */}

                      <div className="flex-1 min-w-0">
                        {/* Reviewer */}

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {reviewer?.profilePicture ? (
                              <img
                                src={reviewer.profilePicture}
                                alt={reviewer.name || "Reviewer"}
                                className="w-11 h-11 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                            )}

                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {reviewer?.name || "Customer"}
                              </h3>

                              {reviewer?.email && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {reviewer.email}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Rating */}

                          <div className="flex items-center gap-2">
                            <Stars rating={rating} size={17} />

                            <span className="text-sm font-semibold text-gray-700">
                              {rating.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        {/* Comment */}

                        <div className="mt-4">
                          {getComment(review) ? (
                            <p className="text-gray-700 leading-relaxed">
                              "{getComment(review)}"
                            </p>
                          ) : (
                            <p className="text-gray-400 italic">
                              No written comment
                            </p>
                          )}
                        </div>

                        {/* Date + Details */}

                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CalendarDays className="w-4 h-4" />

                            {formatDate(review.createdAt)}
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedReview(review)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            View Review
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================
          REVIEW DETAILS MODAL
      ====================================================== */}

      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Review Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">Customer feedback</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}

            <div className="p-6">
              {/* Vehicle */}

              <div className="flex items-center gap-4">
                <img
                  src={getVehicleImage(selectedReview)}
                  alt={getVehicleName(selectedReview)}
                  className="w-20 h-16 object-cover rounded-lg"
                />

                <div>
                  <p className="text-xs text-gray-400">Vehicle</p>

                  <h3 className="font-bold text-gray-900">
                    {getVehicleName(selectedReview)}
                  </h3>
                </div>
              </div>

              {/* Reviewer */}

              <div className="flex items-center gap-3 mt-6">
                {getReviewer(selectedReview)?.profilePicture ? (
                  <img
                    src={getReviewer(selectedReview)?.profilePicture}
                    alt="Reviewer"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {getReviewer(selectedReview)?.name || "Customer"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {getReviewer(selectedReview)?.email || ""}
                  </p>
                </div>
              </div>

              {/* Rating */}

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-2">Rating</p>

                <div className="flex items-center gap-3">
                  <Stars rating={getRating(selectedReview)} size={25} />

                  <span className="text-xl font-bold text-gray-900">
                    {getRating(selectedReview).toFixed(1)}
                    /5
                  </span>
                </div>
              </div>

              {/* Comment */}

              <div className="mt-5">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Customer Comment
                </p>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700 leading-relaxed">
                    {getComment(selectedReview) ||
                      "No written comment provided."}
                  </p>
                </div>
              </div>

              {/* Date */}

              <div className="flex items-center gap-2 mt-5 text-sm text-gray-500">
                <CalendarDays className="w-4 h-4" />
                Reviewed on {formatDate(selectedReview.createdAt)}
              </div>
            </div>

            {/* Footer */}

            <div className="px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="w-full px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerReviews;
