import { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  Filter,
  Car,
  ThumbsUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface Review {
  id: string;
  customerName: string;
  vehicleName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function OwnerReviews() {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterRating, setFilterRating] = useState<string>("all");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // Fetch logic wrapped safely to satisfy strict linter rules
  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        // Simulate backend API call (Replace with actual fetch('/api/owner/reviews'))
        await new Promise((resolve) => setTimeout(resolve, 600));

        const mockReviews: Review[] = [
          {
            id: "1",
            customerName: "Sarah Jenkins",
            vehicleName: "Tesla Model 3 Long Range",
            rating: 5,
            comment:
              "Amazing car! Clean, fully charged, and the owner was extremely helpful with pickup instructions.",
            date: "2026-06-12",
          },
          {
            id: "2",
            customerName: "David Miller",
            vehicleName: "BMW X5 SUV",
            rating: 4,
            comment:
              "Great ride for a family road trip. Smooth driving experience. Minor delay on communication during drop-off.",
            date: "2026-06-08",
          },
          {
            id: "3",
            customerName: "Elena Rostova",
            vehicleName: "Tesla Model 3 Long Range",
            rating: 5,
            comment:
              "Super clean vehicle and effortless contactless pickup process. Will definitely rent again!",
            date: "2026-05-29",
          },
          {
            id: "4",
            customerName: "Marcus Vance",
            vehicleName: "Audi A4 Premium",
            rating: 3,
            comment:
              "Car condition was okay, but the interior had a faint smoke smell upon arrival.",
            date: "2026-05-20",
          },
        ];

        if (isMounted) {
          setReviews(mockReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleManualRefresh = async () => {
    setLoading(true);
    // Re-run the simulation or your actual fetch logic here
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
  };

  // Filter reviews by star rating
  const filteredReviews = reviews.filter((review) => {
    if (filterRating === "all") return true;
    return review.rating.toString() === filterRating;
  });

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const handleReplySubmit = (reviewId: string) => {
    alert(`Reply sent for review #${reviewId}: "${replyText[reviewId] || ""}"`);
    setActiveReplyId(null);
    setReplyText({ ...replyText, [reviewId]: "" });
  };

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Customer Reviews
          </h1>
          <p className="text-sm text-slate-500">
            Monitor feedback and maintain your vehicle reputation.
          </p>
        </div>
        <button
          onClick={handleManualRefresh}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Reviews
        </button>
      </div>

      {/* Summary Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
            {averageRating}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Average Rating
            </div>
            <div className="text-xs text-slate-400">
              Based on {reviews.length} total reviews
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Satisfaction Score
            </div>
            <div className="text-xs text-emerald-600 font-medium">
              92% Positive Feedback
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Response Rate
            </div>
            <div className="text-xs text-slate-400">
              100% replied within 24h
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter by Rating:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "5", "4", "3", "2", "1"].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilterRating(rating)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterRating === rating
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {rating === "all" ? "All Ratings" : `${rating} Stars`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400 text-sm">
          Loading reviews...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p>No reviews found matching this filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {review.customerName}
                    </h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Car className="w-3.5 h-3.5 text-blue-600" />{" "}
                      {review.vehicleName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-2">
                    {review.date}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 my-3 leading-relaxed">
                "{review.comment}"
              </p>

              {/* Reply Section Toggle */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3">
                {activeReplyId === review.id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      rows={2}
                      value={replyText[review.id] || ""}
                      onChange={(e) =>
                        setReplyText({
                          ...replyText,
                          [review.id]: e.target.value,
                        })
                      }
                      placeholder="Write a professional reply to this customer..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setActiveReplyId(null)}
                        className="px-3 py-1.5 text-xs text-slate-500 font-medium hover:bg-slate-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReplySubmit(review.id)}
                        className="px-4 py-1.5 text-xs bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveReplyId(review.id)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 w-fit"
                  >
                    Reply to Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
