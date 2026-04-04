import { maskName, formatDate } from "@/lib/utils";
import type { ProductReview } from "@/modules/product/product.type";

interface Props {
  reviews: ProductReview[];
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className={i < rating ? "text-amber-400" : "text-border"}
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}

export default function ProductReviews({ reviews }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-surface border border-border-soft rounded-xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold">
                {review.customer_name
                  ? review.customer_name.charAt(0).toUpperCase()
                  : "?"}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {review.customer_name ? maskName(review.customer_name) : "—"}
                </p>
                <p className="text-xs text-muted">{formatDate(review.review_date)}</p>
              </div>
            </div>
            <StarRow rating={review.rating} />
          </div>
          {review.comment && (
            <p className="text-sm text-foreground/80 leading-relaxed">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
