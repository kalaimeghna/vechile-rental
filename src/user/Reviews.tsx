import React, { useMemo, useState } from "react";
import { Star, ThumbsUp, CheckCircle2, MessageSquare } from "lucide-react";

interface Review {
  _id: string;
  user: {
    _id?: string;
    name: string;
    profilePicture?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  helpfulCount?: number;
  verified?: boolean;
}

interface ReviewsProps {
  reviews?: Review[];
  isLoggedIn?: boolean;
  onSubmitReview?: (data: {
    rating: number;
    comment: string;
  }) => Promise<void> | void;
  onHelpful?: (reviewId: string) => Promise<void> | void;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    _id: "1",
    user: {
      name: "Arun Kumar",
    },
    rating: 5,
    comment:
      "Excellent vehicle and very clean. The booking process was easy and the owner was very helpful.",
    createdAt: "2026-08-10T10:30:00.000Z",
    helpfulCount: 8,
    verified: true,
  },
  {
    _id: "2",
    user: {
      name: "Priya S",
    },
    rating: 4,
    comment:
      "Good vehicle for a family trip. Pickup was smooth and the car was in good condition.",
    createdAt: "2026-08-05T08:15:00.000Z",
    helpfulCount: 4,
    verified: true,
  },
  {
    _id: "3",
    user: {
      name: "Rahul",
    },
    rating: 5,
    comment: "Great experience. I would definitely rent this vehicle again.",
    createdAt: "2026-07-28T12:00:00.000Z",
    helpfulCount: 6,
    verified: false,
  },
];

const STAR_VALUES = [1, 2, 3, 4, 5];

const formatReviewDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name: string): string => {
  if (!name) {
    return "U";
  }

  return name
    .trim()
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const getRatingLabel = (rating: number): string => {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4) return "Very Good";
  if (rating >= 3) return "Good";
  if (rating >= 2) return "Average";
  return "Poor";
};

const StarRating = ({
  rating,
  size = 18,
  interactive = false,
  onChange,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) => {
  return (
    <div className="flex items-center gap-1">
      {STAR_VALUES.map((star) => {
        const active = star <= rating;

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <Star
                size={size}
                fill={active ? "currentColor" : "none"}
                className={active ? "text-yellow-400" : "text-slate-300"}
              />
            </button>
          );
        }

        return (
          <Star
            key={star}
            size={size}
            fill={active ? "currentColor" : "none"}
            className={active ? "text-yellow-400" : "text-slate-300"}
          />
        );
      })}
    </div>
  );
};

export default function Reviews({
  reviews = DEFAULT_REVIEWS,
  isLoggedIn = false,
  onSubmitReview,
  onHelpful,
}: ReviewsProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [helpfulDeltas, setHelpfulDeltas] = useState<Record<string, number>>(
    {},
  );

  /*
   * ----------------------------------------------------------
   * Rating Statistics
   * ----------------------------------------------------------
   */

  const statistics = useMemo(() => {
    if (!reviews.length) {
      return {
        average: 0,
        total: 0,
        percentages: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };
    }

    const total = reviews.length;
    const totalRating = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0,
    );
    const average = totalRating / total;

    const counts: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      const reviewRating = Math.round(review.rating);

      if (reviewRating >= 1 && reviewRating <= 5) {
        counts[reviewRating]++;
      }
    });

    return {
      average,
      total,
      percentages: {
        5: (counts[5] / total) * 100,
        4: (counts[4] / total) * 100,
        3: (counts[3] / total) * 100,
        2: (counts[2] / total) * 100,
        1: (counts[1] / total) * 100,
      },
    };
  }, [reviews]);

  /*
   * ----------------------------------------------------------
   * Submit Review
   * ----------------------------------------------------------
   */

  const handleSubmitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!isLoggedIn) {
      setError("Please login to submit a review.");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      setError("Please enter your review.");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Review must contain at least 10 characters.");
      return;
    }

    if (comment.trim().length > 1000) {
      setError("Review cannot exceed 1000 characters.");
      return;
    }

    try {
      setSubmitting(true);

      await onSubmitReview?.({
        rating,
        comment: comment.trim(),
      });

      setRating(0);
      setComment("");
    } catch (submitError) {
      console.error("Failed to submit review:", submitError);
      setError("Unable to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * ----------------------------------------------------------
   * Helpful
   * ----------------------------------------------------------
   */

  const handleHelpful = async (reviewId: string) => {
    if (!isLoggedIn) {
      alert("Please login to mark a review as helpful.");
      return;
    }

    if (helpfulReviews.has(reviewId)) {
      return;
    }

    try {
      await onHelpful?.(reviewId);

      setHelpfulReviews((previous) => {
        const updated = new Set(previous);
        updated.add(reviewId);
        return updated;
      });

      setHelpfulDeltas((previous) => ({
        ...previous,
        [reviewId]: (previous[reviewId] || 0) + 1,
      }));
    } catch (helpfulError) {
      console.error("Helpful action failed:", helpfulError);
    }
  };

  return (
    <section
      id="reviews"
      className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-500">
          <MessageSquare size={22} />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">
            Customer Reviews
          </h2>

          <p className="text-sm text-slate-500">See what other customers say</p>
        </div>
      </div>

      {/* =====================================================
          RATING SUMMARY
      ====================================================== */}

      <div className="mb-8 grid gap-6 border-b border-slate-100 pb-8 md:grid-cols-[180px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-5 text-center">
          <p className="text-5xl font-black text-slate-900">
            {statistics.average.toFixed(1)}
          </p>

          <div className="my-2">
            <StarRating rating={Math.round(statistics.average)} size={18} />
          </div>

          <p className="font-semibold text-slate-600">
            {getRatingLabel(statistics.average)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {statistics.total} {statistics.total === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3">
          {([5, 4, 3, 2, 1] as const).map((value) => (
            <div key={value} className="flex items-center gap-3">
              <div className="flex w-10 items-center gap-1 text-sm font-semibold text-slate-600">
                {value}
                <Star
                  size={13}
                  fill="currentColor"
                  className="text-yellow-400"
                />
              </div>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                  style={{
                    width: `${statistics.percentages[value]}%`,
                  }}
                />
              </div>

              <span className="w-10 text-right text-xs text-slate-400">
                {Math.round(statistics.percentages[value])}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          REVIEW FORM
      ====================================================== */}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="mb-5">
          <h3 className="text-lg font-black text-slate-900">Write a Review</h3>

          <p className="mt-1 text-sm text-slate-500">
            Share your experience with this vehicle.
          </p>
        </div>

        {!isLoggedIn ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-700">
              Please login to write a review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview}>
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Your Rating
              </label>

              <div className="flex items-center gap-2">
                <StarRating
                  rating={rating}
                  size={27}
                  interactive
                  onChange={setRating}
                />

                {rating > 0 && (
                  <span className="ml-2 text-sm font-semibold text-slate-500">
                    {getRatingLabel(rating)}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="review-comment"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Your Review
              </label>

              <textarea
                id="review-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="Tell us about your rental experience..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <div className="mt-1 flex justify-end">
                <span className="text-xs text-slate-400">
                  {comment.length}/1000
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>

      {/* =====================================================
          REVIEW LIST
      ====================================================== */}

      <div>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">
            Customer Feedback
          </h3>

          <span className="text-sm text-slate-400">
            {reviews.length} reviews
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <MessageSquare size={36} className="mx-auto mb-3 text-slate-300" />

            <h4 className="font-bold text-slate-700">No reviews yet</h4>

            <p className="mt-1 text-sm text-slate-400">
              Be the first person to review this vehicle.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((review) => {
              const isHelpful = helpfulReviews.has(review._id);
              const baseCount = review.helpfulCount || 0;
              const delta = helpfulDeltas[review._id] || 0;
              const helpfulCount = baseCount + delta;

              return (
                <article key={review._id} className="py-6 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {review.user.profilePicture ? (
                        <img
                          src={review.user.profilePicture}
                          alt={review.user.name}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-blue-600">
                          {getInitials(review.user.name)}
                        </div>
                      )}

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-slate-900">
                            {review.user.name}
                          </h4>

                          {review.verified && (
                            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
                              <CheckCircle2 size={11} />
                              Verified
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {formatReviewDate(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    <StarRating rating={review.rating} size={16} />
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {review.comment}
                  </p>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => handleHelpful(review._id)}
                      disabled={isHelpful}
                      className={`
                        flex items-center gap-2
                        rounded-lg px-3 py-2
                        text-xs font-semibold
                        transition
                        ${
                          isHelpful
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        }
                      `}
                    >
                      <ThumbsUp
                        size={14}
                        fill={isHelpful ? "currentColor" : "none"}
                      />
                      Helpful
                      {helpfulCount > 0 && <span>({helpfulCount})</span>}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
