// ============================================================
// REVIEW TYPES
// ============================================================

export interface ReviewUser {
  _id: string;
  name: string;
  email?: string;
  profilePicture?: string;
}

// ============================================================
// REVIEW VEHICLE
// ============================================================

export interface ReviewVehicle {
  _id: string;

  name?: string;
  brand?: string;
  model?: string;

  vehicleType?: string;
  type?: string;

  images?: string[];
  image?: string;
}

// ============================================================
// REVIEW
// ============================================================

export interface Review {
  _id: string;

  user: ReviewUser | string | null;

  reviewer?: ReviewUser | string | null;

  vehicle: ReviewVehicle | string | null;

  booking?:
    | string
    | {
        _id: string;
      }
    | null;

  rating: number;

  comment: string;

  title?: string;

  isApproved?: boolean;

  isPublished?: boolean;

  ownerReply?: string;

  ownerReplyAt?: string | null;

  createdAt?: string;

  updatedAt?: string;
}

// ============================================================
// CREATE REVIEW
// ============================================================

export interface CreateReviewData {
  vehicleId: string;

  bookingId?: string;

  rating: number;

  comment: string;

  title?: string;
}

// ============================================================
// UPDATE REVIEW
// ============================================================

export interface UpdateReviewData {
  rating?: number;

  comment?: string;

  title?: string;
}

// ============================================================
// OWNER REPLY
// ============================================================

export interface ReviewReplyData {
  reply: string;
}

// ============================================================
// REVIEW RESPONSE
// ============================================================

export interface ReviewResponse {
  success?: boolean;

  message?: string;

  review?: Review;

  data?: Review;
}

// ============================================================
// REVIEWS RESPONSE
// ============================================================

export interface ReviewsResponse {
  success?: boolean;

  message?: string;

  reviews?: Review[];

  data?: Review[];

  total?: number;

  averageRating?: number;

  totalReviews?: number;

  page?: number;

  limit?: number;

  totalPages?: number;

  pages?: number;
}

// ============================================================
// REVIEW FILTERS
// ============================================================

export interface ReviewFilters {
  vehicleId?: string;

  userId?: string;

  ownerId?: string;

  rating?: number;

  minRating?: number;

  maxRating?: number;

  search?: string;

  page?: number;

  limit?: number;

  sort?: "newest" | "oldest" | "highest" | "lowest";
}

// ============================================================
// REVIEW SUMMARY
// ============================================================

export interface ReviewSummary {
  averageRating: number;

  totalReviews: number;

  fiveStar: number;

  fourStar: number;

  threeStar: number;

  twoStar: number;

  oneStar: number;
}

// ============================================================
// REVIEW CARD PROPS
// ============================================================

export interface ReviewCardProps {
  review: Review;

  showVehicle?: boolean;

  showActions?: boolean;

  onEdit?: (review: Review) => void;

  onDelete?: (review: Review) => void;

  onReply?: (review: Review) => void;
}

// ============================================================
// REVIEW FORM PROPS
// ============================================================

export interface ReviewFormProps {
  vehicleId: string;

  bookingId?: string;

  existingReview?: Review;

  onSuccess?: (review: Review) => void;

  onCancel?: () => void;
}

// ============================================================
// STAR RATING PROPS
// ============================================================

export interface StarRatingProps {
  rating: number;

  maxRating?: number;

  readonly?: boolean;

  size?: "sm" | "md" | "lg";

  onChange?: (rating: number) => void;
}

// ============================================================
// RATING VALUES
// ============================================================

export const RATING_VALUES = [1, 2, 3, 4, 5] as const;

export type RatingValue = (typeof RATING_VALUES)[number];

// ============================================================
// RATING LABEL
// ============================================================

export const getRatingLabel = (rating: number): string => {
  switch (rating) {
    case 5:
      return "Excellent";

    case 4:
      return "Very Good";

    case 3:
      return "Good";

    case 2:
      return "Fair";

    case 1:
      return "Poor";

    default:
      return "No Rating";
  }
};

// ============================================================
// RATING COLOR
// ============================================================

export const getRatingColor = (rating: number): string => {
  if (rating >= 5) {
    return "text-green-600";
  }

  if (rating >= 4) {
    return "text-emerald-600";
  }

  if (rating >= 3) {
    return "text-yellow-600";
  }

  if (rating >= 2) {
    return "text-orange-600";
  }

  if (rating >= 1) {
    return "text-red-600";
  }

  return "text-gray-400";
};

// ============================================================
// RATING BACKGROUND
// ============================================================

export const getRatingBackground = (rating: number): string => {
  if (rating >= 5) {
    return "bg-green-100 text-green-700";
  }

  if (rating >= 4) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (rating >= 3) {
    return "bg-yellow-100 text-yellow-700";
  }

  if (rating >= 2) {
    return "bg-orange-100 text-orange-700";
  }

  if (rating >= 1) {
    return "bg-red-100 text-red-700";
  }

  return "bg-gray-100 text-gray-600";
};

// ============================================================
// FORMAT RATING
// ============================================================

export const formatRating = (rating: number): string => {
  if (!Number.isFinite(rating)) {
    return "0.0";
  }

  return rating.toFixed(1);
};

// ============================================================
// VALIDATE RATING
// ============================================================

export const isValidRating = (rating: number): boolean => {
  return Number.isFinite(rating) && rating >= 1 && rating <= 5;
};

// ============================================================
// VALIDATE REVIEW
// ============================================================

export const validateReview = (
  rating: number,
  comment: string,
): string | null => {
  if (!isValidRating(rating)) {
    return "Please select a rating between 1 and 5.";
  }

  if (!comment.trim()) {
    return "Please enter a review.";
  }

  if (comment.trim().length < 5) {
    return "Review must contain at least 5 characters.";
  }

  if (comment.trim().length > 1000) {
    return "Review cannot exceed 1000 characters.";
  }

  return null;
};

// ============================================================
// CALCULATE AVERAGE RATING
// ============================================================

export const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) {
    return 0;
  }

  const total = reviews.reduce(
    (sum, review) => sum + Number(review.rating || 0),
    0,
  );

  return total / reviews.length;
};

// ============================================================
// GET RATING DISTRIBUTION
// ============================================================

export const getRatingDistribution = (reviews: Review[]): ReviewSummary => {
  const distribution: ReviewSummary = {
    averageRating: calculateAverageRating(reviews),

    totalReviews: reviews.length,

    fiveStar: 0,

    fourStar: 0,

    threeStar: 0,

    twoStar: 0,

    oneStar: 0,
  };

  reviews.forEach((review) => {
    switch (Math.round(review.rating)) {
      case 5:
        distribution.fiveStar++;
        break;

      case 4:
        distribution.fourStar++;
        break;

      case 3:
        distribution.threeStar++;
        break;

      case 2:
        distribution.twoStar++;
        break;

      case 1:
        distribution.oneStar++;
        break;

      default:
        break;
    }
  });

  return distribution;
};

// ============================================================
// RATING PERCENTAGE
// ============================================================

export const getRatingPercentage = (
  reviews: Review[],
  rating: number,
): number => {
  if (reviews.length === 0) {
    return 0;
  }

  const count = reviews.filter(
    (review) => Math.round(review.rating) === rating,
  ).length;

  return Math.round((count / reviews.length) * 100);
};

// ============================================================
// SORT REVIEWS
// ============================================================

export const sortReviews = (
  reviews: Review[],
  sort: "newest" | "oldest" | "highest" | "lowest" = "newest",
): Review[] => {
  return [...reviews].sort((a, b) => {
    switch (sort) {
      case "oldest": {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;

        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return dateA - dateB;
      }

      case "highest":
        return b.rating - a.rating;

      case "lowest":
        return a.rating - b.rating;

      case "newest":
      default: {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;

        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return dateB - dateA;
      }
    }
  });
};

// ============================================================
// FORMAT REVIEW DATE
// ============================================================

export const formatReviewDate = (date?: string): string => {
  if (!date) {
    return "";
  }

  const reviewDate = new Date(date);

  if (Number.isNaN(reviewDate.getTime())) {
    return "";
  }

  return reviewDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ============================================================
// GET REVIEWER NAME
// ============================================================

export const getReviewerName = (review: Review): string => {
  if (typeof review.user === "object" && review.user) {
    return review.user.name || "Anonymous User";
  }

  if (typeof review.reviewer === "object" && review.reviewer) {
    return review.reviewer.name || "Anonymous User";
  }

  return "Anonymous User";
};

// ============================================================
// GET VEHICLE NAME
// ============================================================

export const getReviewVehicleName = (review: Review): string => {
  if (typeof review.vehicle === "object" && review.vehicle) {
    const vehicle = review.vehicle;

    if (vehicle.name) {
      return vehicle.name;
    }

    if (vehicle.brand || vehicle.model) {
      return [vehicle.brand, vehicle.model].filter(Boolean).join(" ");
    }
  }

  return "Vehicle";
};
